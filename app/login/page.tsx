"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      return;
    }

    router.push("/documents");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">고객 로그인</h1>
          <p className="mt-3 text-gray-600">진단 신청 시 등록한 이메일과 비밀번호로 로그인해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
              <input name="email" type="email" required placeholder="example@email.com" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
              <input name="password" type="password" required placeholder="비밀번호를 입력하세요" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300">
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <button type="button" onClick={() => router.push("/diagnosis")} className="w-full rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50">
              아직 신청하지 않았다면 진단 신청하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
