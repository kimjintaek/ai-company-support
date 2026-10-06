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

export default function AdminPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
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

      const { data, error } = await supabase
        .from("members")
        .select(
          "id, name, business_name, phone, email, industry, region, business_type, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("members 오류:", error);
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setMembers(data ?? []);
      setLoading(false);
    };

    loadMembers();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
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
              <table className="w-full min-w-[1000px] text-sm">
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
                      신청일
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
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
                        {new Date(member.created_at).toLocaleString(
                          "ko-KR"
                        )}
                      </td>
                    </tr>
                  ))}
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
          </section>
        )}
      </div>
    </main>
  );
}
