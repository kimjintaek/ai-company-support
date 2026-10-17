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
  const [businessRegistrationFile, setBusinessRegistrationFile] = useState<File | null>(null);
  const [financialFile, setFinancialFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [savedFiles, setSavedFiles] = useState<{ label: string; path: string; url: string }[]>([]);
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

      const { data: latestDiagnosis, error: diagnosisError } = await supabase
        .from("diagnoses")
        .select("business_registration_file_path, financial_file_path, insurance_file_path")
        .eq("member_id", member.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (diagnosisError) {
        setMessage("기존 제출자료 확인 중 오류가 발생했습니다. " + diagnosisError.message);
      } else if (latestDiagnosis) {
        const fileEntries = [
          { label: "사업자등록증", path: latestDiagnosis.business_registration_file_path },
          { label: "재무제표", path: latestDiagnosis.financial_file_path },
          { label: "4대보험 관련 자료", path: latestDiagnosis.insurance_file_path },
        ].filter((item): item is { label: string; path: string } => Boolean(item.path));

        const signedFiles = await Promise.all(
          fileEntries.map(async (item) => {
            const { data, error } = await supabase.storage
              .from("diagnosis-files")
              .createSignedUrl(item.path, 3600);
            return error || !data?.signedUrl
              ? null
              : { label: item.label, path: item.path, url: data.signedUrl };
          })
        );
        setSavedFiles(signedFiles.filter((item): item is { label: string; path: string; url: string } => Boolean(item)));
      }

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

    if (!businessRegistrationFile && !financialFile && !insuranceFile) {
      setMessage("사업자등록증, 재무제표, 4대보험 자료 중 하나 이상을 선택해주세요.");
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

      const uploaded: { businessRegistration?: string; financial?: string; insurance?: string } = {};

      // Storage object keys should use a safe filename. Remove spaces and
      // special characters from the original filename while preserving the extension.
      const safeFileName = (file: File) => {
        const dotIndex = file.name.lastIndexOf(".");
        const extension = dotIndex >= 0 ? file.name.slice(dotIndex).toLowerCase() : "";
        const baseName = dotIndex >= 0 ? file.name.slice(0, dotIndex) : file.name;
        const safeBaseName =
          baseName
            .normalize("NFKC")
            .replace(/[^a-zA-Z0-9_-]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || "document";

        return safeBaseName + extension;
      };

      if (businessRegistrationFile) {
        const businessRegistrationPath =
          user.id + "/business-registration-" + Date.now() + "-" + safeFileName(businessRegistrationFile);

        const { error } = await supabase.storage
          .from("diagnosis-files")
          .upload(businessRegistrationPath, businessRegistrationFile, { upsert: false });

        if (error) throw new Error("사업자등록증 업로드 실패: " + error.message);
        uploaded.businessRegistration = businessRegistrationPath;
      }

      if (financialFile) {
        const financialPath =
          user.id + "/financial-" + Date.now() + "-" + safeFileName(financialFile);

        const { error } = await supabase.storage
          .from("diagnosis-files")
          .upload(financialPath, financialFile, { upsert: false });

        if (error) throw new Error("재무제표 업로드 실패: " + error.message);
        uploaded.financial = financialPath;
      }

      if (insuranceFile) {
        const insurancePath =
          user.id + "/insurance-" + Date.now() + "-" + safeFileName(insuranceFile);

        const { error } = await supabase.storage
          .from("diagnosis-files")
          .upload(insurancePath, insuranceFile, { upsert: false });

        if (error) throw new Error("4대보험 자료 업로드 실패: " + error.message);
        uploaded.insurance = insurancePath;
      }

      const { data: existingDiagnosis } = await supabase
        .from("diagnoses")
        .select("id, business_registration_file_path, financial_file_path, insurance_file_path")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const diagnosisData = {
        member_id: memberId,
        business_registration_file_path:
          uploaded.businessRegistration ?? existingDiagnosis?.business_registration_file_path ?? null,
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

      setBusinessRegistrationFile(null);
      setFinancialFile(null);
      setInsuranceFile(null);

      const { data: refreshedDiagnosis } = await supabase
        .from("diagnoses")
        .select("business_registration_file_path, financial_file_path, insurance_file_path")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (refreshedDiagnosis) {
        const fileEntries = [
          { label: "사업자등록증", path: refreshedDiagnosis.business_registration_file_path },
          { label: "재무제표", path: refreshedDiagnosis.financial_file_path },
          { label: "4대보험 관련 자료", path: refreshedDiagnosis.insurance_file_path },
        ].filter((item): item is { label: string; path: string } => Boolean(item.path));

        const signedFiles = await Promise.all(
          fileEntries.map(async (item) => {
            const { data, error } = await supabase.storage
              .from("diagnosis-files")
              .createSignedUrl(item.path, 3600);
            return error || !data?.signedUrl
              ? null
              : { label: item.label, path: item.path, url: data.signedUrl };
          })
        );
        setSavedFiles(signedFiles.filter((item): item is { label: string; path: string; url: string } => Boolean(item)));
      }

      setMessage("자료 제출이 완료되었습니다. 제출한 파일은 재로그인 후에도 확인할 수 있습니다.");
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
            이용권 활성화 후 사업자등록증, 재무제표, 4대보험 관련 자료를 제출해주세요.
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
              아래 계좌로 이용권 금액을 입금한 뒤, 입금자명을 확인해 주세요. 관리자가 입금을 확인하고 이용권을 활성화하면 자료를 제출할 수 있습니다.
            </p>
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-800">이용권 결제 안내</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-gray-600">이용기간</span>
                <span className="font-semibold text-gray-900">12개월</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-gray-600">입금 금액</span>
                <span className="text-xl font-bold text-gray-900">53,900원</span>
              </div>
              <div className="mt-4 border-t border-blue-200 pt-4">
                <p className="text-sm text-gray-600">은행</p>
                <p className="font-semibold text-gray-900">신한은행</p>
                <p className="mt-3 text-sm text-gray-600">계좌번호</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-bold tracking-wide text-gray-900">100-037-330541</p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText("100-037-330541");
                        setMessage("계좌번호를 복사했습니다.");
                      } catch {
                        setMessage("계좌번호를 직접 복사해 주세요: 100-037-330541");
                      }
                    }}
                    className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    계좌번호 복사
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-600">예금주</p>
                <p className="font-semibold text-gray-900">(주)다온지원센터</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                입금 후 관리자 확인이 완료되면 이용권이 활성화됩니다. 입금자명은 실제 송금자명과 동일하게 입력해 주세요.
              </p>
            </div>
          </div>
        ) : (
          <>
          {savedFiles.length > 0 && (
            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">기존 제출자료</h2>
              <p className="mt-1 text-sm text-gray-600">
                이전에 제출한 파일입니다. 다시 로그인해도 보관된 자료를 확인할 수 있습니다.
              </p>
              <ul className="mt-4 space-y-3">
                {savedFiles.map((file) => (
                  <li key={file.path} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{file.label}</p>
                      <p className="break-all text-xs text-gray-500">{file.path.split("/").pop()}</p>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex justify-center rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      파일 열기
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <form
            onSubmit={handleUpload}
            className="rounded-2xl bg-white p-8 shadow-sm"
          >
            <h2 className="mb-5 text-lg font-bold text-gray-900">새 자료 제출 또는 교체</h2>
            <p className="mb-5 text-sm text-gray-600">
              새 파일을 선택한 항목만 교체됩니다. 선택하지 않은 기존 파일은 유지됩니다.
            </p>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  사업자등록증
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setBusinessRegistrationFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
                <p className="mt-2 text-xs text-gray-500">
                  사업자등록증 사본을 제출해주세요. (PDF 또는 이미지)
                </p>
              </div>

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
          </>
        )}

        {message && (
          <div className="mt-6 whitespace-pre-line rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/result")}
            className="w-full rounded-xl border border-blue-200 bg-blue-50 py-3 font-semibold text-blue-700 hover:bg-blue-100"
          >
            진단결과 확인
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="w-full rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </main>
  );
}
