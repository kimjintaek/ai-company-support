"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DiagnosisPage() {
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!businessType) {
      alert("사업 형태를 선택해주세요.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setLoading(false);
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      alert("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setLoading(false);
      console.error("Supabase Auth error:", signUpError);
      alert(`회원가입 중 오류가 발생했습니다.\\n\\n${signUpError.message}`);
      return;
    }

    if (!signUpData.user) {
      setLoading(false);
      alert("회원가입은 완료되었지만 사용자 정보를 확인할 수 없습니다.");
      return;
    }

    if (!signUpData.session) {
      setLoading(false);
      alert(
        "회원가입은 완료되었습니다. 이메일 인증 후 로그인해야 기업정보 저장을 완료할 수 있습니다."
      );
      return;
    }

    const { data: existingMember, error: existingMemberError } = await supabase
      .from("members")
      .select("id")
      .eq("auth_user_id", signUpData.user.id)
      .maybeSingle();

    if (existingMemberError) {
      setLoading(false);
      console.error("Supabase member lookup error:", existingMemberError);
      alert(`기존 회원 확인 중 오류가 발생했습니다.\\n\\n${existingMemberError.message}`);
      return;
    }

    if (existingMember) {
      setLoading(false);
      alert("이미 기업정보가 등록된 계정입니다. 기존 계정으로 로그인해주세요.");
      return;
    }

    const { error: memberError } = await supabase.from("members").insert({
      name: formData.get("name"),
      business_name: formData.get("business_name"),
      phone: formData.get("phone"),
      email,
      industry: formData.get("industry"),
      region: formData.get("region"),
      business_type: businessType,
      auth_user_id: signUpData.user.id,
    });

    if (memberError) {
      console.error("Supabase member error:", memberError);
      alert(`기업정보 저장 중 오류가 발생했습니다.\\n\\n${memberError.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">진단 신청 접수완료</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              기본정보 접수가 완료되었습니다.
            </h1>
            <p className="mt-4 leading-7 text-gray-600">
              유료 진단 서비스를 이용하시려면 아래 계좌로 결제해주세요.
            </p>

            <div className="mt-8 rounded-xl bg-blue-50 p-6">
              <p className="text-sm font-medium text-gray-600">기업지원 AI 진단 서비스</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">49,000원 + 부가세</p>
              <p className="mt-1 text-sm text-gray-600">실제 입금금액: 53,900원</p>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">입금계좌</p>
              <p className="mt-2 text-xl font-bold text-gray-900">신한은행 100-037-330541</p>
              <p className="mt-2 text-gray-700">예금주: (주)다온지원센터</p>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-5 text-sm leading-6 text-gray-600">
              <p>입금 확인 후 유료 진단 이용권이 활성화됩니다.</p>
              <p>이용권 활성화 후 로그인하여 재무제표 및 4대보험 관련 자료를 제출할 수 있습니다.</p>
              <p>결제 확인은 영업일 기준으로 순차 처리됩니다.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">우리 회사 정보를 입력해주세요</h1>
          <p className="mt-3 text-gray-600">기본정보를 바탕으로 검토 가능한 지원사업을 분석합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">대표자명</label>
              <input name="name" type="text" required placeholder="대표자명을 입력하세요" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">사업자명</label>
              <input name="business_name" type="text" required placeholder="사업자명을 입력하세요" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">연락처</label>
              <input name="phone" type="tel" required placeholder="010-0000-0000" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
              <input name="email" type="email" required placeholder="example@email.com" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
              <input name="password" type="password" required minLength={6} placeholder="6자 이상 입력하세요" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <p className="mt-2 text-xs text-gray-500">서류 제출 시 로그인할 때 사용하는 비밀번호입니다.</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">업종</label>
              <input name="industry" type="text" required placeholder="예: 제조업, 음식점업, 도소매업" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">지역</label>
              <input name="region" type="text" required placeholder="예: 광주광역시" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">사업 형태</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setBusinessType("개인사업자")} className={`rounded-lg border px-4 py-3 ${businessType === "개인사업자" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}>
                  개인사업자
                </button>
                <button type="button" onClick={() => setBusinessType("법인사업자")} className={`rounded-lg border px-4 py-3 ${businessType === "법인사업자" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}>
                  법인사업자
                </button>
              </div>
            </div>

            <button type="submit" disabled={!businessType || loading} className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300">
              {loading ? "접수 중..." : "진단 신청하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
