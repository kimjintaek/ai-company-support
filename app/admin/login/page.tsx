"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setMessage(`로그인 오류: ${error.message}`);
      return;
    }

    if (!data.user) {
      setLoading(false);
      setMessage("로그인은 처리되었지만 사용자 정보가 없습니다.");
      return;
    }

    router.replace("/admin");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-blue-600">
            기업지원사업 AI 진단
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            관리자 로그인
          </h1>

          <p className="mt-3 text-gray-600">
            관리자 계정으로 로그인해주세요.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이메일
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="관리자 이메일"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "로그인 중..." : "관리자 로그인"}
            </button>

            {message && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}