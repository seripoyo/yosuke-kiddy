"use client";

import { useState, useEffect, useCallback } from "react";
import type { NotionMessage } from "@/lib/notion";
import { MessageCard } from "./MessageCard";
import { Button } from "../Button";

export function MessageList() {
  const [messages, setMessages] = useState<NotionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/messages");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setMessages(data.messages ?? []);
      } catch {
        setError("メッセージの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="font-mincho text-[14px] text-sub">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="font-mincho text-[14px] text-[#C62828]">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="font-mincho text-[14px] text-sub">
          {messages.length} 件のメッセージ
        </p>
        <Button
          variant="secondary"
          type="button"
          onClick={() => window.print()}
        >
          印刷する
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {messages
          .filter((msg) => msg.name && (msg.relation || msg.message || msg.photoUrls.length > 0))
          .map((msg) => (
            <MessageCard key={msg.id} msg={msg} onDelete={handleDelete} />
          ))}
      </div>

      {messages.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-mincho text-[14px] text-sub">
            まだメッセージはありません。
          </p>
        </div>
      )}
    </div>
  );
}
