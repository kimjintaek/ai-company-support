import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소상공인 AI 경영·마케팅 컨설팅 | (주)다온지원센터",
  description:
    "소상공인의 점포 운영, 고용지원금, 절세 검토, 상권 분석과 온라인 마케팅 실행 방향을 상담합니다.",
};

const diagnosisAreas = [
  {
    number: "01",
    title: "점포·경영 현황",
    description: "업종, 매장 운영 형태, 주요 고객, 현재 고민과 목표를 정리합니다.",
  },
  {
    number: "02",
    title: "고용지원 제도",
    description: "직원 고용 현황과 채용 계획을 바탕으로 검토할 수 있는 지원제도를 살펴봅니다.",
  },
  {
    number: "03",
    title: "절세·경영관리",
    description: "사업 운영과 관련해 확인할 세무·비용 관리 항목을 정리하고 필요한 경우 전문 자격자와 연계합니다.",
  },
  {
    number: "04",
    title: "상권·경쟁 환경",
    description: "주변 경쟁 점포, 고객층, 점포의 강점과 개선할 부분을 검토합니다.",
  },
  {
    number: "05",
    title: "온라인 홍보 진단",
    description: "네이버 플레이스, 블로그, SNS 등 현재 온라인 노출과 홍보 상태를 살펴봅니다.",
  },
  {
    number: "06",
    title: "마케팅 실행 방향",
    description: "콘텐츠 주제, 숏폼·블로그 활용, 이벤트와 홍보 실행 우선순위를 제안합니다.",
  },
];

const process = [
  {
    number: "01",
    title: "상담 신청",
    description: "점포 기본정보와 현재 가장 해결하고 싶은 문제를 알려주세요.",
  },
  {
    number: "02",
    title: "현황 확인",
    description: "업종과 점포 상황, 고용·홍보 현황 등 필요한 내용을 확인합니다.",
  },
  {
    number: "03",
    title: "진단 및 방향 제안",
    description: "AI 활용 분석과 전문가 검토를 통해 점포에 필요한 지원·개선 방향을 정리합니다.",
  },
  {
    number: "04",
    title: "실행 범위 협의",
    description: "상담만 진행할지, 콘텐츠 제작이나 광고 운영까지 맡길지 범위와 비용을 협의합니다.",
  },
];

export default function SmallBusinessMarketingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/policy-fund" className="text-lg font-extrabold tracking-tight">
            다온지원센터
          </a>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <a href="/policy-fund" className="text-slate-600 transition hover:text-blue-700">
              기업지원사업 진단
            </a>
            <a href="/login" className="text-slate-600 transition hover:text-blue-700">
              고객 로그인
            </a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/40 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              소상공인 경영지원 · 마케팅 컨설팅
            </p>
            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              가게 운영의 고민,
              <br />
              <span className="text-emerald-300">진단부터 실행 방향까지</span>
              <br />
              함께 점검합니다.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              고용지원금, 절세 검토, 상권과 경쟁 점포 분석, 온라인 홍보까지.
              소상공인 사업장의 현재 상황을 확인하고 필요한 경영·마케팅 지원 방향을 제안합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/15 px-3 py-2">점포별 현황 진단</span>
              <span className="rounded-full border border-white/15 px-3 py-2">AI 활용 분석</span>
              <span className="rounded-full border border-white/15 px-3 py-2">전문가 검토</span>
              <span className="rounded-full border border-white/15 px-3 py-2">실행 범위별 비용 협의</span>
            </div>
            <a
              href="https://pf.kakao.com/_QxnGmX/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-7 py-4 text-base font-bold text-slate-900 transition hover:bg-yellow-300 sm:w-auto"
            >
              소상공인 상담 신청하기 <span className="ml-3" aria-hidden="true">→</span>
            </a>
            <p className="mt-3 text-xs leading-6 text-slate-400">
              상담 신청 후 점포 상황과 요청 범위를 확인해 진단·컨설팅 진행 방법과 비용을 안내합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Business Check</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              점포 운영에서 무엇이 막혀 있는지부터 확인합니다.
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              모든 가게에 같은 마케팅 방법을 적용하지 않습니다. 업종과 상권, 고객층,
              고용 상황과 현재 홍보 수준을 확인한 뒤 필요한 항목부터 검토합니다.
            </p>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-slate-100 shadow-lg">
            <img
              src="/images/small-business-owner.jpg"
              alt="태블릿으로 매장 운영 현황을 확인하는 소상공인 점주"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="bg-white px-4 py-3 text-xs text-slate-500">점포마다 다른 운영 환경부터 살펴봅니다.</figcaption>
          </figure>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diagnosisAreas.map((item) => (
            <article key={item.number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-emerald-700">{item.number}</p>
              <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">How It Works</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">상담부터 실행까지</h2>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <article key={item.number} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-extrabold text-emerald-700">{item.number}</p>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Consulting Options</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              필요한 서비스만 선택할 수 있습니다.
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              기본 상담 이후 실제로 필요한 업무 범위를 정합니다. 단순 진단과 실행 대행은
              구분하며, 콘텐츠 제작이나 광고 운영을 요청하시는 경우 별도 견적과 계약으로 진행합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold">서비스 범위 예시</h3>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <li className="flex gap-3"><span className="font-bold text-emerald-700">✓</span><span>점포 현황 및 상권·경쟁 환경 진단</span></li>
              <li className="flex gap-3"><span className="font-bold text-emerald-700">✓</span><span>고용지원 제도와 경영지원 항목 검토</span></li>
              <li className="flex gap-3"><span className="font-bold text-emerald-700">✓</span><span>네이버 플레이스·블로그·SNS 홍보 방향 제안</span></li>
              <li className="flex gap-3"><span className="font-bold text-emerald-700">✓</span><span>숏폼·홍보 콘텐츠 기획 및 제작 협의</span></li>
              <li className="flex gap-3"><span className="font-bold text-emerald-700">✓</span><span>광고 세팅·운영 및 월간 관리 협의</span></li>
            </ul>
            <a
              href="https://pf.kakao.com/_QxnGmX/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 block rounded-xl bg-slate-900 px-5 py-4 text-center font-bold text-white transition hover:bg-slate-700"
            >
              필요한 서비스 상담하기
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs leading-6 text-slate-500">
          ※ 이 페이지는 소상공인 경영·마케팅 상담 신청 안내입니다. 실제 제공 범위와 비용은 상담 후 별도 협의하며,
          지원금 선정·매출 증가·광고 성과를 보장하지 않습니다. 세무신고 대리 등 법정 자격이 필요한 업무는 해당 자격을 갖춘 전문가의 업무 범위에서 진행합니다.
        </p>
      </section>

      <section className="bg-emerald-800 text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            우리 가게에 필요한 지원부터
            <br className="sm:hidden" /> 함께 확인해 보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-emerald-100">
            점포 운영과 마케팅 현황을 듣고 필요한 진단 및 실행 범위를 안내합니다.
          </p>
          <a
            href="https://pf.kakao.com/_QxnGmX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-7 py-4 font-bold text-slate-900 transition hover:bg-yellow-300 sm:w-auto"
          >
            카카오톡 상담 신청하기 →
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-8 text-center text-xs leading-6 text-slate-500">
        <p className="font-semibold text-slate-700">(주)다온지원센터</p>
        <p className="mt-1">소상공인 경영·마케팅 컨설팅은 상담 후 업무 범위와 비용을 별도로 협의합니다.</p>
        <p className="mt-3"><a href="/policy-fund" className="underline underline-offset-2">기업지원사업 AI 진단으로 돌아가기</a></p>
        <p className="mt-2">© 다온지원센터. All rights reserved.</p>
      </footer>
    </main>
  );
}
