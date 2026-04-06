"use client";

import { useState, useCallback } from "react";
import {
  type FormData,
  type FormErrors,
  type AttendanceKey,
  CEREMONY_KEYS,
} from "./types";

const initialData: FormData = {
  name: "",
  attendance: [],
  postalCode: "",
  address: "",
  building: "",
  relation: "",
  nickname: "",
  message: "",
  photos: [],
};

export function useFormState() {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const needsAddress = data.attendance.some((key) =>
    CEREMONY_KEYS.includes(key)
  );

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const toggleAttendance = useCallback((key: AttendanceKey) => {
    setData((prev) => {
      const next = prev.attendance.includes(key)
        ? prev.attendance.filter((k) => k !== key)
        : [...prev.attendance, key];
      return { ...prev, attendance: next };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.attendance;
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "お名前が未入力です。ご芳名をご記入ください。";
    }

    if (data.attendance.length === 0) {
      newErrors.attendance =
        "参列のご希望が選択されていません。いずれか1つ以上をお選びください。";
    }

    if (needsAddress) {
      const digits = data.postalCode.replace(/[^0-9]/g, "");
      if (digits.length !== 7) {
        newErrors.postalCode =
          "郵便番号が正しくありません。7桁の数字をご入力ください。";
      }
      if (!data.address.trim()) {
        newErrors.address =
          "ご住所が未入力です。住所をご記入ください。";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data, needsAddress]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("attendance", JSON.stringify(data.attendance));
      if (needsAddress) {
        formData.append("postalCode", data.postalCode);
        formData.append("address", data.address);
        formData.append("building", data.building);
      }
      formData.append("relation", data.relation);
      formData.append("nickname", data.nickname);
      formData.append("message", data.message);
      for (const photo of data.photos) {
        formData.append("photos", photo);
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }

      setIsSubmitted(true);
    } catch {
      setErrors({
        name: "送信できませんでした。サーバーとの接続に問題があるようです。しばらくしてからもう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [data, needsAddress, validate]);

  return {
    data,
    errors,
    isSubmitting,
    isSubmitted,
    needsAddress,
    updateField,
    toggleAttendance,
    handleSubmit,
  };
}
