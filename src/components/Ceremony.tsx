import { SectionHeading } from "./SectionHeading";
import { FadeInOnScroll } from "./FadeInOnScroll";
import { GoogleMap } from "./GoogleMap";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2">
      <dt className="w-20 shrink-0 text-[14px] text-sub">{label}</dt>
      <dd className="text-[16px] text-text">{value}</dd>
    </div>
  );
}

export function Ceremony() {
  return (
    <section className="mx-auto max-w-[800px] px-5 pt-[35px] pb-[30px]">
      <FadeInOnScroll variant="fade">
        <SectionHeading enTitle="CEREMONY" jpTitle="式のご案内" />
      </FadeInOnScroll>

      {/* 通夜 */}
      <FadeInOnScroll variant="slide-up" delay={100}>
        <div className="mb-12">
          <h3 className="mb-4 font-mincho text-[16px] font-semibold tracking-[0.05em] text-text-heading">
            通夜
          </h3>
          <dl>
            <InfoRow label="日時" value="2026年4月8日（水）18:00 - 20:30" />
            <InfoRow label="会場" value="稲垣葬儀社 稲垣ホール" />
            <InfoRow label="住所" value="〒120-0036 東京都足立区千住仲町19-3" />
            <InfoRow label="アクセス" value="JR常磐線 北千住駅から徒歩4分" />
          </dl>
        </div>
      </FadeInOnScroll>

      {/* 告別式 */}
      <FadeInOnScroll variant="slide-up" delay={200}>
        <div className="mb-12">
          <h3 className="mb-4 font-mincho text-[16px] font-semibold tracking-[0.05em] text-text-heading">
            告別式
          </h3>
          <dl>
            <InfoRow label="日時" value="2026年4月9日（木）12:00 - 13:00" />
            <InfoRow label="会場" value="同上（稲垣ホール）" />
          </dl>
        </div>
      </FadeInOnScroll>

      {/* Google Maps */}
      <FadeInOnScroll variant="slide-up" delay={300}>
        <GoogleMap />
      </FadeInOnScroll>
    </section>
  );
}
