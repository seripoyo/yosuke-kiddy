"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
};

export function PostalCodeInput({ value, onChange, hasError }: Props) {
  const handleChange = (raw: string) => {
    // Strip non-digits
    const digits = raw.replace(/[^0-9]/g, "").slice(0, 7);
    // Auto-insert hyphen: 123-4567
    const formatted =
      digits.length > 3
        ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : digits;
    onChange(formatted);
  };

  return (
    <input
      id="postalCode"
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="例）120-0036"
      maxLength={8}
      className={`
        h-12 w-full max-w-[200px] rounded-[2px] border px-4 py-3
        font-mincho text-[16px] text-text
        outline-none transition-colors
        placeholder:text-[#BDBDBD]
        focus:border-pressed
        ${hasError ? "border-[#C62828]" : "border-border"}
      `}
    />
  );
}
