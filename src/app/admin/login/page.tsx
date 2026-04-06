"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (res.ok) {
          router.push("/admin");
        } else {
          const data = await res.json();
          setError(data.error ?? "ログインに失敗しました。");
        }
      } catch {
        setError("通信エラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    },
    [password, router]
  );

  return (
    <div className="flex min-h-svh items-center justify-center bg-base px-5">
      <div className="w-full max-w-[360px]">
        <h1 className="text-center font-cormorant text-[20px] tracking-[0.1em] text-text">
          Admin
        </h1>

        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="password"
            className="mb-2 block font-mincho text-[13px] font-bold text-[#141111]"
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-[2px] border border-border px-4 py-3 font-mincho text-[16px] text-text outline-none transition-colors placeholder:text-[#BDBDBD] focus:border-pressed"
            placeholder="パスワードを入力"
          />

          {error && (
            <p className="mt-3 text-[13px] text-[#C62828]" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || !password}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
