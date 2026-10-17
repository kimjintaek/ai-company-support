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
  business_registration_file_path: string | null;
  ai_draft: string | null;
  expert_memo: string | null;
  sent_at: string | null;
  created_at: string;
};

const AI_DIAGNOSIS_PROMPT = "# 기업지원사업 AI 진단보고서 작성 지시문\n\n당신은 중소기업 재무·경영 자료를 검토하는 분석 보조자입니다. 첨부된 사업자등록증, 재무제표, 4대 사회보험 사업장 가입자 명부를 바탕으로 아래 양식에 맞춰 진단보고서 초안을 작성하세요.\n\n## 필수 원칙\n1. 문서에 실제로 기재된 사실과 계산으로 확인되는 수치만 사용하세요.\n2. 자료에 없거나 확인할 수 없는 정보는 추측하지 말고 “자료상 확인 불가” 또는 “추가 확인 필요”라고 표시하세요.\n3. 재무제표의 단위, 기준연도, 계정과목을 확인하고 수치 간 모순이 있으면 지적하세요. 근거 없이 수치를 보정하지 마세요.\n4. 사업자등록증의 업태·종목을 그대로 확인하고, 업종 분류나 제조업 해당 여부를 임의로 단정하지 마세요.\n5. 4대 사회보험 사업장 가입자 명부는 발급일 현재 확인되는 가입자 기준으로 분석하세요. 과거 입·퇴사 이력을 추정하지 마세요.\n6. 정책자금의 승인 가능성, 지원금액, 자격 충족을 보장하지 마세요. 최신 공고나 공식 기준을 제공받지 않았다면 구체적인 제도명·한도·마감일을 만들어내지 말고 “공식 공고 확인 필요”라고 표시하세요.\n7. 정책자금·지원사업의 최종 매칭과 전문가 코멘트는 담당자가 직접 작성할 예정입니다. 이 부분은 임의로 확정하지 말고 검토에 필요한 기업 특성, 확인 질문, 잠재적 위험만 정리하세요.\n8. 보고서 첫머리는 반드시 핵심 결론 3줄로 시작하세요. 객관적이고 이해하기 쉬운 존댓말로 작성하세요.\n9. 개인정보와 기업 기밀을 불필요하게 반복하지 말고, 보고서 목적에 필요한 정보만 기재하세요.\n\n## 보고서 출력 양식\n\n# 기업지원사업 AI 1차 진단보고서\n\n## 종합판단 — 결론 3줄\n1. 기업 현황 및 진단 요약:\n2. 주요 재무·고용 위험 또는 강점:\n3. 우선 확인할 사항:\n\n## 1. 기업 기본현황\n- 기업명:\n- 사업자등록증상 업태·종목:\n- 사업장 소재지:\n- 사업자등록증에서 확인되는 개업일:\n- 자료 확인 기준일:\n- 자료상 확인되지 않는 항목:\n\n## 2. 재무제표 분석\n- 분석 대상 회계연도 및 자료 종류:\n- 매출액 및 매출 추이:\n- 영업이익·당기순이익 등 수익성:\n- 자산·부채·자본 현황:\n- 차입금 및 재무 부담(자료에 있는 경우):\n- 현금흐름 관련 확인사항(자료로 확인 가능한 범위):\n- 전년 대비 주요 변화:\n- 재무상 강점:\n- 위험요인 및 추가 확인사항:\n- 각 판단의 근거가 되는 수치와 해당 연도:\n\n## 3. 고용 현황 분석\n- 가입자 명부 발급일:\n- 현재 명부에서 확인되는 가입자 수:\n- 사업자 자료와 비교 시 확인할 사항:\n- 고용 관련 강점·위험 및 추가 확인사항:\n- 자료만으로 판단할 수 없는 사항:\n\n## 4. 세무·법인관리 점검사항\n- 제출자료에서 확인되는 점검 필요 항목:\n- 추가로 확인해야 할 자료 또는 질문:\n- 자료만으로 판단할 수 없는 사항:\n\n## 5. 기업지원사업 검토를 위한 기초정보\n- 기업의 업종·지역·업력·매출·고용 관련 확인 사실:\n- 자금 용도나 경영 애로 중 추가로 확인할 질문:\n- 지원사업 검토 시 유의할 위험요인:\n- 공식 공고 및 자격요건 확인이 필요한 항목:\n\n## 6. 정책자금 매칭 — 담당자 작성란\n아래 항목은 비워 두고 임의로 특정 정책자금을 추천하거나 자격 충족을 확정하지 마세요.\n- 매칭 정책자금·지원사업:\n- 매칭 근거:\n- 신청 요건 확인 결과:\n- 담당자 코멘트:\n- 보완자료 및 실행 순서:\n\n## 7. 최종 권고\n- 우선 확인할 사항:\n- 추가로 요청할 자료:\n- 담당자가 결정해야 할 사항:\n\n## 8. 자료 한계 및 검증 목록\n분석에 사용한 각 문서, 기준연도·발급일, 확인하지 못한 정보, 수치 간 불일치, 공식 출처로 추가 검증해야 할 내용을 목록으로 정리하세요.\n\n보고서는 위 목차와 순서를 유지하세요. 제출자료에서 확인되는 사실과 분석자의 해석을 구분하고, 근거 없는 긍정·부정 평가나 승인 가능성 예측은 하지 마세요.";

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
          "id, member_id, business_registration_file_path, financial_file_path, insurance_file_path, ai_draft, expert_memo, sent_at, created_at"
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

  const handleCopyAiPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_DIAGNOSIS_PROMPT);
      alert("AI 진단보고서 지시문을 복사했습니다. ChatGPT 또는 Claude에 붙여넣고 기업 서류 3종을 첨부하세요.");
    } catch {
      alert("자동 복사에 실패했습니다. 관리자 화면에서 제공하는 표준 지시문 파일을 열어 복사해 주세요.");
    }
  };

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

  const handlePublishDiagnosis = async () => {
    if (!selectedMember) return;
    const diagnosis = getDiagnosis(selectedMember.id);
    if (!diagnosis) {
      alert("진단자료가 없습니다.");
      return;
    }
    if (!aiDraft.trim()) {
      alert("최종 진단서 내용을 먼저 작성해주세요.");
      return;
    }
    const confirmed = window.confirm(
      "최종 진단서를 고객에게 공개하시겠습니까? 공개 후 고객의 진단결과 화면에 표시됩니다."
    );
    if (!confirmed) return;

    setSavingDiagnosis(true);
    setErrorMessage("");
    const publishedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("diagnoses")
      .update({
        ai_draft: aiDraft,
        expert_memo: expertMemo || null,
        sent_at: publishedAt,
        updated_at: publishedAt,
      })
      .eq("id", diagnosis.id)
      .select()
      .single();

    if (error) {
      setErrorMessage("최종 진단서 공개 오류: " + error.message);
      setSavingDiagnosis(false);
      return;
    }

    setDiagnoses((current) =>
      current.map((item) => (item.id === diagnosis.id ? data : item))
    );
    setSavingDiagnosis(false);
    alert("최종 진단서가 고객에게 공개되었습니다.");
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
                        <p className="text-xs text-gray-500">사업자등록증</p>
                        <p className="mt-1 font-medium text-gray-900">
                          {diagnosis.business_registration_file_path ? "제출완료" : "미제출"}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openDiagnosisFile(
                              diagnosis.business_registration_file_path,
                              "사업자등록증"
                            )
                          }
                          disabled={
                            !diagnosis.business_registration_file_path ||
                            openingFile === "사업자등록증"
                          }
                          className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          {openingFile === "사업자등록증" ? "여는 중..." : "파일 보기"}
                        </button>
                      </div>
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
                      기업 서류 3종을 ChatGPT 또는 Claude에 직접 첨부해 초안을 작성한 뒤, 정책자금 매칭과 전문가 코멘트를 보완하세요. 유료 API는 사용하지 않습니다.
                    </p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleCopyAiPrompt}
                        className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        AI 진단보고서 지시문 복사
                      </button>
                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        복사한 지시문을 AI 대화창에 붙여넣고 사업자등록증·재무제표·4대 사회보험 사업장 가입자 명부를 첨부하세요. 생성된 초안을 검토한 뒤 아래 입력란에 붙여넣으세요.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-700">
                      AI 1차 진단
                    </label>
                    <textarea
                      value={aiDraft}
                      onChange={(e) => setAiDraft(e.target.value)}
                      rows={18}
                      placeholder={"[종합판단 - 결론 3줄]\n1. 정책자금:\n2. 핵심 위험요인:\n3. 향후 우선과제:\n\n[1. 기업 기본현황]\n\n[2. 정책자금 진단]\n- 검토 결과:\n- 판단 근거:\n- 위험요인:\n- 준비사항:\n\n[3. 재무상태 분석]\n\n[4. 세무·법인관리 체크포인트]\n\n[5. 고용·지원사업 검토]\n\n[6. 추가 발견사항]\n\n[7. 최종 권고]"}
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

                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleSaveDiagnosisDraft}
                      disabled={savingDiagnosis}
                      className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:bg-gray-300"
                    >
                      {savingDiagnosis ? "처리 중..." : "진단 초안 저장"}
                    </button>
                    <button
                      type="button"
                      onClick={handlePublishDiagnosis}
                      disabled={savingDiagnosis || !aiDraft.trim()}
                      className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-300"
                    >
                      {diagnosis.sent_at ? "최종 진단서 다시 공개" : "최종 진단서 확정 및 고객 공개"}
                    </button>
                  </div>
                  <p className="mt-3 text-right text-xs text-gray-500">
                    공개 상태: {diagnosis.sent_at ? "고객 공개 중" : "비공개 초안"}
                  </p>
                </div>
              );
            })()}
          </section>
        )}
      </div>
    </main>
  );
}