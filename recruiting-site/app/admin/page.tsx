"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "로그인하지 못했습니다.");
        return;
      }

      window.location.assign("/admin/inquiries");
    } catch {
      setMessage("로그인 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <div className="admin-brand-mark">D</div>
        <p className="admin-eyebrow">DAON PARTNERS · PRIVATE</p>
        <h1>관리자 로그인</h1>
        <p className="admin-auth-description">파트너 상담 신청 내역을 확인하는 관리자 전용 화면입니다.</p>

        <label htmlFor="admin-username">관리자 아이디</label>
        <input
          id="admin-username"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label htmlFor="admin-password">비밀번호</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "확인 중..." : "로그인"}
        </button>
        {message && <p className="admin-auth-message" role="alert">{message}</p>}
        <a className="admin-back-link" href="/">← 모집 사이트로 돌아가기</a>
      </form>
    </main>
  );
}
