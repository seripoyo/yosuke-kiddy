/**
 * Notion API 接続テスト（全プロパティ）
 * 実行: node --env-file=.env.local scripts/test-notion-connection.mjs
 */
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function main() {
  console.log("=== Notion API 接続テスト ===\n");

  // 1. データベース取得
  console.log("1. データベース取得...");
  const db = await notion.databases.retrieve({ database_id: databaseId });
  console.log(`   ✅ DB名: ${db.title.map((t) => t.plain_text).join("")}`);

  // 2. スキーマ確認
  console.log("\n2. スキーマ確認...");
  const resp = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page_size: 1 }),
  });
  const data = await resp.json();
  if (data.results && data.results.length > 0) {
    const props = data.results[0].properties;
    console.log("   プロパティ一覧:");
    for (const [name, prop] of Object.entries(props)) {
      console.log(`     - "${name}" → ${prop.type}`);
    }
  } else {
    console.log("   （既存データなし）");
  }

  // 3. 全プロパティでテストページ作成
  console.log("\n3. 全プロパティでテストページ作成...");
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      ご芳名: {
        title: [{ text: { content: "【テスト】API接続確認" } }],
      },
      参列のご希望: {
        multi_select: [{ name: "未定ではあるものの、とりあえずメッセージを送りたい" }],
      },
      郵便番号: {
        rich_text: [{ text: { content: "123-4567" } }],
      },
      ご住所: {
        rich_text: [{ text: { content: "東京都テスト区テスト町1-2-3" } }],
      },
      "陽介から呼ばれていたあだ名": {
        rich_text: [{ text: { content: "テストくん" } }],
      },
      陽介とのご関係: {
        rich_text: [{ text: { content: "テスト関係" } }],
      },
      陽介へのメッセージ: {
        rich_text: [{ text: { content: "これはAPI接続テストです。自動的に削除されます。" } }],
      },
      写真URL: {
        rich_text: [{ text: { content: "https://example.com/test.jpg" } }],
      },
      送信日: {
        date: { start: new Date().toISOString().split("T")[0] },
      },
    },
  });
  console.log(`   ✅ ページ作成成功: ${page.id}`);

  // 4. 作成データの検証
  console.log("\n4. 作成データの検証...");
  const created = await notion.pages.retrieve({ page_id: page.id });
  const p = created.properties;
  const checks = [
    ["ご芳名", p["ご芳名"]?.title?.[0]?.plain_text === "【テスト】API接続確認"],
    ["参列のご希望", p["参列のご希望"]?.multi_select?.length === 1],
    ["郵便番号", p["郵便番号"]?.rich_text?.[0]?.plain_text === "123-4567"],
    ["ご住所", p["ご住所"]?.rich_text?.[0]?.plain_text === "東京都テスト区テスト町1-2-3"],
    ["陽介から呼ばれていたあだ名", p["陽介から呼ばれていたあだ名"]?.rich_text?.[0]?.plain_text === "テストくん"],
    ["陽介とのご関係", p["陽介とのご関係"]?.rich_text?.[0]?.plain_text === "テスト関係"],
    ["陽介へのメッセージ", !!p["陽介へのメッセージ"]?.rich_text?.[0]?.plain_text],
    ["写真URL", p["写真URL"]?.rich_text?.[0]?.plain_text === "https://example.com/test.jpg"],
    ["送信日", !!p["送信日"]?.date?.start],
  ];

  let allPass = true;
  for (const [name, ok] of checks) {
    console.log(`   ${ok ? "✅" : "❌"} ${name}`);
    if (!ok) allPass = false;
  }

  // 5. テストページ削除
  console.log("\n5. テストページ削除...");
  await notion.pages.update({ page_id: page.id, archived: true });
  console.log("   ✅ 削除完了");

  if (allPass) {
    console.log("\n=== 全テスト合格 ✅ ===");
  } else {
    console.log("\n=== 一部テスト失敗 ❌ ===");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n❌ テスト失敗:", err.message);
  process.exit(1);
});
