"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password.length < 6) {
      alert("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(password)) {
      alert("비밀번호에는 한글을 사용할 수 없습니다. 영문과 숫자로 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      alert("비밀번호를 변경하지 못했습니다. 이메일의 재설정 링크가 만료되었을 수 있습니다. 비밀번호 찾기를 다시 진행해주세요.");
      return;
    }

    setComplete(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">새 비밀번호 설정</h1>
          <p className="mt-3 text-gray-600">새 비밀번호를 입력해주세요. 영문과 숫자를 사용해 6자 이상 설정하세요.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {complete ? (
            <div className="space-y-4">
              <p className="leading-7 text-gray-700">비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.</p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                고객 로그인
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">새 비밀번호</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="영문/숫자 6자 이상"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
