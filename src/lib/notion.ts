import { Client } from "@notionhq/client";

let _notion: Client | null = null;

function getNotion(): Client {
  if (!_notion) {
    _notion = new Client({ auth: process.env.NOTION_API_KEY });
  }
  return _notion;
}

function getDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) throw new Error("NOTION_DATABASE_ID is not set");
  return id;
}

function getDataSourceId(): string {
  // SDK v5 uses a separate data_source_id for queries
  return process.env.NOTION_DATA_SOURCE_ID ?? getDatabaseId();
}

type GuestbookEntry = {
  name: string;
  attendance: string[];
  postalCode?: string;
  address?: string;
  building?: string;
  relation?: string;
  nickname?: string;
  message?: string;
  photoUrls?: string[];
};

/** Notion Rich Text has a 2000-char limit per block. Split long text. */
function splitRichText(
  text: string
): { type: "text"; text: { content: string } }[] {
  const chunks: { type: "text"; text: { content: string } }[] = [];
  for (let i = 0; i < text.length; i += 2000) {
    chunks.push({ type: "text", text: { content: text.slice(i, i + 2000) } });
  }
  return chunks.length > 0
    ? chunks
    : [{ type: "text", text: { content: "" } }];
}

export async function createGuestbookEntry(
  entry: GuestbookEntry
): Promise<string> {
  const properties: Record<string, unknown> = {
    ご芳名: {
      title: [{ type: "text", text: { content: entry.name } }],
    },
    "参列のご希望": {
      multi_select: entry.attendance.map((a) => ({ name: a })),
    },
    送信日: {
      date: { start: new Date().toISOString() },
    },
  };

  if (entry.postalCode) {
    properties["郵便番号"] = {
      rich_text: [{ type: "text", text: { content: entry.postalCode } }],
    };
  }

  if (entry.address) {
    const fullAddress = entry.building
      ? `${entry.address} ${entry.building}`
      : entry.address;
    properties["ご住所"] = {
      rich_text: [{ type: "text", text: { content: fullAddress } }],
    };
  }

  if (entry.relation) {
    properties["陽介とのご関係"] = {
      rich_text: [{ type: "text", text: { content: entry.relation } }],
    };
  }

  if (entry.nickname) {
    properties["陽介から呼ばれていたあだ名"] = {
      rich_text: [{ type: "text", text: { content: entry.nickname } }],
    };
  }

  if (entry.message) {
    properties["陽介へのメッセージ"] = {
      rich_text: splitRichText(entry.message),
    };
  }

  if (entry.photoUrls && entry.photoUrls.length > 0) {
    properties["写真URL"] = {
      rich_text: [
        { type: "text", text: { content: entry.photoUrls.join("\n") } },
      ],
    };
  }

  const client = getNotion();
  const page = await client.pages.create({
    parent: { database_id: getDatabaseId() },
    properties: properties as Parameters<
      typeof client.pages.create
    >[0]["properties"],
  });

  return page.id;
}

export async function deleteGuestbookEntry(pageId: string): Promise<void> {
  await getNotion().pages.update({
    page_id: pageId,
    archived: true,
  });
}

export type NotionMessage = {
  id: string;
  name: string;
  attendance: string[];
  postalCode: string;
  address: string;
  relation: string;
  nickname: string;
  message: string;
  photoUrls: string[];
  sentAt: string;
};

function extractPlainText(
  richText: { plain_text: string }[] | undefined
): string {
  if (!richText) return "";
  return richText.map((t) => t.plain_text).join("");
}

export async function fetchAllMessages(): Promise<NotionMessage[]> {
  const messages: NotionMessage[] = [];
  let cursor: string | undefined;

  do {
    const response = await getNotion().dataSources.query({
      data_source_id: getDataSourceId(),
      sorts: [{ property: "送信日", direction: "descending" }],
      start_cursor: cursor,
    });

    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const props = page.properties as Record<string, Record<string, unknown>>;

      const titleProp = props["ご芳名"] as {
        title?: { plain_text: string }[];
      };
      const attendanceProp = props["参列のご希望"] as {
        multi_select?: { name: string }[];
      };
      const dateProp = props["送信日"] as {
        date?: { start: string } | null;
      };

      messages.push({
        id: page.id,
        name: titleProp?.title
          ? extractPlainText(titleProp.title)
          : "",
        attendance: attendanceProp?.multi_select?.map((s) => s.name) ?? [],
        postalCode: extractPlainText(
          (props["郵便番号"] as { rich_text?: { plain_text: string }[] })
            ?.rich_text
        ),
        address: extractPlainText(
          (props["ご住所"] as { rich_text?: { plain_text: string }[] })
            ?.rich_text
        ),
        relation: extractPlainText(
          (props["陽介とのご関係"] as { rich_text?: { plain_text: string }[] })
            ?.rich_text
        ),
        nickname: extractPlainText(
          (props["陽介から呼ばれていたあだ名"] as { rich_text?: { plain_text: string }[] })
            ?.rich_text
        ),
        message: extractPlainText(
          (props["陽介へのメッセージ"] as { rich_text?: { plain_text: string }[] })
            ?.rich_text
        ),
        photoUrls: extractPlainText(
          (props["写真URL"] as { rich_text?: { plain_text: string }[] })
            ?.rich_text
        )
          .split("\n")
          .filter(Boolean),
        sentAt: dateProp?.date?.start ?? "",
      });
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return messages;
}
