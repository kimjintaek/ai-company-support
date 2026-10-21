"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("인증 링크를 확인하고 있습니다.");

  useEffect(() => {
    let cancelled = false;

    const confirmRecovery = async () => {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!tokenHash || type !== "recovery") {
        setMessage("유효하지 않은 비밀번호 재설정 링크입니다. 비밀번호 찾기를 다시 진행해주세요.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (cancelled) return;

      if (error) {
        setMessage("인증 링크가 만료되었거나 이미 사용되었습니다. 비밀번호 찾기를 다시 진행해주세요.");
        return;
      }

      router.replace("/reset-password");
    };

    void confirmRecovery();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">비밀번호 재설정 인증</h1>
        <p className="mt-4 leading-7 text-gray-600">{message}</p>
        {message.startsWith("인증 링크가 만료") || message.startsWith("유효하지 않은") ? (
          <button
            type="button"
            onClick={() => router.replace("/forgot-password")}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            비밀번호 찾기로 이동
          </button>
        ) : null}
      </div>
    </main>
  );
}
