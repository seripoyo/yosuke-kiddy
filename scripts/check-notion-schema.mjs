import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const db = await notion.databases.retrieve({ database_id: databaseId });
console.log(JSON.stringify(db, null, 2));
