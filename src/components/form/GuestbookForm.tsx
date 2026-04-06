"use client";

import { SectionHeading } from "../SectionHeading";
import { FadeInOnScroll } from "../FadeInOnScroll";
import { Button } from "../Button";
import { FormField } from "./FormField";
import { TextInput } from "./TextInput";
import { Checkbox } from "./Checkbox";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { useFormState } from "./useFormState";
import { ATTENDANCE_OPTIONS } from "./types";

function FormClosed() {
  return (
    <section className="mx-auto max-w-[800px] px-5 py-20">
      <SectionHeading enTitle="MESSAGE" jpTitle="ご記帳" />
      <div className="mx-auto max-w-[600px] rounded-[2px] border border-border bg-white/50 px-5 py-8 text-center">
        <p className="font-mincho text-[16px] text-text">
          ご記帳の受付は終了いたしました。
        </p>
        <p className="mt-2 text-[14px] text-sub">
          たくさんのメッセージをありがとうございました。
        </p>
      </div>
    </section>
  );
}

export function GuestbookForm() {
  const isClosed = process.env.NEXT_PUBLIC_FORM_CLOSED === "true";

  if (isClosed) return <FormClosed />;

  return <GuestbookFormInner />;
}

function GuestbookFormInner() {
  const {
    data,
    errors,
    isSubmitting,
    isSubmitted,
    showLineQR,
    needsAddress,
    updateField,
    toggleAttendance,
    handleSubmit,
  } = useFormState();

  // 送信完了時は完了画面を表示（チケット012で実装予定、ここではシンプル表示）
  if (isSubmitted) {
    return (
      <section className="mx-auto max-w-[800px] px-5 py-20">
        <div className="mx-auto max-w-[600px] text-center">
          <div className="rounded-[2px] border border-success bg-success/10 px-5 py-8">
            <p className="font-klee text-[18px] font-semibold text-text">
              ご記帳ありがとうございます。
            </p>
            <p className="mt-2 font-klee text-[16px] text-text">
              陽介もきっと喜んでいます。
            </p>
            {showLineQR && (
              <div className="mt-6">
                <p className="text-[14px] text-sub">
                  ご自宅の場所はLINEでお伝えします。
                </p>
                {/* LINE QR / リンクはチケット012で実装 */}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[800px] px-5 py-20">
      <FadeInOnScroll variant="fade">
        <SectionHeading enTitle="MESSAGE" jpTitle="ご記帳" />
      </FadeInOnScroll>

      <FadeInOnScroll variant="slide-up" delay={100}>
        <form
          className="mx-auto max-w-[600px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
          {/* 1. ご芳名 */}
          <FormField
            label="お名前（ご芳名）"
            htmlFor="name"
            required
            error={errors.name}
          >
            <TextInput
              id="name"
              value={data.name}
              onChange={(v) => updateField("name", v)}
              placeholder="例）山田太郎"
              hasError={!!errors.name}
            />
          </FormField>

          {/* 2. 参列のご希望 */}
          <FormField
            label="参列のご希望"
            htmlFor="attendance"
            required
            error={errors.attendance}
          >
            <div className="mt-1">
              {ATTENDANCE_OPTIONS.map((opt) => (
                <Checkbox
                  key={opt.key}
                  id={`attendance-${opt.key}`}
                  label={opt.label}
                  checked={data.attendance.includes(opt.key)}
                  onChange={() => toggleAttendance(opt.key)}
                />
              ))}
            </div>
          </FormField>

          {/* 3-4. 郵便番号 + 住所 + 建物名（条件表示・住所オートコンプリート付き） */}
          {needsAddress && (
            <div className="overflow-hidden transition-all duration-300">
              <AddressAutocomplete
                postalCode={data.postalCode}
                address={data.address}
                building={data.building}
                onPostalCodeChange={(v) => updateField("postalCode", v)}
                onAddressChange={(v) => updateField("address", v)}
                onBuildingChange={(v) => updateField("building", v)}
                postalCodeError={errors.postalCode}
                addressError={errors.address}
              />
            </div>
          )}

          {/* 5. 関係 */}
          <FormField label="陽介とのご関係" htmlFor="relation">
            <TextInput
              id="relation"
              value={data.relation}
              onChange={(v) => updateField("relation", v)}
              placeholder="例）K.U.E.L.執行時代の後輩、中学テニス部同期"
            />
          </FormField>

          {/* 6. あだ名 */}
          <FormField label="本人から呼ばれていたあだ名" htmlFor="nickname">
            <TextInput
              id="nickname"
              value={data.nickname}
              onChange={(v) => updateField("nickname", v)}
              placeholder="例）やまちゃん"
            />
          </FormField>

          {/* 7. メッセージ */}
          <FormField label="本人へのメッセージ" htmlFor="message">
            <p className="mb-2 text-[13px] text-sub">
              火葬前までに印刷してお棺に入れます。陽介に伝えたいことや思い出話があればご記入ください。
            </p>
            <textarea
              id="message"
              value={data.message}
              onChange={(e) => updateField("message", e.target.value)}
              className="min-h-[160px] w-full resize-y rounded-[2px] border border-border px-4 py-3 font-mincho text-[16px] text-text outline-none transition-colors placeholder:text-[#BDBDBD] focus:border-pressed"
              placeholder="メッセージを入力してください"
            />
          </FormField>

          {/* 8. 写真アップロード（スロットのみ — 009で実装） */}
          <FormField label="思い出の写真" htmlFor="photos">
            <div className="flex h-24 w-full items-center justify-center rounded-[2px] border border-dashed border-border bg-white/50">
              <p className="text-[14px] text-[#BDBDBD]">
                写真アップロード（準備中）
              </p>
            </div>
          </FormField>

          {/* 送信ボタン */}
          <div className="mt-8 text-center">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "送信しています..." : "送信する"}
            </Button>
          </div>
        </form>
      </FadeInOnScroll>
    </section>
  );
}
