"use client";

import { useCallback, useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  insurance_company: string;
  experience: string | null;
  desired_support: string | null;
  status: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/inquiries", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.status === 401) {
        window.location.replace("/admin");
        return;
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "신청 내역을 불러오지 못했습니다.");
      }

      setInquiries(Array.isArray(result.inquiries) ? result.inquiries : []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    window.location.replace("/admin");
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <a href="/" className="admin-dashboard-brand"><span>D</span> DAON PARTNERS</a>
        <div className="admin-header-actions">
          <span>관리자</span>
          <button type="button" onClick={logout}>로그아웃</button>
        </div>
      </header>

      <section className="admin-dashboard-content">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">PARTNER RECRUITMENT</p>
            <h1>상담 신청 내역</h1>
            <p>접수된 파트너 모집 상담 신청을 최신순으로 표시합니다.</p>
          </div>
          <button type="button" className="admin-refresh-button" onClick={loadInquiries} disabled={loading}>
            {loading ? "불러오는 중..." : "새로고침"}
          </button>
        </div>

        <div className="admin-summary-card">
          <span>전체 접수</span>
          <strong>{inquiries.length}</strong>
          <small>최근 접수 순 · 최대 200건 표시</small>
        </div>

        {error && <p className="admin-list-error" role="alert">{error}</p>}
        {loading ? (
          <div className="admin-empty-state">신청 내역을 불러오는 중입니다.</div>
        ) : inquiries.length === 0 ? (
          <div className="admin-empty-state">접수된 신청 내역이 없습니다.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-inquiry-table">
              <thead>
                <tr>
                  <th>접수일시</th>
                  <th>신청자</th>
                  <th>연락처</th>
                  <th>소속 보험회사·조직</th>
                  <th>영업 경력</th>
                  <th>희망 내용</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="admin-date-cell">{formatDate(inquiry.created_at)}</td>
                    <td><strong>{inquiry.name}</strong></td>
                    <td><a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a></td>
                    <td>{inquiry.insurance_company}</td>
                    <td>{inquiry.experience || "미입력"}</td>
                    <td className="admin-desired-cell">{inquiry.desired_support || "미입력"}</td>
                    <td><span className="admin-status">{inquiry.status || "신규"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
