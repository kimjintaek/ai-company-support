"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CONSENTS = [
  { key: "terms_of_service", storageKey: "terms", text: "[필수] 서비스 이용약관 동의" },
  { key: "privacy_collection", storageKey: "privacy", text: "[필수] 개인정보 수집·이용 동의" },
  { key: "marketing_use", storageKey: "marketing", text: "[선택] 개인정보 마케팅 활용 동의" },
  { key: "advertising_messages", storageKey: "ads", text: "[선택] 광고성 정보 수신 동의" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        alert("로그인에 실패했습니다. 이메일 인증 여부와 이메일·비밀번호를 확인해 주세요.");
        return;
      }

      const { data: member, error: lookupError } = await supabase
        .from("members")
        .select("id")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (lookupError) {
        alert(`회원정보 확인 중 오류가 발생했습니다.\n\n${lookupError.message}`);
        return;
      }

      let memberId: string | null = member?.id ?? null;

      if (!memberId) {
        const pending = localStorage.getItem("pending_member_registration");

        if (pending) {
          let memberData: Record<string, unknown>;

          try {
            memberData = JSON.parse(pending);
          } catch {
            alert("임시 기업정보를 읽을 수 없습니다. 진단 신청을 다시 진행해 주세요.");
            return;
          }

          const { data: inserted, error: insertError } = await supabase
            .from("members")
            .insert({ ...memberData, auth_user_id: data.user.id })
            .select("id")
            .single();

          if (insertError || !inserted) {
            alert(`기업정보 저장 중 오류가 발생했습니다.\n\n${insertError?.message ?? "회원 ID를 확인할 수 없습니다."}`);
            return;
          }

          memberId = inserted.id;
        }
      }

      if (!memberId) {
        await supabase.auth.signOut();
        setLoading(false);
        alert("고객 회원정보가 없습니다. 먼저 무료 진단 신청을 진행해주세요.");
        return;
      }

      const pendingConsentText = localStorage.getItem("pending_member_consents");

      if (pendingConsentText) {
        if (!memberId) {
          alert("동의 내역을 연결할 회원정보를 찾지 못했습니다. 진단 신청을 다시 진행해 주세요.");
          return;
        }

        let pendingConsents: Record<string, unknown>;

        try {
          pendingConsents = JSON.parse(pendingConsentText);
        } catch {
          alert("임시 동의 내역을 읽을 수 없습니다. 진단 신청을 다시 진행해 주세요.");
          return;
        }

        const version = String(
          pendingConsents.consent_version ?? pendingConsents.version ?? "2026-10-26-v1"
        );
        const consentedAt = String(
          pendingConsents.consented_at ?? new Date().toISOString()
        );

        const rows = CONSENTS.map((consent) => ({
          member_id: memberId,
          consent_type: consent.key,
          consent_value: pendingConsents[consent.storageKey] === true,
          consent_text: consent.text,
          consent_version: version,
          consented_at: consentedAt,
        }));

        const { error: consentError } = await supabase
          .from("consent_logs")
          .insert(rows);

        if (consentError) {
          alert(`동의 내역 저장 중 오류가 발생했습니다.\n\n${consentError.message}\n\n임시 동의 내역은 유지됩니다.`);
          return;
        }

        localStorage.removeItem("pending_member_consents");
        localStorage.removeItem("pending_member_registration");
      }

      router.push("/documents");
    } catch (error) {
      alert(
        `로그인 처리 중 오류가 발생했습니다.\n\n${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">고객 로그인</h1>
          <p className="mt-3 text-gray-600">
            진단 신청 시 등록한 이메일과 비밀번호로 로그인해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
              <input
                name="email"
                type="email"
                required
                placeholder="example@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A11.4 11.4 0 0112 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.3M6.2 6.2C3.9 7.7 2.8 9.7 2.5 12c1 2.8 4.5 7 9.5 7 1.4 0 2.6-.3 3.7-.8" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="text-right">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            <button
              type="button"
              onClick={() => router.push("/diagnosis")}
              className="w-full rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              아직 신청하지 않았다면 진단 신청하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

