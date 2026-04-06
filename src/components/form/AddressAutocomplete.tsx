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

/** Load Google Maps JS API with loading=async */
function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof google !== "undefined" && google.maps) {
      resolve();
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      // Already loaded but google not defined yet? Wait for it
      if (typeof google !== "undefined" && google.maps) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&language=ja`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
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
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const autocompleteElementRef =
    useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const isInitializedRef = useRef(false);
  const zipcloudStatusRef = useRef<"idle" | "loading" | "error">("idle");
  const onAddressChangeRef = useRef(onAddressChange);
  onAddressChangeRef.current = onAddressChange;

  // Initialize PlaceAutocompleteElement (new API)
  useEffect(() => {
    if (isInitializedRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    let cancelled = false;

    (async () => {
      await loadGoogleMapsScript();
      if (cancelled) return;

      try {
        await google.maps.importLibrary("places");
      } catch {
        return;
      }
      if (cancelled || isInitializedRef.current) return;

      const container = autocompleteContainerRef.current;
      if (!container) return;

      const autocomplete =
        new google.maps.places.PlaceAutocompleteElement({
          componentRestrictions: { country: "jp" },
          types: ["address"],
          requestedLanguage: "ja",
        });

      // Style the web component to match our design
      autocomplete.style.width = "100%";
      autocomplete.setAttribute("placeholder", "番地を入力すると候補が表示されます");

      autocomplete.addEventListener(
        "gmp-placeselect",
        async (e) => {
          const event =
            e as google.maps.places.PlaceAutocompletePlaceSelectEvent;
          const place = event.place;
          try {
            await place.fetchFields({
              fields: ["formattedAddress", "addressComponents"],
            });
          } catch {
            return;
          }

          if (place.formattedAddress) {
            // Remove "日本、" prefix and postal code
            const formatted = place.formattedAddress
              .replace(/^日本、?\s*/, "")
              .replace(/^〒?\d{3}-?\d{4}\s*/, "");
            onAddressChangeRef.current(formatted);
          }
        }
      );

      container.appendChild(autocomplete);
      autocompleteElementRef.current = autocomplete;
      isInitializedRef.current = true;

      // If address already has a value, set it on the input
      if (address) {
        const input = autocomplete.querySelector("input");
        if (input) input.value = address;
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync address value to the PlaceAutocompleteElement's inner input
  useEffect(() => {
    const el = autocompleteElementRef.current;
    if (!el) return;
    const input = el.querySelector("input");
    if (input && input.value !== address) {
      input.value = address;
    }
  }, [address]);

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

          // Also set it on the PlaceAutocompleteElement input for continued typing
          const el = autocompleteElementRef.current;
          if (el) {
            const input = el.querySelector("input");
            if (input) {
              input.value = result;
              setTimeout(() => {
                input.focus();
                input.setSelectionRange(result.length, result.length);
              }, 150);
            }
          }
        } else {
          zipcloudStatusRef.current = "error";
        }
      }
    },
    [onPostalCodeChange, onAddressChange]
  );

  // Sync PlaceAutocompleteElement input back to React state on blur
  useEffect(() => {
    const el = autocompleteElementRef.current;
    if (!el) return;

    const handleBlur = () => {
      const input = el.querySelector("input");
      if (input) {
        onAddressChangeRef.current(input.value);
      }
    };

    el.addEventListener("blur", handleBlur, true);
    return () => el.removeEventListener("blur", handleBlur, true);
  }, []);

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
        <div
          ref={autocompleteContainerRef}
          className="address-autocomplete-container"
        />
        {/* Fallback: show a regular input if Google Maps is not available */}
        {!isInitializedRef.current && (
          <TextInput
            id="address"
            value={address}
            onChange={onAddressChange}
            placeholder="住所を入力してください"
            hasError={!!addressError}
          />
        )}
        <p className="mt-1 text-[12px] text-sub">
          番地を入力すると候補が表示されます
        </p>
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
