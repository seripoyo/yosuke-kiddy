import type { NotionMessage } from "@/lib/notion";

const ATTENDANCE_LABELS: Record<string, string> = {
  tsuya: "通夜",
  kokubetsushiki: "告別式",
  both: "通夜・告別式",
  incense_home: "自宅焼香",
  message_only: "メッセージのみ",
};

export function MessageCard({ msg }: { msg: NotionMessage }) {
  return (
    <div className="break-inside-avoid rounded-[2px] border border-border bg-card-admin p-6">
      <div className="flex items-baseline gap-3">
        <h3 className="font-klee text-[16px] font-semibold text-text">
          {msg.name}
        </h3>
        {msg.nickname && (
          <span className="text-[13px] text-sub">({msg.nickname})</span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {msg.attendance.map((key) => (
          <span
            key={key}
            className="rounded-full bg-pressed/10 px-2.5 py-0.5 text-[11px] text-pressed"
          >
            {ATTENDANCE_LABELS[key] ?? key}
          </span>
        ))}
      </div>

      {msg.relation && (
        <p className="mt-2 text-[13px] text-sub">
          関係: {msg.relation}
        </p>
      )}

      {msg.message && (
        <p className="mt-3 whitespace-pre-wrap font-mincho text-[14px] leading-[1.9] text-text">
          {msg.message}
        </p>
      )}

      {msg.photoUrls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {msg.photoUrls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-16 w-16 overflow-hidden rounded-[2px] border border-border"
            >
              <img
                src={url}
                alt="思い出の写真"
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      )}

      {msg.sentAt && (
        <p className="mt-3 text-[11px] text-sub/60">
          {new Date(msg.sentAt).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
