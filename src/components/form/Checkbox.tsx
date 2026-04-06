"use client";

type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

export function Checkbox({ id, label, checked, onChange }: Props) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 py-2"
    >
      <span className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          className={`
            flex h-6 w-6 items-center justify-center rounded-[2px] border transition-colors
            ${checked ? "border-pressed bg-pressed" : "border-border bg-white"}
            peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pressed
          `}
        >
          {checked && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7l3.5 3.5L12 4"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
      <span className="font-mincho text-[14px] leading-[1.6] text-text">
        {label}
      </span>
    </label>
  );
}
