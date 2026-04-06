import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchAllMessages } from "@/lib/notion";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notionConfigured = !!(
    process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID
  );

  if (!notionConfigured) {
    // Dev / unconfigured mode: return mock data
    return NextResponse.json({
      messages: [
        {
          id: "mock-1",
          name: "山田太郎",
          attendance: ["tsuya"],
          postalCode: "150-0001",
          address: "東京都渋谷区神宮前1-1-1",
          relation: "大学の同期",
          nickname: "たろちゃん",
          message: "陽介、たくさんの思い出をありがとう。大学時代に一緒に飲んだワインの味、忘れないよ。",
          photoUrls: [],
          sentAt: "2026-04-06T10:00:00.000Z",
        },
        {
          id: "mock-2",
          name: "佐藤花子",
          attendance: ["kokubetsushiki", "incense_home"],
          postalCode: "",
          address: "",
          relation: "会社の先輩",
          nickname: "よーすけ",
          message: "いつも明るく周りを照らしてくれた陽介くん。ソムリエの知識を教えてもらった日々が懐かしいです。",
          photoUrls: [],
          sentAt: "2026-04-06T09:30:00.000Z",
        },
        {
          id: "mock-3",
          name: "鈴木一郎",
          attendance: ["message_only"],
          postalCode: "",
          address: "",
          relation: "中学テニス部同期",
          nickname: "",
          message: "",
          photoUrls: [],
          sentAt: "2026-04-06T08:00:00.000Z",
        },
      ],
    });
  }

  try {
    const messages = await fetchAllMessages();
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return NextResponse.json(
      { error: "メッセージの取得に失敗しました。" },
      { status: 500 }
    );
  }
}
