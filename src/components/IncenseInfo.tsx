import { SectionHeading } from "./SectionHeading";
import { FadeInOnScroll } from "./FadeInOnScroll";

export function IncenseInfo() {
  return (
    <section className="mx-auto max-w-[800px] px-5 py-20">
      <FadeInOnScroll variant="fade">
        <SectionHeading enTitle="HOME INCENSE" jpTitle="ご自宅での焼香について" />
      </FadeInOnScroll>

      <FadeInOnScroll variant="slide-up" delay={100}>
        <div className="font-mincho text-[16px] leading-[2] text-text">
          <p>
            どちらの式にも参加が難しい方や、すぐにお顔を見たい方のために、4月8日まで自宅を解放しております。
          </p>
          <p className="mt-6">
            場所は東京都世田谷区（最寄り駅: 三軒茶屋）になります。
          </p>
          <p className="mt-6">
            ご来訪を希望される方は、下記のフォームからご記帳いただいた後、LINEにてご連絡ください。詳しい住所はLINEで個別にお伝えいたします。
          </p>

          <div className="mt-8 rounded-[2px] border border-border bg-white/50 px-5 py-4">
            <p className="text-[14px] text-sub">
              <span className="mr-2" aria-hidden="true">&#9432;</span>
              事前にLINEでのご連絡をお願いしております。フォーム送信後に表示されるLINE友だち追加よりご連絡ください。
            </p>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
