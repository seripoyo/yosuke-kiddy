/**
 * Cloudflare R2 接続テスト
 * - S3互換APIでテストファイルをアップロード
 * - パブリックURLでアクセス確認
 * - テストファイルを削除
 *
 * 実行: node --env-file=.env.local scripts/test-r2-connection.mjs
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const TEST_KEY = "_test/r2-connection-test.txt";
const TEST_BODY = "R2 connection test - " + new Date().toISOString();

async function main() {
  console.log("=== Cloudflare R2 接続テスト ===\n");

  // 1. テストファイルアップロード
  console.log("1. テストファイルアップロード...");
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: TEST_KEY,
    Body: TEST_BODY,
    ContentType: "text/plain; charset=utf-8",
  }));
  console.log(`   ✅ アップロード成功: ${TEST_KEY}`);

  // 2. パブリックURLでアクセス確認
  const publicUrl = `${R2_PUBLIC_URL}/${TEST_KEY}`;
  console.log(`\n2. パブリックURLでアクセス確認...`);
  console.log(`   URL: ${publicUrl}`);

  const resp = await fetch(publicUrl);
  console.log(`   HTTP ${resp.status} ${resp.statusText}`);

  if (resp.ok) {
    const text = await resp.text();
    console.log(`   ✅ レスポンス: "${text}"`);
    const match = text === TEST_BODY;
    console.log(`   ${match ? "✅" : "❌"} 内容一致: ${match}`);
  } else {
    console.log(`   ❌ パブリックアクセス失敗`);
  }

  // 3. テストファイル削除
  console.log(`\n3. テストファイル削除...`);
  await s3.send(new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: TEST_KEY,
  }));
  console.log("   ✅ 削除完了");

  console.log("\n=== 全テスト合格 ✅ ===");
}

main().catch((err) => {
  console.error("\n❌ テスト失敗:", err.message);
  process.exit(1);
});
