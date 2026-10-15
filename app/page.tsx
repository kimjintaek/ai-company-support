export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          기업지원사업 AI 진단 플랫폼
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          내 회사 지원사업
          <span className="mt-4 block text-blue-600 sm:mt-6">AI 1차 분석 + 전문가 검토</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          기업정보와 제출자료를 바탕으로 지원사업 검토 방향을 분석하고
          <br />
          전문가가 직접 검토한 진단결과를 확인하세요.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-gray-700">
          <span className="rounded-full bg-gray-100 px-4 py-2">
            성공보수 없음
          </span>
          <span className="rounded-full bg-gray-100 px-4 py-2">
            승인 안 나도 추가 비용 0원
          </span>
          <span className="rounded-full bg-gray-100 px-4 py-2">
            전문가 검토
          </span>
        </div>

        <a
          href="/diagnosis"
          className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          무료 진단 시작하기
        </a>

        <p className="mt-4 text-sm text-gray-500">
          자료 제출 → 전문가 검토 → 진단결과 확인
        </p>
      </section>
    </main>
  );
}
