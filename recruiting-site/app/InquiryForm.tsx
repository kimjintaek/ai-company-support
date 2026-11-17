"use client";

import { FormEvent, useState } from "react";

type FormValues = {
  name: string;
  phone: string;
  insurance_company: string;
  experience: string;
  desired_support: string;
  privacy_consent: boolean;
};

const initialValues: FormValues = {
  name: "",
  phone: "",
  insurance_company: "",
  experience: "",
  desired_support: "",
  privacy_consent: false,
};

export default function InquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/recruitment-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "접수 중 오류가 발생했습니다.");
      }

      setValues(initialValues);
      setMessage("상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="inquiry-grid">
        <div className="inquiry-field">
          <label htmlFor="inquiry-name">이름 *</label>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={50}
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </div>
        <div className="inquiry-field">
          <label htmlFor="inquiry-phone">연락처 *</label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="010-0000-0000"
            required
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>
        <div className="inquiry-field inquiry-field-full">
          <label htmlFor="inquiry-company">현재 소속 보험회사 및 조직 *</label>
          <input
            id="inquiry-company"
            name="insurance_company"
            maxLength={100}
            required
            placeholder="보험회사 / 지점 또는 GA 조직"
            value={values.insurance_company}
            onChange={(event) => update("insurance_company", event.target.value)}
          />
        </div>
        <div className="inquiry-field inquiry-field-full">
          <label htmlFor="inquiry-experience">보험영업 경력</label>
          <select
            id="inquiry-experience"
            name="experience"
            value={values.experience}
            onChange={(event) => update("experience", event.target.value)}
          >
            <option value="">선택해 주세요</option>
            <option value="1년 미만">1년 미만</option>
            <option value="1~3년">1~3년</option>
            <option value="3~5년">3~5년</option>
            <option value="5~10년">5~10년</option>
            <option value="10년 이상">10년 이상</option>
          </select>
        </div>
        <div className="inquiry-field inquiry-field-full">
          <label htmlFor="inquiry-support">참여 희망 내용 (선택)</label>
          <textarea
            id="inquiry-support"
            name="desired_support"
            maxLength={1000}
            placeholder="기업영업 지원과 관련해 궁금한 내용을 적어주세요."
            value={values.desired_support}
            onChange={(event) => update("desired_support", event.target.value)}
          />
        </div>
      </div>

      <label className="inquiry-consent">
        <input
          type="checkbox"
          checked={values.privacy_consent}
          onChange={(event) => update("privacy_consent", event.target.checked)}
          required
        />
        <span>
          개인정보 수집·이용에 동의합니다. (필수)
          <br />
          수집 항목: 이름, 연락처, 소속 보험회사·조직, 보험영업 경력, 참여 희망 내용
          <br />
          이용 목적: 파트너 모집 상담 및 신청자 연락
        </span>
      </label>
      <p className="inquiry-note">
        동의를 거부할 수 있으며, 필수 동의 거부 시 상담 신청이 제한됩니다.
        개인정보 보유·이용 기간은 별도 개인정보 처리 안내에서 확인할 수 있도록 운영자가 고지해야 합니다.
      </p>

      <button className="inquiry-submit" type="submit" disabled={submitting}>
        {submitting ? "접수 중..." : "파트너 상담 신청"}
      </button>
      {message && (
        <p className={`inquiry-message ${isError ? "error" : "success"}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
