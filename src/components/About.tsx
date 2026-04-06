import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { FadeInOnScroll } from "./FadeInOnScroll";
import { AboutPhotos } from "./AboutPhotos";

export function About() {
  return (
    <section className="mx-auto max-w-[800px] px-5 pt-[35px] pb-[30px]">
      <FadeInOnScroll variant="fade">
        <SectionHeading enTitle="Yosuke Ito" jpTitle="伊藤陽介 永眠のご報告" />
      </FadeInOnScroll>

      <FadeInOnScroll variant="fade" delay={100}>
        <div className="relative mb-12 w-full">
          <Image
            src="/photos/yosuke-portrait.webp"
            alt="伊藤陽介さんの写真"
            width={800}
            height={450}
            quality={85}
            className="w-full object-cover"
          />
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll variant="slide-up" delay={200}>
        <div className="font-klee text-[16px] font-normal leading-[2] text-text">
          <p>
            このページをご覧いただき、ありがとうございます。伊藤陽介の妻、伊藤美咲でございます。
          </p>
          <p className="mt-6">
            突然のお知らせとなり恐縮ですが、2026年4月3日早朝、夫伊藤陽介が永眠いたしました。
          </p>
          <p className="mt-6">
            小・中・高・大の学生時代はもちろん、社会人以降に夫が巡り会えた皆様にも、生前夫が大変お世話になりましたこと、お礼申し上げます。
          </p>
          <p className="mt-6">
            ワインソムリエとして食と酒を愛し、カラオケやアニメやボイスドラマに夢中になり、時には自宅で寸胴を使い出汁を取るような料理にこだわる——そんな多彩な趣味にあふれ、自分の懐に入れた人は会っていない時間を問わず大事にする人でした。
          </p>
          <p className="mt-6">
            夫は生前から過去にお会いした皆様との思い出を、まるで最近のことのように楽しく私に話してくれていました。
          </p>
          <p className="mt-6">
            生前、夫と交流をお持ちいただいた方がありがたいことに多数いらっしゃるため、通夜・告別式ともに親族以外も参列いただける形で執り行わせていただきます。
          </p>
          <p className="mt-6">
            お世話になりました皆様にご足労をかける形とはなってしまいますが、ご都合がつく方はぜひ最後に送り出していただけますと幸いです。
          </p>
          <h3 className="mt-16 mb-6 font-mincho text-[17px] font-semibold leading-[1.6] tracking-[0.05em] text-text-heading">
            ご参列が難しい方へ
          </h3>
          <p>
            ありがたいことに、式前・後も難しいものの見送りたいというお声も頂戴しております。
          </p>
          <p className="mt-6">
            そこで、皆様にはメッセージをフォームよりご記入いただけましたら、それを印刷して棺にいれて見送るという方法をとることにいたしました。
          </p>
          <p className="mt-6">
            今後の見通しが立たないという方は、もしよろしければ本人に伝えたいこと、言いたいことを自由にご記入いただき、フォームからご送信いただけますと幸いです。
          </p>
        </div>
      </FadeInOnScroll>

      {/* petit-pas style photo collage */}
      <FadeInOnScroll variant="slide-up" delay={300}>
        <div className="mt-12">
          <AboutPhotos />
        </div>
      </FadeInOnScroll>
    </section>
  );
}
