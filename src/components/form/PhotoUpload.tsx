"use client";

import { useState, useRef, useCallback } from "react";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_LONG_EDGE = 2000;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const ACCEPT_STRING = ".jpg,.jpeg,.png,.webp,.heic,.heif";

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
  originalName: string;
  sizeBytes: number;
  status: "processing" | "ready" | "error";
};

type Props = {
  photos: File[];
  onChange: (files: File[]) => void;
};

function generateId() {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Check if file is HEIC/HEIF by extension or MIME */
function isHeic(file: File): boolean {
  const ext = file.name.toLowerCase();
  return (
    ext.endsWith(".heic") ||
    ext.endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}

/** Convert HEIC to JPEG Blob using heic2any */
async function convertHeicToJpeg(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });
  // heic2any can return Blob or Blob[]
  return Array.isArray(result) ? result[0] : result;
}

/** Resize image so longest edge is <= maxLongEdge, returns JPEG Blob */
function resizeImage(
  blob: Blob,
  maxLongEdge: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Only resize if larger than max
      if (width > maxLongEdge || height > maxLongEdge) {
        if (width >= height) {
          height = Math.round((height / width) * maxLongEdge);
          width = maxLongEdge;
        } else {
          width = Math.round((width / height) * maxLongEdge);
          height = maxLongEdge;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };

    img.src = url;
  });
}

/** Process a single file: HEIC convert → resize → return File */
async function processFile(file: File): Promise<File> {
  let blob: Blob = file;

  // Convert HEIC if needed
  if (isHeic(file)) {
    blob = await convertHeicToJpeg(file);
  }

  // Resize
  blob = await resizeImage(blob, MAX_LONG_EDGE);

  // Convert Blob back to File with a clean name
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

export function PhotoUpload({ photos, onChange }: Props) {
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setError(null);
      const files = Array.from(fileList);

      // Check total count
      const currentCount = items.length;
      if (currentCount + files.length > MAX_FILES) {
        setError(`写真は最大${MAX_FILES}枚までです。あと${MAX_FILES - currentCount}枚追加できます。`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const f of files) {
        if (f.size > MAX_FILE_SIZE) {
          setError(`「${f.name}」のサイズが大きすぎます（上限: 20MB）`);
          continue;
        }
        const ext = f.name.toLowerCase();
        const isValidType =
          ACCEPTED_TYPES.includes(f.type) ||
          ext.endsWith(".heic") ||
          ext.endsWith(".heif") ||
          ext.endsWith(".jpg") ||
          ext.endsWith(".jpeg") ||
          ext.endsWith(".png") ||
          ext.endsWith(".webp");
        if (!isValidType) {
          setError(
            `「${f.name}」は対応していないファイル形式です。JPG, PNG, WebP, HEIC に対応しています。`
          );
          continue;
        }
        validFiles.push(f);
      }

      if (validFiles.length === 0) return;

      // Create placeholder items
      const newItems: PhotoItem[] = validFiles.map((f) => ({
        id: generateId(),
        file: f,
        previewUrl: "",
        originalName: f.name,
        sizeBytes: f.size,
        status: "processing" as const,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Process each file asynchronously
      const processedFiles: File[] = [...photos];

      for (const item of newItems) {
        try {
          const processed = await processFile(item.file);
          const previewUrl = URL.createObjectURL(processed);

          processedFiles.push(processed);

          setItems((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? {
                    ...p,
                    file: processed,
                    previewUrl,
                    sizeBytes: processed.size,
                    status: "ready" as const,
                  }
                : p
            )
          );
        } catch {
          setItems((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, status: "error" as const } : p
            )
          );
        }
      }

      onChange(processedFiles);
    },
    [items, photos, onChange]
  );

  const removePhoto = useCallback(
    (id: string) => {
      setItems((prev) => {
        const target = prev.find((p) => p.id === id);
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);

        const next = prev.filter((p) => p.id !== id);
        // Rebuild the photos array from remaining ready items
        const remainingFiles = next
          .filter((p) => p.status === "ready")
          .map((p) => p.file);
        onChange(remainingFiles);
        return next;
      });
      setError(null);
    },
    [onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [addFiles]
  );

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`
          flex min-h-[96px] w-full cursor-pointer flex-col items-center justify-center
          rounded-[2px] border border-dashed px-4 py-6
          transition-colors
          ${
            isDragOver
              ? "border-pressed bg-pressed/5"
              : "border-border bg-white/50 hover:border-sub"
          }
        `}
      >
        {/* Camera icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2 text-sub"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <p className="text-[14px] text-sub">
          タップして写真を選択
        </p>
        <p className="mt-1 text-[12px] text-[#BDBDBD]">
          JPG, PNG, WebP, HEIC（最大{MAX_FILES}枚）
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_STRING}
        multiple
        onChange={handleInputChange}
        className="hidden"
        aria-label="写真を選択"
      />

      {/* Error message */}
      {error && (
        <p className="mt-2 text-[13px] text-[#C62828]" role="alert">
          {error}
        </p>
      )}

      {/* Preview grid */}
      {items.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[2px] bg-card">
                {item.status === "processing" ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-sub border-t-transparent" />
                  </div>
                ) : item.status === "error" ? (
                  <div className="flex h-full flex-col items-center justify-center px-1">
                    <span className="text-[20px]">!</span>
                    <p className="text-[10px] text-[#C62828]">エラー</p>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt={item.originalName}
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(item.id);
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
                  aria-label={`${item.originalName} を削除`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="2" y1="2" x2="10" y2="10" />
                    <line x1="10" y1="2" x2="2" y2="10" />
                  </svg>
                </button>
              </div>

              {/* File size */}
              <p className="mt-0.5 truncate text-[10px] text-[#BDBDBD]">
                {formatFileSize(item.sizeBytes)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Count indicator */}
      {items.length > 0 && (
        <p className="mt-2 text-[12px] text-sub">
          {items.filter((i) => i.status === "ready").length} / {MAX_FILES} 枚
        </p>
      )}
    </div>
  );
}
