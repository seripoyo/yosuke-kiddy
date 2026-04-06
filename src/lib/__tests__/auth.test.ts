import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock next/headers before importing auth module
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Set env before importing
process.env.ADMIN_PASSWORD = "test-admin-password-123";

import {
  verifyAdminPassword,
  createSessionToken,
  verifySessionToken,
} from "../auth";

describe("auth", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "test-admin-password-123";
  });

  describe("verifyAdminPassword", () => {
    it("returns true for correct password", () => {
      expect(verifyAdminPassword("test-admin-password-123")).toBe(true);
    });

    it("returns false for incorrect password", () => {
      expect(verifyAdminPassword("wrong-password")).toBe(false);
    });

    it("returns false for empty password", () => {
      expect(verifyAdminPassword("")).toBe(false);
    });

    it("returns false when env is not set", () => {
      delete process.env.ADMIN_PASSWORD;
      expect(verifyAdminPassword("anything")).toBe(false);
    });
  });

  describe("createSessionToken / verifySessionToken", () => {
    it("creates a valid token", () => {
      const token = createSessionToken();
      expect(token).toBeTruthy();
      expect(token.split(".").length).toBe(3);
    });

    it("verifies a freshly created token", () => {
      const token = createSessionToken();
      expect(verifySessionToken(token)).toBe(true);
    });

    it("rejects a tampered token", () => {
      const token = createSessionToken();
      const parts = token.split(".");
      parts[2] = "tampered_signature";
      expect(verifySessionToken(parts.join("."))).toBe(false);
    });

    it("rejects an invalid format", () => {
      expect(verifySessionToken("invalid")).toBe(false);
      expect(verifySessionToken("a.b")).toBe(false);
      expect(verifySessionToken("")).toBe(false);
    });

    it("rejects an expired token (simulated)", () => {
      // Create a token with a timestamp far in the past
      const { createHmac, randomBytes } = require("crypto");
      const random = randomBytes(16).toString("hex");
      const oldTimestamp = (Date.now() - 25 * 60 * 60 * 1000).toString(); // 25 hours ago
      const payload = `${random}.${oldTimestamp}`;
      const signature = createHmac("sha256", "test-admin-password-123")
        .update(payload)
        .digest("hex");
      const expiredToken = `${payload}.${signature}`;

      expect(verifySessionToken(expiredToken)).toBe(false);
    });
  });
});
