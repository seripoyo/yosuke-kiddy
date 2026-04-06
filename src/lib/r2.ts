import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

let _s3: S3Client | null = null;

function getS3(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _s3;
}

/**
 * Upload a photo to Cloudflare R2.
 * Returns the public URL of the uploaded file.
 */
export async function uploadPhoto(
  file: Buffer,
  filename: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  const timestamp = Date.now();
  const random = randomBytes(6).toString("hex");
  const ALLOWED_EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const ext = ALLOWED_EXTENSIONS[contentType] ?? "jpg";
  const key = `photos/${timestamp}-${random}.${ext}`;

  await getS3().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  // Construct public URL (trailing slash normalized)
  const url = process.env.R2_PUBLIC_URL!;
  const base = url.endsWith("/") ? url : `${url}/`;
  return `${base}${key}`;
}
