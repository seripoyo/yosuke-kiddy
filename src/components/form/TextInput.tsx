"use client";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
};

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  hasError,
  type = "text",
  inputMode = "text",
  maxLength,
}: Props) {
  return (
    <input
      id={id}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`
        h-12 w-full rounded-[2px] border px-4 py-3
        font-mincho text-[16px] text-text
        outline-none transition-colors
        placeholder:text-[#BDBDBD]
        focus:border-pressed
        ${hasError ? "border-[#C62828]" : "border-border"}
      `}
    />
  );
}
