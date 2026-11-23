"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DiagnosisPage() {
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHasKorean, setPasswordHasKorean] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [adsAgreed, setAdsAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!businessType) {
      alert("사업 형태를 선택해주세요.");
      return;
    }

    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관과 개인정보 수집·이용에 동의해주세요.");
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

    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(password)) {
      setLoading(false);
      alert("비밀번호에는 한글을 사용할 수 없습니다. 영문과 숫자로 입력해주세요.");
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
      const errorMessage = signUpError.message.toLowerCase();
      if (errorMessage.includes("rate limit") || errorMessage.includes("email rate limit")) {
        alert("이메일 인증 요청이 일시적으로 제한되었습니다. 반복해서 가입을 시도하지 마시고, 제한이 풀린 뒤 다시 시도해주세요. 이미 인증 메일을 받았다면 메일함에서 기존 인증 메일을 확인해주세요.");
      } else {
        alert(`회원가입 중 오류가 발생했습니다.\\n\\n${signUpError.message}`);
      }
      return;
    }

    if (!signUpData.user) {
      setLoading(false);
      alert("회원가입은 완료되었지만 사용자 정보를 확인할 수 없습니다.");
      return;
    }

    // Supabase may return a user-shaped response for an existing email.
    // An empty identities array indicates that no new identity was created.
    if (
      signUpData.user.identities &&
      signUpData.user.identities.length === 0
    ) {
      setLoading(false);
      alert("이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.");
      return;
    }

    let utmSource: string | null = null;
    try {
      const savedSource = window.localStorage.getItem("marketing_utm_source");
      if (savedSource && ["naver", "youtube", "instagram", "daangn"].includes(savedSource)) {
        utmSource = savedSource;
      }
    } catch {
      // Continue registration when browser storage is unavailable.
    }

    // Store the checklist in the existing inquiry field to avoid a database migration.
    const checklistFields = [
      ["사업장 상세주소", "business_address"],
      ["사업 운영기간", "business_age"],
      ["최근 연매출", "annual_sales"],
      ["현재 직원 수", "employee_count"],
      ["필요 자금 종류", "fund_type"],
      ["필요 자금 규모", "fund_amount"],
      ["기존 대출 이용", "existing_loans"],
      ["자금 필요 시기", "fund_timing"],
      ["필요한 안내", "help_topic"],
    ] as const;
    const checklistText = checklistFields
      .map(([label, key]) => `${label}: ${String(formData.get(key) || "").trim()}`)
      .join("\n");
    const additionalInquiry = String(formData.get("inquiry_text") || "").trim();
    const combinedInquiry = [checklistText, additionalInquiry ? `추가 문의: ${additionalInquiry}` : ""]
      .filter(Boolean)
      .join("\n");
    if (combinedInquiry.length > 2000) {
      setLoading(false);
      alert("입력 내용이 너무 깁니다. 추가 문의 내용을 줄여주세요.");
      return;
    }

    const memberData = {
      name: String(formData.get("name") || ""),
      business_name: String(formData.get("business_name") || ""),
      phone: String(formData.get("phone") || ""),
      email,
      industry: String(formData.get("industry") || ""),
      region: String(formData.get("region") || ""),
      business_type: businessType,
      utm_source: utmSource,
      inquiry_text: combinedInquiry,
    };

    let authenticatedUser = signUpData.user;
    const authenticatedSession = signUpData.session;

    // When email confirmation is enabled, a new signup normally has no session.
    // Do not sign in or resend confirmation immediately: that can trigger Supabase's
    // resend rate limit and incorrectly report a signup failure.
    if (!authenticatedSession) {

      if (!signUpData.user.identities || signUpData.user.identities.length === 0) {
        setLoading(false);
        alert("가입 요청을 확인할 수 없습니다. 기존 계정이면 로그인하고, 신규 계정이면 잠시 후 다시 시도해주세요.");
        return;
      }

      const pendingConsentVersion = "2026-10-26-v1";
      const pendingConsentedAt = new Date().toISOString();
      localStorage.setItem(
        "pending_member_consents",
        JSON.stringify({
          terms: termsAgreed,
          privacy: privacyAgreed,
          marketing: marketingAgreed,
          ads: adsAgreed,
          consent_version: pendingConsentVersion,
          consented_at: pendingConsentedAt,
        })
      );
      localStorage.setItem(
        "pending_member_registration",
        JSON.stringify(memberData)
      );

      setLoading(false);
      alert(
        "회원가입 요청이 접수되었습니다. 이메일 인증 메일함에서 인증 링크를 확인해주세요. 인증 후 로그인하면 입력하신 기업정보가 저장됩니다."
      );
      return;
    }


    const { data: existingMember, error: existingMemberError } = await supabase
      .from("members")
      .select("id")
      .eq("auth_user_id", authenticatedUser.id)
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

    const { data: insertedMember, error: memberError } = await supabase
      .from("members")
      .insert({
        ...memberData,
        auth_user_id: authenticatedUser.id,
      })
      .select("id")
      .single();

    if (memberError || !insertedMember) {
      console.error("Supabase member error:", memberError);
      alert("기업정보 저장에 실패했습니다.\n\n" + (memberError?.message ?? "회원 ID를 확인할 수 없습니다."));
      setLoading(false);
      return;
    }

    const consentVersion = "2026-10-26-v1";
    const consentedAt = new Date().toISOString();
    const consentRows = [
      { member_id: insertedMember.id, consent_type: "terms_of_service", consent_value: termsAgreed, consent_text: "[필수] 서비스 이용약관 동의", consent_version: consentVersion, consented_at: consentedAt },
      { member_id: insertedMember.id, consent_type: "privacy_collection", consent_value: privacyAgreed, consent_text: "[필수] 개인정보 수집·이용 동의", consent_version: consentVersion, consented_at: consentedAt },
      { member_id: insertedMember.id, consent_type: "marketing_use", consent_value: marketingAgreed, consent_text: "[선택] 개인정보 마케팅 활용 동의", consent_version: consentVersion, consented_at: consentedAt },
      { member_id: insertedMember.id, consent_type: "advertising_messages", consent_value: adsAgreed, consent_text: "[선택] 광고성 정보 수신 동의", consent_version: consentVersion, consented_at: consentedAt },
    ];

    const { error: consentError } = await supabase
      .from("consent_logs")
      .insert(consentRows);

    if (consentError) {
      console.error("Consent log save error:", consentError);
      alert("기업정보는 저장됐지만 동의 이력 저장에 실패했습니다.\n\n" + consentError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">무료 기업정보 등록 완료</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">무료 기업등록이 완료되었습니다.</h1>
            <p className="mt-4 leading-7 text-gray-600">
              등록하신 기업정보와 문의 내용이 정상적으로 접수되었습니다.
              고객 로그인 후 등록된 계정을 이용하실 수 있습니다.
            </p>
            <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700">
              고객 로그인
            </Link>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">다온지원센터의 차별점</p>
            <h2 className="mt-2 text-2xl font-bold leading-snug text-gray-900">
              정책자금, 우리 기업에 맞는 신청 시기가 중요합니다.
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              정책자금은 업종·지역뿐 아니라 청년기업 여부, 여성기업·장애인기업·벤처기업 등 보유 인증,
              인력 증가, 매출 감소와 같은 기업별 상황에 따라 신청요건과 우대조건이 달라질 수 있습니다.
              다온지원센터는 이러한 조건을 공고별로 비교해 기업에 맞는 운전자금 검토 방향을 안내합니다.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              유료 이용권 활성화 후 필요한 기업자료를 미리 제출하시면, 결제일부터 1년의 이용기간 동안
              확인 가능한 운전자금 공고 일정과 기업별 요건에 맞춰 신청 준비사항과 신청 가이드를 안내합니다.
              공고 일정과 지원조건은 기관 사정에 따라 변경될 수 있으며, 신청 및 최종 제출은 사업자가 직접 진행합니다.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900">기업별 조건 검토</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">기업자료와 보유 인증, 매출·고용 변동 등을 함께 확인해 해당 공고의 요건과 우대조건을 검토합니다.</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900">신청 시기·우대조건</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">자료를 미리 제출해 주시면 제공된 정보와 공고 일정에 맞춰 신청 시기, 준비서류 및 신청 가이드를 안내합니다.</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900">AI 분석 + 전문가 검토</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">유료 진단에서 AI 분석 결과를 전문가가 확인합니다.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">선택형 유료 서비스</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">운전자금 AI 진단 · 1년 이용권</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900">49,000원 <span className="text-base font-normal text-gray-600">+ 부가세 4,900원 (총 53,900원)</span></p>
            <p className="mt-2 font-semibold text-blue-700">선정 후 추가 성공보수 없음</p>
            <p className="mt-3 text-sm text-gray-600">이용기간은 결제일부터 1년입니다.</p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-gray-700">
              <li>기업별 운전자금 진단 및 매칭</li>
              <li>공고별 신청요건과 우대조건 안내</li>
              <li>AI 분석 및 전문가 검토</li>
              <li>신청 준비자료와 절차 안내</li>
              <li>자료 사전 제출 시 공고 시기에 맞춘 준비사항 및 신청 가이드 안내</li>
              <li>이용기간 내 추가 운전자금 매칭</li>
            </ul>
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">전문 컨설팅은 별도로 제공합니다.</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                여성기업·장애인기업·벤처기업 등 기업 인증 취득 지원,
                시설자금, R&amp;D 및 기타 경영컨설팅은 기본 이용권에 포함되지 않습니다.
              </p>
            </div>
            <p className="mt-5 text-xs leading-6 text-gray-500">
              정책자금 선정이나 대출 실행을 보장하지 않으며, 실제 신청과 최종 제출은 사업자가 직접 진행합니다.
              유료 서비스 결제 안내는 고객 로그인 후 확인할 수 있습니다.
            </p>
            <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
              운전자금 진단 이용 안내 · 고객 로그인
            </Link>
            <Link href="/policy-fund" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              전문 컨설팅 상세 보기
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">무료 기업정보 등록</h1>
          <p className="mt-3 text-gray-600">기업정보와 자금 수요를 체크리스트로 등록하세요. 상세 운전자금 진단과 자료 제출은 유료 이용권 활성화 후 제공됩니다.</p>
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
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required minLength={6} placeholder="영문/숫자 6자 이상" onChange={(e) => setPasswordHasKorean(/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-blue-500" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {showPassword ? "숨기기" : "보기"}
                </button>
              </div>
              {passwordHasKorean ? (
                <p className="mt-2 text-xs font-medium text-red-600">한글은 사용할 수 없습니다. 영문과 숫자로 입력해주세요.</p>
              ) : (
                <p className="mt-2 text-xs text-gray-500">영문과 숫자를 사용해 6자 이상 입력하세요. 서류 제출 시 로그인에 사용합니다.</p>
              )}
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
                <button type="button" onClick={() => setBusinessType("개인사업자")} className={`rounded-lg border px-4 py-3 ${businessType === "개인사업자" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}>개인사업자</button>
                <button type="button" onClick={() => setBusinessType("법인사업자")} className={`rounded-lg border px-4 py-3 ${businessType === "법인사업자" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}>법인사업자</button>
              </div>
            </div>
            <div>
              <label htmlFor="business_address" className="mb-2 block text-sm font-medium text-gray-700">사업장 상세주소</label>
              <input id="business_address" name="business_address" type="text" required maxLength={150} placeholder="도로명 주소 및 상세주소" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <p className="mt-2 text-xs text-gray-500">위 지역 항목에는 시·군·구를, 이 항목에는 실제 사업장 주소를 입력해주세요.</p>
            </div>
            <section className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">기업 자금 수요 체크리스트</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">해당 항목을 선택하면 문의 내용 대신 기업의 자금 수요가 접수됩니다. 지원 가능 여부를 확정하는 진단은 아닙니다.</p>
              </div>
              <div>
                <label htmlFor="business_age" className="mb-2 block text-sm font-medium text-gray-700">사업 운영기간</label>
                <select id="business_age" name="business_age" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="1년 미만">1년 미만</option>
                  <option value="1~3년">1~3년</option>
                  <option value="3~7년">3~7년</option>
                  <option value="7년 이상">7년 이상</option>
                </select>
              </div>
              <div>
                <label htmlFor="annual_sales" className="mb-2 block text-sm font-medium text-gray-700">최근 연매출</label>
                <select id="annual_sales" name="annual_sales" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="5천만원 미만">5천만원 미만</option>
                  <option value="5천만~1억원 미만">5천만~1억원 미만</option>
                  <option value="1억~5억원 미만">1억~5억원 미만</option>
                  <option value="5억~10억원 미만">5억~10억원 미만</option>
                  <option value="10억원 이상">10억원 이상</option>
                  <option value="잘 모르겠습니다">잘 모르겠습니다</option>
                </select>
              </div>
              <div>
                <label htmlFor="employee_count" className="mb-2 block text-sm font-medium text-gray-700">현재 직원 수</label>
                <select id="employee_count" name="employee_count" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="0명">0명</option>
                  <option value="1~4명">1~4명</option>
                  <option value="5~9명">5~9명</option>
                  <option value="10~49명">10~49명</option>
                  <option value="50명 이상">50명 이상</option>
                </select>
              </div>
              <div>
                <label htmlFor="fund_type" className="mb-2 block text-sm font-medium text-gray-700">필요한 자금 종류</label>
                <select id="fund_type" name="fund_type" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="운전자금">운전자금</option>
                  <option value="시설자금">시설자금</option>
                  <option value="운전자금과 시설자금">운전자금과 시설자금</option>
                  <option value="잘 모르겠습니다">잘 모르겠습니다</option>
                </select>
              </div>
              <div>
                <label htmlFor="fund_amount" className="mb-2 block text-sm font-medium text-gray-700">필요한 자금 규모</label>
                <select id="fund_amount" name="fund_amount" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="3천만원 미만">3천만원 미만</option>
                  <option value="3천만~5천만원 미만">3천만~5천만원 미만</option>
                  <option value="5천만~1억원 미만">5천만~1억원 미만</option>
                  <option value="1억~3억원 미만">1억~3억원 미만</option>
                  <option value="3억원 이상">3억원 이상</option>
                  <option value="미정">미정</option>
                </select>
              </div>
              <div>
                <label htmlFor="existing_loans" className="mb-2 block text-sm font-medium text-gray-700">기존 대출 이용 여부</label>
                <select id="existing_loans" name="existing_loans" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="정책자금·보증부 대출 이용 중">정책자금·보증부 대출 이용 중</option>
                  <option value="일반 사업자대출 이용 중">일반 사업자대출 이용 중</option>
                  <option value="두 종류 모두 이용 중">두 종류 모두 이용 중</option>
                  <option value="현재 이용 중인 대출 없음">현재 이용 중인 대출 없음</option>
                  <option value="잘 모르겠습니다">잘 모르겠습니다</option>
                </select>
              </div>
              <div>
                <label htmlFor="fund_timing" className="mb-2 block text-sm font-medium text-gray-700">자금이 필요한 시기</label>
                <select id="fund_timing" name="fund_timing" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="즉시">즉시</option>
                  <option value="1~3개월 이내">1~3개월 이내</option>
                  <option value="3~6개월 이내">3~6개월 이내</option>
                  <option value="적합한 공고 시기에 맞춰 신청 가능">적합한 공고 시기에 맞춰 신청 가능</option>
                </select>
              </div>
              <div>
                <label htmlFor="help_topic" className="mb-2 block text-sm font-medium text-gray-700">가장 필요한 안내</label>
                <select id="help_topic" name="help_topic" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500">
                  <option value="" disabled>선택해주세요</option>
                  <option value="신청 가능한 자금 확인">신청 가능한 자금 확인</option>
                  <option value="신청 시기 확인">신청 시기 확인</option>
                  <option value="신청 절차 및 서류">신청 절차 및 서류</option>
                  <option value="기존 대출 이용 후 추가 신청">기존 대출 이용 후 추가 신청</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </section>
            <div>
              <label htmlFor="inquiry_text" className="mb-2 block text-sm font-medium text-gray-700">추가로 궁금한 사항 (선택)</label>
              <textarea id="inquiry_text" name="inquiry_text" maxLength={500} rows={3} placeholder="체크리스트 외에 전달할 내용이 있다면 입력해주세요." className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <p className="mt-2 text-xs text-gray-500">체크리스트만 선택해도 무료 등록이 가능합니다. 상세 진단과 공고 매칭은 유료 이용권에서 제공됩니다.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-5">
              <p className="mb-4 text-base font-semibold text-gray-900">약관 동의</p>
              <label className="mb-4 flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={termsAgreed && privacyAgreed && marketingAgreed && adsAgreed}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTermsAgreed(checked);
                    setPrivacyAgreed(checked);
                    setMarketingAgreed(checked);
                    setAdsAgreed(checked);
                  }}
                  className="mt-1 h-4 w-4"
                />
                <span className="font-semibold">전체 동의</span>
              </label>
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="mt-1 h-4 w-4" />
                  <span><strong className="text-gray-900">[필수]</strong> 서비스 이용약관 동의 · <Link href="/terms" target="_blank" className="text-blue-700 underline">전문 보기</Link></span>
                </label>
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input type="checkbox" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} className="mt-1 h-4 w-4" />
                  <span><strong className="text-gray-900">[필수]</strong> 개인정보 수집·이용 동의 · <Link href="/privacy#collection" target="_blank" className="text-blue-700 underline">전문 보기</Link></span>
                </label>
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input type="checkbox" checked={marketingAgreed} onChange={(e) => setMarketingAgreed(e.target.checked)} className="mt-1 h-4 w-4" />
                  <span><strong className="text-gray-900">[선택]</strong> 개인정보 마케팅 활용 동의 · <Link href="/privacy#marketing" target="_blank" className="text-blue-700 underline">전문 보기</Link></span>
                </label>
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input type="checkbox" checked={adsAgreed} onChange={(e) => setAdsAgreed(e.target.checked)} className="mt-1 h-4 w-4" />
                  <span><strong className="text-gray-900">[선택]</strong> 광고성 정보 수신 동의 · <Link href="/privacy#advertising" target="_blank" className="text-blue-700 underline">전문 보기</Link></span>
                </label>
              </div>
              <p className="mt-4 text-xs leading-5 text-gray-500">
                선택 항목에 동의하지 않아도 회원가입할 수 있습니다. 각 항목의 전문 보기를 눌러 내용을 확인한 뒤 동의해 주세요.
              </p>
            </div>
            <button type="submit" disabled={!businessType || loading} className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300">
              {loading ? "등록 중..." : "무료 기업정보 등록 완료"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
