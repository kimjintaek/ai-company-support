"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  email: string | null;
  industry: string;
  region: string;
  business_type: string;
  created_at: string;
};

type License = {
  id: string;
  member_id: string;
  payment_date: string | null;
  start_date: string | null;
  expiry_date: string | null;
  amount: number;
  payment_method: string | null;
  status: string;
};

type Diagnosis = {
  id: string;
  member_id: string;
  financial_file_path: string | null;
  insurance_file_path: string | null;
  ai_draft: string | null;
  expert_memo: string | null;
  sent_at: string | null;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openingFile, setOpeningFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [expertMemo, setExpertMemo] = useState("");
  const [savingDiagnosis, setSavingDiagnosis] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (adminError) {
        console.error("admin_users 오류:", adminError);
        setErrorMessage(adminError.message);
        setLoading(false);
        return;
      }

      if (!adminUser) {
        setErrorMessage("관리자 권한이 확인되지 않습니다.");
        setLoading(false);
        return;
      }

      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select(
          "id, name, business_name, phone, email, industry, region, business_type, created_at"
        )
        .order("created_at", { ascending: false });

      if (memberError) {
        console.error("members 오류:", memberError);
        setErrorMessage(memberError.message);
        setLoading(false);
        return;
      }

      const { data: licenseData, error: licenseError } = await supabase
        .from("licenses")
        .select(
          "id, member_id, payment_date, start_date, expiry_date, amount, payment_method, status"
        );

      if (licenseError) {
        console.error("licenses 오류:", licenseError);
        setErrorMessage(licenseError.message);
        setLoading(false);
        return;
      }

      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from("diagnoses")
        .select(
          "id, member_id, financial_file_path, insurance_file_path, ai_draft, expert_memo, sent_at, created_at"
        )
        .order("created_at", { ascending: false });

      if (diagnosisError) {
        console.error("diagnoses 오류:", diagnosisError);
        setErrorMessage("진단자료 조회 오류: " + diagnosisError.message);
        setLoading(false);
        return;
      }

      setMembers(memberData ?? []);
      setLicenses(licenseData ?? []);
      setDiagnoses(diagnosisData ?? []);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    const diagnosis = diagnoses.find((item) => item.member_id === member.id);
    setAiDraft(diagnosis?.ai_draft ?? "");
    setExpertMemo(diagnosis?.expert_memo ?? "");
  };

  const handleSaveDiagnosisDraft = async () => {
    if (!selectedMember) {
      return;
    }

    const diagnosis = getDiagnosis(selectedMember.id);

    if (!diagnosis) {
      alert("먼저 고객이 재무제표 및 4대보험 자료를 제출해야 합니다.");
      return;
    }

    setSavingDiagnosis(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("diagnoses")
      .update({
        ai_draft: aiDraft || null,
        expert_memo: expertMemo || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", diagnosis.id)
      .select()
      .single();

    if (error) {
      console.error("진단 초안 저장 오류:", error);
      setErrorMessage("진단 초안 저장 오류: " + error.message);
      setSavingDiagnosis(false);
      return;
    }

    setDiagnoses((current) =>
      current.map((item) => (item.id === diagnosis.id ? data : item))
    );
    setSavingDiagnosis(false);
    alert("진단 초안과 전문가 메모가 저장되었습니다.");
  };

  const getLicense = (memberId: string) => {
    return licenses.find((license) => license.member_id === memberId);
  };

  const getDiagnosis = (memberId: string) => {
    return diagnoses.find((diagnosis) => diagnosis.member_id === memberId);
  };

  const openDiagnosisFile = async (path: string | null, label: string) => {
    if (!path) {
      alert(label + " 파일이 아직 제출되지 않았습니다.");
      return;
    }

    setOpeningFile(label);

    const { data, error } = await supabase.storage
      .from("diagnosis-files")
      .createSignedUrl(path, 300);

    setOpeningFile("");

    if (error || !data?.signedUrl) {
      alert(
        label + " 파일을 열 수 없습니다.\n\n" +
          (error?.message ?? "파일 주소를 생성하지 못했습니다.")
      );
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleConfirmPayment = async (member: Member) => {
    const confirmed = window.confirm(
      `${member.business_name}의 입금 53,900원을 확인하고 이용권을 활성화하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(member.id);
    setErrorMessage("");

    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const existingLicense = getLicense(member.id);

    if (existingLicense) {
      const { data, error } = await supabase
        .from("licenses")
        .update({
          payment_date: today.toISOString(),
          start_date: today.toISOString(),
          expiry_date: expiryDate.toISOString(),
          amount: 53900,
          payment_method: "계좌이체",
          status: "활성",
        })
        .eq("id", existingLicense.id)
        .select()
        .single();

      if (error) {
        console.error("license 업데이트 오류:", error);
        setErrorMessage(error.message);
        setProcessingId("");
        return;
      }

      setLicenses((current) =>
        current.map((license) =>
          license.id === existingLicense.id ? data : license
        )
      );
    } else {
      const { data, error } = await supabase
        .from("licenses")
        .insert({
          member_id: member.id,
          payment_date: today.toISOString(),
          start_date: today.toISOString(),
          expiry_date: expiryDate.toISOString(),
          period_months: 12,
          amount: 53900,
          payment_method: "계좌이체",
          status: "활성",
        })
        .select()
        .single();

      if (error) {
        console.error("license 생성 오류:", error);
        setErrorMessage(error.message);
        setProcessingId("");
        return;
      }

      setLicenses((current) => [...current, data]);
    }

    setProcessingId("");
    alert("입금 확인 및 이용권 활성화가 완료되었습니다.");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              기업지원사업 AI 진단
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            진단 신청 기업
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            현재 접수된 기업 정보를 확인할 수 있습니다.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            오류: {errorMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              데이터를 불러오는 중입니다...
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              접수된 기업이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      대표자
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      사업자명
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      연락처
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      이메일
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      업종
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      지역
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      형태
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      결제상태
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      신청일
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      진단자료
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      처리
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => {
                    const license = getLicense(member.id);
                    const diagnosis = getDiagnosis(member.id);

                    return (
                      <tr
                        key={member.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4">{member.name}</td>

                        <td className="px-4 py-4 font-medium">
                          <button
                            onClick={() => handleSelectMember(member)}
                            className="text-blue-600 hover:underline"
                          >
                            {member.business_name}
                          </button>
                        </td>

                        <td className="px-4 py-4">{member.phone}</td>

                        <td className="px-4 py-4">
                          {member.email ?? "-"}
                        </td>

                        <td className="px-4 py-4">{member.industry}</td>

                        <td className="px-4 py-4">{member.region}</td>

                        <td className="px-4 py-4">
                          {member.business_type}
                        </td>

                        <td className="px-4 py-4">
                          {license?.status === "활성" ? (
                            <span className="font-semibold text-green-600">
                              결제완료
                            </span>
                          ) : (
                            <span className="text-orange-600">
                              입금대기
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {new Date(member.created_at).toLocaleString(
                            "ko-KR"
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {diagnosis ? (
                            <button
                              onClick={() => handleSelectMember(member)}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              제출자료 확인
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              미제출
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {license?.status === "활성" ? (
                            <span className="text-sm text-green-600">
                              이용권 활성
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                handleConfirmPayment(member)
                              }
                              disabled={processingId === member.id}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                            >
                              {processingId === member.id
                                ? "처리 중..."
                                : "입금확인"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedMember && (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  신청자 상세정보
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedMember.business_name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">대표자명</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.name}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">사업자명</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.business_name}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">연락처</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.phone}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">이메일</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.email ?? "-"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">업종</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.industry}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">지역</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.region}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">사업 형태</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMember.business_type}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">신청일</p>
                <p className="mt-1 font-medium text-gray-900">
                  {new Date(selectedMember.created_at).toLocaleString(
                    "ko-KR"
                  )}
                </p>
              </div>
            </div>

            {(() => {
              const license = getLicense(selectedMember.id);

              return (
                <div className="mt-6 rounded-xl border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-gray-700">
                    이용권 정보
                  </p>

                  {license ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray-500">상태</p>
                        <p className="mt-1 font-semibold text-green-600">
                          {license.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">결제금액</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {license.amount.toLocaleString()}원
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">결제방법</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {license.payment_method ?? "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">만료일</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {license.expiry_date
                            ? new Date(
                                license.expiry_date
                              ).toLocaleDateString("ko-KR")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-orange-600">
                      아직 입금확인 및 이용권 활성화가 되지 않았습니다.
                    </p>
                  )}
                </div>
              );
            })()}

            {(() => {
              const diagnosis = getDiagnosis(selectedMember.id);

              return (
                <div className="mt-6 rounded-xl border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-gray-700">
                    진단자료
                  </p>

                  {!diagnosis ? (
                    <p className="mt-3 text-sm text-gray-500">
                      아직 제출된 진단자료가 없습니다.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">재무제표</p>
                        <p className="mt-1 font-medium text-gray-900">
                          {diagnosis.financial_file_path ? "제출완료" : "미제출"}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openDiagnosisFile(
                              diagnosis.financial_file_path,
                              "재무제표"
                            )
                          }
                          disabled={
                            !diagnosis.financial_file_path ||
                            openingFile === "재무제표"
                          }
                          className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          {openingFile === "재무제표" ? "여는 중..." : "파일 보기"}
                        </button>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">4대보험 자료</p>
                        <p className="mt-1 font-medium text-gray-900">
                          {diagnosis.insurance_file_path ? "제출완료" : "미제출"}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openDiagnosisFile(
                              diagnosis.insurance_file_path,
                              "4대보험 자료"
                            )
                          }
                          disabled={
                            !diagnosis.insurance_file_path ||
                            openingFile === "4대보험 자료"
                          }
                          className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          {openingFile === "4대보험 자료" ? "여는 중..." : "파일 보기"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {(() => {
              const diagnosis = getDiagnosis(selectedMember.id);

              if (!diagnosis) {
                return null;
              }

              return (
                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      AI 1차 진단 / 전문가 검토
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      현재는 API 자동화 전 단계입니다. AI 분석 결과를 여기에 입력하고 대표님 검토 내용을 함께 저장합니다.
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700">
                      AI 1차 진단
                    </label>
                    <textarea
                      value={aiDraft}
                      onChange={(e) => setAiDraft(e.target.value)}
                      rows={14}
                      placeholder="기업 기본정보와 제출자료를 분석한 1차 진단 내용을 입력하세요."
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-4 text-sm leading-6 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700">
                      전문가 검토 메모
                    </label>
                    <textarea
                      value={expertMemo}
                      onChange={(e) => setExpertMemo(e.target.value)}
                      rows={8}
                      placeholder="정책자금 외 세무·재무·법인관리·고용·보험 등 추가 검토사항을 입력하세요."
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-4 text-sm leading-6 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveDiagnosisDraft}
                      disabled={savingDiagnosis}
                      className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      {savingDiagnosis ? "저장 중..." : "진단 초안 저장"}
                    </button>
                  </div>
                </div>
              );
            })()}
          </section>
        )}
      </div>
    </main>
  );
}