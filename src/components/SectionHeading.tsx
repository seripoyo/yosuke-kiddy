type Props = {
  enTitle: string;
  jpTitle: string;
};

export function SectionHeading({ enTitle, jpTitle }: Props) {
  return (
    <div className="mb-12">
      <p
        className="font-cormorant text-[14px] font-normal uppercase leading-[1.4] tracking-[0.15em] text-sub-heading"
      >
        {enTitle}
      </p>
      <h2
        className="mt-2 font-mincho text-[20px] font-semibold leading-[1.6] tracking-[0.05em] text-text-heading"
      >
        {jpTitle}
      </h2>
    </div>
  );
}
