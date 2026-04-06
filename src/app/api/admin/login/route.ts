import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password?: string };

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "パスワードが正しくありません。" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
