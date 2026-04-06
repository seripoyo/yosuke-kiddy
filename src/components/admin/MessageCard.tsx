"use client";

import { useState } from "react";
import type { NotionMessage } from "@/lib/notion";

export function MessageCard({
  msg,
  onDelete,
}: {
  msg: NotionMessage;
  onDelete: (id: string) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      onDelete(msg.id);
    } catch {
      alert("削除に失敗しました。");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="relative break-inside-avoid rounded-[2px] border border-border bg-card-admin p-6">
      {/* Delete button — hidden during print */}
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-[18px] text-sub transition-colors hover:bg-error-border/10 hover:text-error-border print:hidden"
        aria-label="削除"
      >
        &times;
      </button>

      <div className="flex items-baseline gap-3 pr-6">
        <h3 className="font-klee text-[16px] font-semibold text-text">
          {msg.name}
        </h3>
        {msg.nickname && (
          <span className="text-[13px] text-sub">({msg.nickname})</span>
        )}
      </div>

      {msg.relation && (
        <p className="mt-2 text-[13px] text-sub">
          関係: {msg.relation}
        </p>
      )}

      {msg.message && (
        <p className="mt-3 whitespace-pre-wrap font-mincho text-[14px] leading-[1.9] text-text">
          {msg.message}
        </p>
      )}

      {msg.photoUrls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {msg.photoUrls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-16 w-16 overflow-hidden rounded-[2px] border border-border"
            >
              <img
                src={url}
                alt="思い出の写真"
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      )}

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2px] bg-white/90 print:hidden">
          <div className="text-center">
            <p className="font-mincho text-[14px] text-text">
              「{msg.name}」を削除しますか？
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="rounded-[2px] border border-border px-4 py-1.5 font-mincho text-[13px] text-sub transition-colors hover:bg-base"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-[2px] border border-error-border bg-error-border/10 px-4 py-1.5 font-mincho text-[13px] text-error-border transition-colors hover:bg-error-border/20"
              >
                {isDeleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
