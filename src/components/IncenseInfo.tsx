import { SectionHeading } from "./SectionHeading";
import { FadeInOnScroll } from "./FadeInOnScroll";

export function IncenseInfo() {
  return (
    <section className="mx-auto max-w-[800px] px-5 pt-[35px] pb-[30px]">
      <FadeInOnScroll variant="fade">
        <SectionHeading enTitle="HOME INCENSE" jpTitle="自宅での焼香について" />
      </FadeInOnScroll>

      <FadeInOnScroll variant="slide-up" delay={100}>
        <div className="font-mincho text-[16px] leading-[2] text-text">
          <p>
            6日現在、夫はすでに東京都にある最寄り駅：三軒茶屋の自宅に帰ってきております。
          </p>
          <p className="mt-6">
            式の日程では難しい方や、参列頂く方でも式前に顔を見ておきたいという方もいらっしゃるかと存じます。通夜当日8日は現時点でまだ予定が読めないため厳しいですが、7日中までは自宅にてお顔を見ていただくことも可能です。
          </p>
          <p className="mt-6">
            四十九日を迎えるのは、5月21日となります。四十九日を過ぎるまでは三軒茶屋の自宅に帰ってきておりますので、ご足労いただける方はご一報頂けますと幸いです。
          </p>
          <p className="mt-6">
            狭い部屋ではございますが、複数人でお越しいただくことも可能です。陽介は賑やかな場が好きな人ですので、複数人で来ていただいても喜ぶに違いありません。ぜひ、ご都合がつきましたら皆様でお越しください。
          </p>
          <p className="mt-6">
            お越し頂く際はお手数をおかけいたしますが、フォーム送信後に表示される妻・喪主である私の個人LINEにお越し頂く日時の候補をご共有いただければと存じます。
          </p>
          <p className="mt-6">
            また、自宅にお越しいただく際は、喪服のような格好ではなく、私服で問題ございません。本人はいつも通りの皆様を見られた方が、嬉しいと思うような人物です。ぜひラフな格好でお越しくださいませ。
          </p>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
