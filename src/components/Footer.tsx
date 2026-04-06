import { IchimatsuDivider } from "./IchimatsuDivider";

export function Footer() {
  return (
    <footer className="mt-8">
      <IchimatsuDivider />
      <div className="px-5 pt-6 pb-[max(env(safe-area-inset-bottom,0px),24px)] text-center">
        <p className="font-cormorant text-[13px] tracking-[0.15em] text-sub">
          Yosuke Ito
        </p>
        <p className="mt-1 font-cormorant text-[11px] tracking-[0.1em] text-sub/60">
          1988.11.17 &mdash; 2026.04.03
        </p>
        <p className="mt-3 font-mincho text-[10px] font-light tracking-[0.05em] text-sub/40">
          &copy; 2026
        </p>
      </div>
    </footer>
  );
}
