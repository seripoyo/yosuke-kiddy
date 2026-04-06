import { SectionHeading } from "./SectionHeading";
import { FadeInOnScroll } from "./FadeInOnScroll";
import { AboutPhotos } from "./AboutPhotos";

export function About() {
  return (
    <section className="mx-auto max-w-[800px] px-5 py-20">
      <FadeInOnScroll variant="fade">
        <SectionHeading enTitle="ABOUT" jpTitle="陽介について" />
      </FadeInOnScroll>

      <FadeInOnScroll variant="slide-up" delay={100}>
        <div className="font-klee text-[16px] font-normal leading-[2] text-text">
          <p>
            陽介は、いつも周りを明るくしてくれる人でした。
          </p>
          <p className="mt-6">
            ワインソムリエとして食と酒を愛し、
            ギタリストとして音楽を奏で、
            アニメやボイスドラマに夢中になる——
            多彩な趣味を持ちながらも、
            どんな場面でも周りの人を大切にする、
            そんな人でした。
          </p>
          <p className="mt-6">
            「信じられない」——
            その知らせを受けた多くの方が、
            きっと同じ言葉を口にしたと思います。
          </p>
          <p className="mt-6">
            このページは、陽介を偲び、
            想いを伝えるための場所です。
          </p>
        </div>
      </FadeInOnScroll>

      {/* petit-pas style photo collage */}
      <FadeInOnScroll variant="slide-up" delay={200}>
        <div className="mt-12">
          <AboutPhotos />
        </div>
      </FadeInOnScroll>
    </section>
  );
}
