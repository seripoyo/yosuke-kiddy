import { describe, it, expect } from "vitest";

const BASE = "http://localhost:3000/api/submit";

// These tests require the dev server to be running
// Run with: npx vitest run src/lib/__tests__/submit-api.test.ts
describe.skipIf(!process.env.TEST_API)("POST /api/submit (integration)", () => {
  it("rejects empty name", async () => {
    const form = new FormData();
    form.append("name", "");
    form.append("attendance", '["message_only"]');
    const res = await fetch(BASE, { method: "POST", body: form });
    expect(res.status).toBe(400);
  });

  it("rejects empty attendance", async () => {
    const form = new FormData();
    form.append("name", "テスト");
    form.append("attendance", "[]");
    const res = await fetch(BASE, { method: "POST", body: form });
    expect(res.status).toBe(400);
  });

  it("accepts message_only with showLineQR=false", async () => {
    const form = new FormData();
    form.append("name", "テスト太郎");
    form.append("attendance", '["message_only"]');
    const res = await fetch(BASE, { method: "POST", body: form });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.showLineQR).toBe(false);
  });

  it("returns showLineQR=true for incense_home", async () => {
    const form = new FormData();
    form.append("name", "テスト");
    form.append("attendance", '["incense_home"]');
    const res = await fetch(BASE, { method: "POST", body: form });
    const json = await res.json();
    expect(json.showLineQR).toBe(true);
  });
});
