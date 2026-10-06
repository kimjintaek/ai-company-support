"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DiagnosisPage() {
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!businessType) {
      alert("사업 형태를 선택해주세요.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from("members").insert({
      name: formData.get("name"),
      business_name: formData.get("business_name"),
      phone: formData.get("phone"),
      email: formData.get("email") || null,
      industry: formData.get("industry"),
      region: formData.get("region"),
      business_type: businessType,
    });

    setLoading(false);

    if (error) {
  console.error("Supabase error:", error);
  alert(`저장 중 오류가 발생했습니다.\n\n${error.message}`);
  return;
}

    alert("진단 신청이 정상적으로 접수되었습니다.");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            기업지원사업 AI 진단
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            우리 회사 정보를 입력해주세요
          </h1>

          <p className="mt-3 text-gray-600">
            기본정보를 바탕으로 검토 가능한 지원사업을 분석합니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                대표자명
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="대표자명을 입력하세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                사업자명
              </label>
              <input
                name="business_name"
                type="text"
                required
                placeholder="사업자명을 입력하세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                연락처
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="010-0000-0000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                업종
              </label>
              <input
                name="industry"
                type="text"
                required
                placeholder="예: 제조업, 음식점업, 도소매업"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                지역
              </label>
              <input
                name="region"
                type="text"
                required
                placeholder="예: 광주광역시"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                사업 형태
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBusinessType("개인사업자")}
                  className={`rounded-lg border px-4 py-3 ${
                    businessType === "개인사업자"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  개인사업자
                </button>

                <button
                  type="button"
                  onClick={() => setBusinessType("법인사업자")}
                  className={`rounded-lg border px-4 py-3 ${
                    businessType === "법인사업자"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  법인사업자
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!businessType || loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "접수 중..." : "진단 신청하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}