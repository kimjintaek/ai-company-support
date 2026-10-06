export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          기업지원사업 AI 진단 플랫폼
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          내 회사 지원사업
          <br />
          <span className="text-blue-600">3분 진단</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          우리 회사가 어떤 정책자금·지원사업을 검토할 수 있는지
          <br />
          기업 상황을 기준으로 빠르게 확인해보세요.
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
          사업자 기본정보만 입력하면 시작할 수 있습니다.
        </p>
      </section>
    </main>
  );
}