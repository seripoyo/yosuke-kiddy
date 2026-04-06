type NotificationData = {
  name: string;
  attendance: string[];
  address?: string;
  relation?: string;
  nickname?: string;
  message?: string;
  photoCount: number;
  notionPageId?: string;
};

/**
 * Send a notification to Discord via webhook when a new guestbook entry is submitted.
 */
export async function sendNotification(data: NotificationData): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fields: string[] = [];
  fields.push(`**お名前**: ${data.name}`);
  fields.push(`**参列希望**: ${data.attendance.join(", ") || "なし"}`);
  if (data.address) fields.push(`**住所**: ${data.address}`);
  if (data.relation) fields.push(`**関係**: ${data.relation}`);
  if (data.nickname) fields.push(`**あだ名**: ${data.nickname}`);
  if (data.message) {
    const truncated =
      data.message.length > 200
        ? `${data.message.slice(0, 200)}…`
        : data.message;
    fields.push(`**メッセージ**: ${truncated}`);
  }
  if (data.photoCount > 0) {
    fields.push(`**写真**: ${data.photoCount}枚`);
  }

  let content = `📩 **新しいご記帳がありました**\n\n${fields.join("\n")}`;

  if (data.notionPageId) {
    content += `\n\n[Notion で確認](https://notion.so/${data.notionPageId.replace(/-/g, "")})`;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch {
    // Discord notification is best-effort; don't throw
    console.error("Discord notification failed");
  }
}
