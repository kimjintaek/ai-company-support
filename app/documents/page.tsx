"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("");
  const [financialFile, setFinancialFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadMember = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (memberError || !member) {
        setMessage(
          memberError?.message ||
            "회원정보를 찾을 수 없습니다. 진단 신청 후 다시 로그인해주세요."
        );
        setLoading(false);
        return;
      }

      const { data: activeLicense, error: licenseError } = await supabase
        .from("licenses")
        .select("status, expiry_date")
        .eq("member_id", member.id)
        .eq("status", "활성")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (licenseError) {
        setMessage("이용권 확인 중 오류가 발생했습니다.\n\n" + licenseError.message);
        setLoading(false);
        return;
      }

      setMemberId(member.id);

      const active =
        activeLicense?.status === "활성" &&
        (!activeLicense.expiry_date ||
          new Date(activeLicense.expiry_date).getTime() >= Date.now());

      setLicenseStatus(active ? "활성" : "대기");
      setLoading(false);
    };

    loadMember();
  }, [router]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!financialFile && !insuranceFile) {
      setMessage("재무제표 또는 4대보험 자료 중 하나 이상을 선택해주세요.");
      return;
    }

    if (licenseStatus !== "활성") {
      setMessage("유료 진단 이용권이 활성화된 후 자료를 제출할 수 있습니다.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !memberId) {
        router.replace("/login");
        return;
      }

      const uploaded: { financial?: string; insurance?: string } = {};

      if (financialFile) {
        const financialPath =
          user.id + "/financial-" + Date.now() + "-" + financialFile.name;

        const { error } = await supabase.storage
          .from("diagnosis-files")
          .upload(financialPath, financialFile, { upsert: false });

        if (error) throw new Error("재무제표 업로드 실패: " + error.message);
        uploaded.financial = financialPath;
      }

      if (insuranceFile) {
        const insurancePath =
          user.id + "/insurance-" + Date.now() + "-" + insuranceFile.name;

        const { error } = await supabase.storage
          .from("diagnosis-files")
          .upload(insurancePath, insuranceFile, { upsert: false });

        if (error) throw new Error("4대보험 자료 업로드 실패: " + error.message);
        uploaded.insurance = insurancePath;
      }

      const { data: existingDiagnosis } = await supabase
        .from("diagnoses")
        .select("id, financial_file_path, insurance_file_path")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const diagnosisData = {
        member_id: memberId,
        financial_file_path:
          uploaded.financial ?? existingDiagnosis?.financial_file_path ?? null,
        insurance_file_path:
          uploaded.insurance ?? existingDiagnosis?.insurance_file_path ?? null,
      };

      if (existingDiagnosis?.id) {
        const { error } = await supabase
          .from("diagnoses")
          .update(diagnosisData)
          .eq("id", existingDiagnosis.id);

        if (error) throw new Error("진단자료 저장 실패: " + error.message);
      } else {
        const { error } = await supabase
          .from("diagnoses")
          .insert(diagnosisData);

        if (error) throw new Error("진단자료 저장 실패: " + error.message);
      }

      setFinancialFile(null);
      setInsuranceFile(null);
      setMessage("자료 제출이 완료되었습니다. 관리자 검토 후 AI 진단을 진행합니다.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "자료 제출 중 오류가 발생했습니다."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          자료 제출 정보를 확인하는 중입니다...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            진단 자료 제출
          </h1>
          <p className="mt-3 text-gray-600">
            이용권 활성화 후 재무제표와 4대보험 관련 자료를 제출해주세요.
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">이용권 상태</p>
          <p className={"mt-1 text-lg font-bold " + (licenseStatus === "활성" ? "text-green-600" : "text-orange-600")}>
            {licenseStatus === "활성" ? "이용권 활성" : "입금 확인 대기"}
          </p>
        </div>

        {licenseStatus !== "활성" ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              이용권 활성화가 필요합니다.
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              입금 확인 후 관리자에서 이용권을 활성화하면 이 화면에서 자료를 제출할 수 있습니다.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleUpload}
            className="rounded-2xl bg-white p-8 shadow-sm"
          >
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  재무제표
                </label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => setFinancialFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
                <p className="mt-2 text-xs text-gray-500">
                  최근 3개년 재무제표 등 분석에 필요한 자료를 제출해주세요.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  4대보험 관련 자료
                </label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => setInsuranceFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
                <p className="mt-2 text-xs text-gray-500">
                  가입현황 및 상실자 확인에 필요한 자료를 제출해주세요.
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {uploading ? "제출 중..." : "자료 제출하기"}
              </button>
            </div>
          </form>
        )}

        {message && (
          <div className="mt-6 whitespace-pre-line rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
            {message}
          </div>
        )}

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/login");
          }}
          className="mt-6 w-full rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          로그아웃
        </button>
      </div>
    </main>
  );
}
