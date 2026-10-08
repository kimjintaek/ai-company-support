"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadResult = async () => {
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
        setMessage(memberError?.message || "회원정보를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      const { data: diagnosis, error: diagnosisError } = await supabase
        .from("diagnoses")
        .select("ai_draft")
        .eq("member_id", member.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (diagnosisError) {
        setMessage("진단결과 조회 중 오류가 발생했습니다.\n\n" + diagnosisError.message);
        setLoading(false);
        return;
      }

      const result = diagnosis?.ai_draft?.trim() ?? "";
      setDraft(result);
      setHasResult(Boolean(result));
      setLoading(false);
    };

    loadResult();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          진단결과를 확인하는 중입니다...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">진단결과</h1>
          <p className="mt-3 text-gray-600">
            제출자료를 바탕으로 작성된 1차 진단 결과입니다.
          </p>
        </div>

        {hasResult ? (
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="whitespace-pre-wrap leading-8 text-gray-800">
              {draft}
            </div>
            <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
              본 결과는 제출자료를 바탕으로 한 1차 검토 내용이며, 최종 지원 가능 여부는
              관련 기관의 심사 및 추가 확인자료에 따라 달라질 수 있습니다.
            </div>
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              아직 진단결과가 준비되지 않았습니다.
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              자료 제출 후 관리자 검토가 완료되면 진단결과를 확인할 수 있습니다.
            </p>
          </section>
        )}

        {message && (
          <div className="mt-6 whitespace-pre-line rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {message}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => router.push("/documents")}
            className="rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            자료 제출 화면
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </main>
  );
}
