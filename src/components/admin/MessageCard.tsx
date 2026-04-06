import type { NotionMessage } from "@/lib/notion";

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
    </div>
  );
}
