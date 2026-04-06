import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendNotification } from "../discord";

describe("discord", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("sends notification with all fields", async () => {
    process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/test";

    await sendNotification({
      name: "山田太郎",
      attendance: ["tsuya", "kokubetsushiki"],
      address: "東京都世田谷区",
      relation: "大学の同期",
      nickname: "やまちゃん",
      message: "ご冥福をお祈りします。",
      photoCount: 3,
      notionPageId: "abc-123-def",
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://discord.com/api/webhooks/test");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body.content).toContain("山田太郎");
    expect(body.content).toContain("tsuya");
    expect(body.content).toContain("3枚");
    expect(body.content).toContain("Notion で確認");
  });

  it("does nothing when webhook URL is not set", async () => {
    delete process.env.DISCORD_WEBHOOK_URL;

    await sendNotification({
      name: "テスト",
      attendance: [],
      photoCount: 0,
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not throw when fetch fails", async () => {
    process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/test";
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      sendNotification({
        name: "テスト",
        attendance: [],
        photoCount: 0,
      })
    ).resolves.toBeUndefined();
  });

  it("truncates long messages", async () => {
    process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/test";
    const longMessage = "あ".repeat(500);

    await sendNotification({
      name: "テスト",
      attendance: [],
      message: longMessage,
      photoCount: 0,
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.content).toContain("…");
    expect(body.content).not.toContain("あ".repeat(500));
  });
});
