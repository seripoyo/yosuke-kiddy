import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 1000; // 24h in ms

async function hmacSha256(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyTokenEdge(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  if (!secret || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [random, timestamp, signature] = parts;
  const payload = `${random}.${timestamp}`;

  const expected = await hmacSha256(secret, payload);
  if (signature !== expected) return false;

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;
  return Date.now() - ts < SESSION_MAX_AGE;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoggedIn = token ? await verifyTokenEdge(token) : false;
  const { pathname } = request.nextUrl;

  // Already logged in → redirect login page to /admin
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Not logged in → redirect /admin (except /admin/login) to login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
