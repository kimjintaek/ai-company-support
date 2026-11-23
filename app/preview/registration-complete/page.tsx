import Link from "next/link";

// Preview only: mirrors the post-registration confirmation screen without creating an account.
export default function RegistrationCompletePreviewPage() {
  return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">무료 기업정보 등록 완료</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">무료 기업등록이 완료되었습니다.</h1>
            <p className="mt-4 leading-7 text-gray-600">
              등록하신 기업정보와 문의 내용이 정상적으로 접수되었습니다.
              고객 로그인 후 등록된 계정을 이용하실 수 있습니다.
            </p>
            <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700">
              고객 로그인
            </Link>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">다온지원센터의 차별점</p>
            <h2 className="mt-2 text-2xl font-bold leading-snug text-gray-900">
              정책자금, 우리 기업에 맞는 신청 시기가 중요합니다.
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              정책자금은 업종·지역뿐 아니라 청년기업 여부, 여성기업·장애인기업·벤처기업 등 보유 인증,
              인력 증가, 매출 감소와 같은 기업별 상황에 따라 신청요건과 우대조건이 달라질 수 있습니다.
              다온지원센터는 이러한 조건을 공고별로 비교해 기업에 맞는 운전자금 검토 방향을 안내합니다.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              유료 이용권 활성화 후 필요한 기업자료를 미리 제출하시면, 결제일부터 1년의 이용기간 동안
              확인 가능한 운전자금 공고 일정과 기업별 요건에 맞춰 신청 준비사항과 신청 가이드를 안내합니다.
              공고 일정과 지원조건은 기관 사정에 따라 변경될 수 있으며, 신청 및 최종 제출은 사업자가 직접 진행합니다.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 sm:p-7">
              <p className="text-center text-sm font-bold text-blue-700">기업별 맞춤 검토 · 신청 시기별 준비 안내</p>
              <p className="mt-2 text-center text-xs leading-6 text-gray-600">기업의 조건과 공고 일정을 함께 살펴 신청 준비 방향을 안내합니다.</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-blue-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h2m2 0h2M9 14h2m2 0h2M10 21v-4h4v4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="mt-3 font-bold text-gray-900">01. 기업별 조건</p>
                  <p className="mt-2 text-xs leading-5 text-gray-600">업종·지역·보유 인증<br />매출 및 고용 변화</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h3m3 0h3" strokeLinecap="round"/></svg>
                  </div>
                  <p className="mt-3 font-bold text-gray-900">02. 공고 시기 검토</p>
                  <p className="mt-2 text-xs leading-5 text-gray-600">사전 제출자료 확인<br />신청요건·우대조건 비교</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7"><path d="M8 4h8l3 3v14H5V4h3m8 0v4h3M9 12l2 2 4-4M9 18h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="mt-3 font-bold text-gray-900">03. 신청 가이드</p>
                  <p className="mt-2 text-xs leading-5 text-gray-600">준비서류·신청 절차<br />기업별 준비사항 안내</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-blue-900 px-4 py-4 text-center text-sm font-semibold leading-6 text-white">
                결제일부터 1년 · 운전자금 추가 매칭 및 신청 준비 안내
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900">기업별 조건 검토</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">기업자료와 보유 인증, 매출·고용 변동 등을 함께 확인해 해당 공고의 요건과 우대조건을 검토합니다.</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900">신청 시기·우대조건</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">자료를 미리 제출해 주시면 제공된 정보와 공고 일정에 맞춰 신청 시기, 준비서류 및 신청 가이드를 안내합니다.</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900">AI 분석 + 전문가 검토</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">유료 진단에서 AI 분석 결과를 전문가가 확인합니다.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">선택형 유료 서비스</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">운전자금 AI 진단 · 1년 이용권</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900">49,000원 <span className="text-base font-normal text-gray-600">+ 부가세 4,900원 (총 53,900원)</span></p>
            <p className="mt-2 font-semibold text-blue-700">선정 후 추가 성공보수 없음</p>
            <p className="mt-3 text-sm text-gray-600">이용기간은 결제일부터 1년입니다.</p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-gray-700">
              <li>기업별 운전자금 진단 및 매칭</li>
              <li>공고별 신청요건과 우대조건 안내</li>
              <li>AI 분석 및 전문가 검토</li>
              <li>신청 준비자료와 절차 안내</li>
              <li>자료 사전 제출 시 공고 시기에 맞춘 준비사항 및 신청 가이드 안내</li>
              <li>이용기간 내 추가 운전자금 매칭</li>
            </ul>
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">전문 컨설팅은 별도로 제공합니다.</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                여성기업·장애인기업·벤처기업 등 기업 인증 취득 지원,
                시설자금, R&amp;D 및 기타 경영컨설팅은 기본 이용권에 포함되지 않습니다.
              </p>
            </div>
            <p className="mt-5 text-xs leading-6 text-gray-500">
              정책자금 선정이나 대출 실행을 보장하지 않으며, 실제 신청과 최종 제출은 사업자가 직접 진행합니다.
              유료 서비스 결제 안내는 고객 로그인 후 확인할 수 있습니다.
            </p>
            <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
              운전자금 진단 이용 안내 · 고객 로그인
            </Link>
            <Link href="/policy-fund" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              전문 컨설팅 상세 보기
            </Link>
          </section>
        </div>
      </main>
  );
}
