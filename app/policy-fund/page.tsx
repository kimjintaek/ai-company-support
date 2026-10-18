import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기업지원사업 진단 연간 이용권 | (주)다온지원센터",
  description: "기업 기본정보와 제출자료를 바탕으로 기업지원사업을 1차 분석하고 전문가가 검토하는 12개월 이용 서비스입니다.",
};

const steps = [
  { number: "01", title: "신청 및 결제", description: "기업 기본정보를 등록하고 연간 이용료를 결제합니다." },
  { number: "02", title: "기업자료 제출", description: "사업자등록증과 보유 중인 재무·고용 관련 자료를 제출합니다." },
  { number: "03", title: "전문가 검토", description: "AI로 1차 정리한 내용을 전문가가 검토하고 보완합니다." },
  { number: "04", title: "진단보고서 제공", description: "정책자금 검토 방향과 신청 전 확인할 사항을 보고서로 안내합니다." },
];

const included = [
  "기업 기본정보 및 제출자료 검토",
  "정책자금 검토 방향과 확인사항 정리",
  "신청 전 보완할 부분에 대한 안내",
  "진단보고서 작성 및 전문가 검토·수정",
  "보고서 내용에 관한 후속 전화·카카오톡 상담",
];

const notIncluded = [
  "정책자금 승인 또는 대출 실행 보장",
  "정책자금 외 세무·인증·R&D 등 별도 컨설팅",
  "기관 제출 및 신청 업무의 대행",
];

export default function PolicyFundLandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/policy-fund" className="text-lg font-extrabold tracking-tight">
            다온지원센터
          </a>
          <a href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-700">
            기존 고객 로그인
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-800/50 via-slate-950 to-slate-950" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
              정책자금 신청 전, 기업 상황부터 점검하세요
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              우리 회사에 맞는
              <br />
              <span className="text-blue-300">정책자금 검토 방향</span>을
              <br />
              먼저 확인하십시오.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              기업 기본정보와 제출자료를 바탕으로 검토할 사항과 신청 전 보완할 부분을 분석합니다.
              AI가 정리한 초안을 전문가가 직접 검토·수정해 진단보고서로 제공합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/15 px-3 py-2">전문가 검토</span>
              <span className="rounded-full border border-white/15 px-3 py-2">보고서 제공</span>
              <span className="rounded-full border border-white/15 px-3 py-2">보고서 관련 후속 상담 포함</span>
            </div>
            <a
              href="/diagnosis"
              className="mt-9 inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 sm:w-auto"
            >
              정책자금 진단 신청하기 <span className="ml-3" aria-hidden="true">→</span>
            </a>
            <p className="mt-3 text-xs leading-6 text-slate-400">
              진단 결과는 기업 상황과 제출자료를 기준으로 한 검토 의견이며, 정책자금 승인 여부를 보장하지 않습니다.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur sm:p-8">
            <p className="text-sm font-semibold text-blue-200">기업지원사업 진단 연간 이용권</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-black tracking-tight">49,000원</span>
              <span className="pb-1 text-sm text-slate-300">/ 연간 이용료</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">부가세 별도 · 이용기간 12개월 · 결제금액 53,900원</p>
            <div className="my-6 h-px bg-white/10" />
            <ul className="space-y-4">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-400/20 text-xs font-bold text-blue-200">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="/diagnosis" className="mt-8 block rounded-xl bg-white px-5 py-3.5 text-center font-bold text-slate-900 transition hover:bg-blue-50">
              신청 절차 시작하기
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Why diagnosis first</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            신청부터 서두르기보다,
            <br className="hidden sm:block" /> 먼저 확인해야 할 것이 있습니다.
          </h2>
          <p className="mt-5 leading-7 text-slate-600">
            정책자금은 기업의 업력, 업종, 매출, 재무상태, 고용 현황과 자금 목적 등에 따라 검토 방향이 달라질 수 있습니다.
            한 가지 기준만으로 가능 여부를 단정하기보다 기업자료를 함께 살펴보는 것이 중요합니다.
          </p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {[
            { n: "01", title: "기업 상황 확인", body: "기업 기본정보와 제출자료를 바탕으로 검토에 필요한 사항을 정리합니다." },
            { n: "02", title: "검토 방향 정리", body: "확인할 정책자금 유형과 신청 전에 점검할 항목을 보고서에 담습니다." },
            { n: "03", title: "전문가 검토", body: "AI 초안을 그대로 전달하지 않고 전문가가 검토·수정한 뒤 제공합니다." },
          ].map((item) => (
            <article key={item.n} className="rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-bold text-blue-700">{item.n}</p>
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Process</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">진행 절차</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-extrabold text-blue-700">{step.number}</p>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="text-lg font-bold">준비 가능한 자료</h3>
            <p className="mt-3 leading-7 text-slate-600">
              사업자등록증, 재무제표, 4대 사회보험 관련 자료 등 보유 자료를 안내에 따라 제출합니다.
              자료의 종류와 추가 확인사항은 기업 상황에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Included</p>
          <h2 className="mt-3 text-2xl font-extrabold">연간 이용료에 포함되는 서비스</h2>
          <ul className="mt-6 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-slate-700">
                <span className="font-bold text-blue-700">✓</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Scope</p>
          <h2 className="mt-3 text-2xl font-extrabold">서비스 범위 안내</h2>
          <ul className="mt-6 space-y-3">
            {notIncluded.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-slate-600">
                <span className="font-bold text-slate-400">—</span><span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-slate-500">
            본 이용권은 정책자금 검토 방향과 신청 전 확인사항을 안내하는 진단 서비스입니다.
            별도 컨설팅은 업무 범위와 비용을 안내한 후 진행 여부를 결정합니다.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Additional support</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              정책자금 진단 후, 기업에 필요한 지원도 함께 검토합니다.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              진단 과정에서 추가적인 경영 개선이나 정부지원사업 검토 필요성이 확인되면,
              기업 상황에 맞는 별도 컨설팅을 안내할 수 있습니다. 모든 서비스가 모든 기업에 해당하는 것은 아니며,
              필요성과 제공 가능 범위를 확인한 뒤 안내합니다.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "세무·법인전환", body: "세무 검토, 절세 방안 검토, 법인전환 및 재무구조 개선" },
              { title: "기업인증", body: "여성·장애인기업, 벤처기업, 기업부설연구소, 이노비즈·메인비즈" },
              { title: "R&D·정부지원사업", body: "연구개발 과제, 사업화 지원 및 관련 지원사업 검토" },
              { title: "고용지원", body: "고용지원금 및 인력 운영 관련 제도 검토" },
              { title: "시설자금·투자", body: "시설투자 계획과 시설자금 검토 — 별도 컨설팅" },
              { title: "기업 운영 서비스", body: "기업보험, 통신·인터넷 등 기업 운영에 필요한 서비스 안내" },
            ].map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500">
            ※ 위 분야는 별도 컨설팅 또는 서비스 안내 항목이며 연간 이용권에 포함되지 않습니다.
            업무 범위와 비용을 먼저 안내하며, 정책자금 승인이나 지원사업 선정 결과를 보장하지 않습니다.
          </p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            정책자금 신청 전,
            <br className="sm:hidden" /> 우리 회사 자료부터 점검하세요.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            진단보고서와 보고서 내용에 관한 후속 상담까지 한 번의 진단 서비스에 포함됩니다.
          </p>
          <a href="/diagnosis" className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white px-7 py-4 font-bold text-blue-800 transition hover:bg-blue-50 sm:w-auto">
            정책자금 진단 신청하기 →
          </a>
          <p className="mt-4 text-xs text-blue-100">연간 이용료 49,000원 + 부가세 · 이용기간 12개월 · 승인 보장 상품이 아닙니다.</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-8 text-center text-xs leading-6 text-slate-500">
        <p className="font-semibold text-slate-700">(주)다온지원센터</p>
        <p className="mt-1">정책자금 진단은 제출자료에 기반한 검토 서비스이며, 최종 지원 여부와 조건은 해당 기관의 심사에 따라 결정됩니다.</p>
        <p className="mt-3">© 다온지원센터. All rights reserved.</p>
      </footer>
    </main>
  );
}
