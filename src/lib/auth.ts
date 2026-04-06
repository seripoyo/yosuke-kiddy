import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  // Use ADMIN_PASSWORD as HMAC key (simple approach for single-user admin)
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Verify the admin password against the environment variable. */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;

  // Timing-safe comparison
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Create a session token.
 * Format: `<random>.<timestamp>.<signature>`
 */
export function createSessionToken(): string {
  const random = randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();
  const payload = `${random}.${timestamp}`;
  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

/** Verify a session token and check it's not expired. */
export function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [random, timestamp, signature] = parts;
  const payload = `${random}.${timestamp}`;

  // Verify signature
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expBuf)) return false;

  // Check expiry
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;
  return Date.now() - ts < SESSION_MAX_AGE * 1000;
}

/** Set the session cookie after successful login. */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/** Get and verify the current session from cookies. Returns true if authenticated. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

/** Clear the session cookie. */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
