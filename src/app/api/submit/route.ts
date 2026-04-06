import { NextRequest, NextResponse } from "next/server";
import { createGuestbookEntry } from "@/lib/notion";
import { uploadPhoto } from "@/lib/r2";
import { sendNotification } from "@/lib/discord";

const CEREMONY_KEYS = ["tsuya", "kokubetsushiki", "both"];
const VALID_ATTENDANCE_KEYS = [
  "tsuya",
  "kokubetsushiki",
  "both",
  "incense_home",
  "message_only",
];

// Simple in-memory rate limit: 1 request per IP per 60 seconds
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  // Disable rate limit in development
  if (process.env.NODE_ENV === "development") return false;

  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_WINDOW) return true;
  rateLimitMap.set(ip, now);
  // Clean old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, time] of rateLimitMap) {
      if (now - time > RATE_LIMIT_WINDOW) rateLimitMap.delete(key);
    }
  }
  return false;
}

/** Strip HTML tags to prevent XSS in stored data */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: NextRequest) {
  // Check form closed
  if (process.env.NEXT_PUBLIC_FORM_CLOSED === "true") {
    return NextResponse.json(
      { error: "フォームは締め切りました" },
      { status: 403 }
    );
  }

  // Rate limit
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "送信回数の制限に達しました。しばらくしてからお試しください。" },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();

    // --- Extract and validate fields ---
    const name = sanitize(formData.get("name") as string ?? "");
    if (!name) {
      return NextResponse.json(
        { error: "お名前が未入力です。" },
        { status: 400 }
      );
    }

    let attendance: string[] = [];
    try {
      attendance = JSON.parse(formData.get("attendance") as string ?? "[]");
    } catch {
      return NextResponse.json(
        { error: "参列希望の形式が不正です。" },
        { status: 400 }
      );
    }
    if (
      !Array.isArray(attendance) ||
      attendance.length === 0 ||
      !attendance.every((a) => VALID_ATTENDANCE_KEYS.includes(a))
    ) {
      return NextResponse.json(
        { error: "参列希望を1つ以上選択してください。" },
        { status: 400 }
      );
    }

    const needsAddress = attendance.some((key) => CEREMONY_KEYS.includes(key));
    const postalCode = sanitize(formData.get("postalCode") as string ?? "");
    const address = sanitize(formData.get("address") as string ?? "");
    const building = sanitize(formData.get("building") as string ?? "");

    if (needsAddress) {
      const digits = postalCode.replace(/[^0-9]/g, "");
      if (digits.length !== 7) {
        return NextResponse.json(
          { error: "郵便番号が正しくありません。" },
          { status: 400 }
        );
      }
      if (!address) {
        return NextResponse.json(
          { error: "住所が未入力です。" },
          { status: 400 }
        );
      }
    }

    const relation = sanitize(formData.get("relation") as string ?? "");
    const nickname = sanitize(formData.get("nickname") as string ?? "");
    const message = sanitize(formData.get("message") as string ?? "");

    // --- Upload photos to R2 ---
    const photoFiles = formData.getAll("photos") as File[];
    const photoUrls: string[] = [];

    const r2Configured = !!(
      process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL
    );

    for (const file of photoFiles) {
      if (!(file instanceof File) || file.size === 0) continue;

      // Server-side file type validation
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
      ) {
        continue; // Skip invalid types silently (client should have converted HEIC)
      }

      if (r2Configured) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const url = await uploadPhoto(buffer, file.name, file.type);
          photoUrls.push(url);
        } catch (err) {
          console.error("R2 upload failed:", err);
        }
      } else {
        console.warn(
          "[dev] R2 not configured — skipping photo upload for:",
          file.name
        );
      }
    }

    // --- Write to Notion ---
    let notionPageId: string | undefined;

    const notionConfigured = !!(
      process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID
    );

    if (notionConfigured) {
      try {
        notionPageId = await createGuestbookEntry({
          name,
          attendance,
          postalCode: needsAddress ? postalCode : undefined,
          address: needsAddress ? address : undefined,
          building: needsAddress ? building : undefined,
          relation: relation || undefined,
          nickname: nickname || undefined,
          message: message || undefined,
          photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
        });
      } catch (err) {
        console.error("Notion write failed:", err);
        // Don't fail the request — user's submission should still "succeed"
      }
    } else {
      console.warn("[dev] Notion not configured — skipping DB write");
      console.log("[dev] Form data:", {
        name,
        attendance,
        postalCode,
        address,
        building,
        relation,
        nickname,
        message: message.slice(0, 100),
        photoCount: photoFiles.length,
      });
    }

    // --- Discord notification ---
    const discordConfigured = !!process.env.DISCORD_WEBHOOK_URL;

    if (discordConfigured) {
      try {
        await sendNotification({
          name,
          attendance,
          address: needsAddress ? `${address} ${building}`.trim() : undefined,
          relation: relation || undefined,
          nickname: nickname || undefined,
          message: message || undefined,
          photoCount: photoUrls.length,
          photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
          notionPageId,
        });
      } catch (err) {
        console.error("Discord notification failed:", err);
      }
    } else {
      console.warn("[dev] Discord not configured — skipping notification");
    }

    // --- Response ---
    const showLineQR = attendance.includes("incense_home");

    return NextResponse.json({ success: true, showLineQR });
  } catch (err) {
    console.error("Submit API error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
