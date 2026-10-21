"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://ai-company-support.vercel.app/reset-password",
    });

    setLoading(false);

    if (error) {
      alert("재설정 이메일을 보내지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSent(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">비밀번호 찾기</h1>
          <p className="mt-3 text-gray-600">가입할 때 사용한 이메일 주소를 입력해주세요.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {sent ? (
            <div className="space-y-4">
              <p className="leading-7 text-gray-700">
                해당 이메일로 계정이 등록되어 있다면 비밀번호 재설정 링크를 보냈습니다.
                받은편지함과 스팸메일함을 확인해주세요.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                로그인으로 돌아가기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="가입한 이메일 주소"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? "전송 중..." : "재설정 이메일 보내기"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                로그인으로 돌아가기
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
