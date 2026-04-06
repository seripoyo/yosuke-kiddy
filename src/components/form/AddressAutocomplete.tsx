"use client";

import { useEffect, useRef, useCallback } from "react";
import { FormField } from "./FormField";
import { PostalCodeInput } from "./PostalCodeInput";
import { TextInput } from "./TextInput";

type Props = {
  postalCode: string;
  address: string;
  building: string;
  onPostalCodeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onBuildingChange: (value: string) => void;
  postalCodeError?: string;
  addressError?: string;
};

async function fetchAddressFromZipcode(
  zipcode: string
): Promise<string | null> {
  const digits = zipcode.replace(/[^0-9]/g, "");
  if (digits.length !== 7) return null;

  try {
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const r = data.results[0];
      return `${r.address1}${r.address2}${r.address3}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function AddressAutocomplete({
  postalCode,
  address,
  building,
  onPostalCodeChange,
  onAddressChange,
  onBuildingChange,
  postalCodeError,
  addressError,
}: Props) {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const isInitializedRef = useRef(false);
  const zipcloudStatusRef = useRef<"idle" | "loading" | "error">("idle");

  // Initialize Google Places Autocomplete
  const initAutocomplete = useCallback(() => {
    const input = addressInputRef.current;
    if (
      !input ||
      isInitializedRef.current ||
      typeof google === "undefined" ||
      !google.maps?.places
    )
      return;

    autocompleteRef.current = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "jp" },
      types: ["address"],
      fields: ["formatted_address", "address_components"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        // Remove "日本、" prefix and postal code if present
        let formatted = place.formatted_address
          .replace(/^日本、?\s*/, "")
          .replace(/^〒?\d{3}-?\d{4}\s*/, "");
        onAddressChange(formatted);
      }
    });

    isInitializedRef.current = true;
  }, [onAddressChange]);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    // Check if already loaded
    if (typeof google !== "undefined" && google.maps?.places) {
      initAutocomplete();
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", initAutocomplete);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja`;
    script.async = true;
    script.defer = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);
  }, [initAutocomplete]);

  // Auto-fetch address when postal code is complete (7 digits)
  const handlePostalCodeChange = useCallback(
    async (value: string) => {
      onPostalCodeChange(value);

      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length === 7) {
        zipcloudStatusRef.current = "loading";
        const result = await fetchAddressFromZipcode(value);
        if (result) {
          zipcloudStatusRef.current = "idle";
          onAddressChange(result);

          // Focus address input and trigger autocomplete
          setTimeout(() => {
            const input = addressInputRef.current;
            if (input) {
              input.focus();
              // Trigger Google Places by dispatching input event
              input.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }, 100);
        } else {
          zipcloudStatusRef.current = "error";
        }
      }
    },
    [onPostalCodeChange, onAddressChange]
  );

  return (
    <>
      <FormField
        label="郵便番号"
        htmlFor="postalCode"
        required
        error={
          postalCodeError ||
          (zipcloudStatusRef.current === "error"
            ? "郵便番号から住所を取得できませんでした。住所を直接ご入力ください。"
            : undefined)
        }
      >
        <PostalCodeInput
          value={postalCode}
          onChange={handlePostalCodeChange}
          hasError={!!postalCodeError}
        />
      </FormField>

      <FormField
        label="ご住所"
        htmlFor="address"
        required
        error={addressError}
      >
        <AddressInput
          ref={addressInputRef}
          value={address}
          onChange={onAddressChange}
          hasError={!!addressError}
        />
      </FormField>

      <FormField label="建物名・部屋番号" htmlFor="building">
        <TextInput
          id="building"
          value={building}
          onChange={onBuildingChange}
          placeholder="例）○○マンション201"
        />
      </FormField>
    </>
  );
}

// Separate component for address input to support ref forwarding
import { forwardRef } from "react";

const AddressInput = forwardRef<
  HTMLInputElement,
  { value: string; onChange: (v: string) => void; hasError?: boolean }
>(function AddressInput({ value, onChange, hasError }, ref) {
  return (
    <input
      ref={ref}
      id="address"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="住所を入力してください"
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
});
