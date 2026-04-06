import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.R2_BUCKET_NAME!;
const publicUrl = process.env.R2_PUBLIC_URL!;

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
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  const key = `photos/${timestamp}-${random}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  // Construct public URL (trailing slash normalized)
  const base = publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`;
  return `${base}${key}`;
}
