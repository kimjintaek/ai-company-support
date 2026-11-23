import Link from "next/link";

// Preview-only route: no registration or database writes.
export default function RegistrationCompletePreviewPage() {
  return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-blue-700">무료 기업정보 등록 완료</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">무료 기업등록이 완료되었습니다.</h1>
            <p className="mt-3 leading-7 text-gray-600">기업정보와 문의 내용이 접수되었습니다. 고객 로그인 후 등록한 계정을 이용하실 수 있습니다.</p>
            <Link href="/login" className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">고객 로그인</Link>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold text-blue-700">다온지원센터의 차별점</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl">같은 정책자금이라도<br className="hidden sm:block" /> 기업 조건에 따라 신청 전략은 달라집니다.</h2>
            <p className="mt-4 leading-7 text-gray-700">정책자금은 업종과 지역만으로 판단하기 어렵습니다. 대표자의 연령, 사업 연차, 보유 인증, 매출 및 고용 변화에 따라 신청요건과 우대조건이 달라질 수 있습니다.</p>
            <p className="mt-3 leading-7 text-gray-700"><strong>다온지원센터는 기업의 현재 조건을 분석하고 운전자금 공고별 신청요건과 우대조건을 비교해 검토 방향을 제시합니다.</strong></p>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900">예를 들어, 이런 기업별 차이를 검토합니다.</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["청년 대표 기업", "대표자 연령과 업력에 따른 청년 대상 자금 및 우대조건 검토"],
                  ["여성·장애인·벤처기업", "이미 보유한 인증이 해당 공고의 우대조건에 적용되는지 확인"],
                  ["고용 증가 기업", "인력 증가 실적이 공고의 우대조건에 해당하는지 검토"],
                  ["매출 감소 기업", "매출 변동과 경영애로 관련 운전자금 신청요건 검토"],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-xl bg-white p-4">
                    <p className="font-bold text-blue-900">✓ {title}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-6 text-gray-600">실제 신청 가능 여부와 우대조건 적용은 각 기관의 개별 공고 및 심사기준에 따라 달라집니다.</p>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold text-blue-700">진단부터 추가 매칭까지</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">기업에 필요한 운전자금을 이렇게 검토합니다.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["01", "기업 조건 분석", "업종·지역·청년 여부·보유 인증·업력·매출·고용 현황 확인"],
                ["02", "운전자금 공고 비교", "공고별 신청요건·우대조건·준비서류·일정 비교"],
                ["03", "AI 분석 + 전문가 검토", "AI 진단 결과를 전문가가 검토하고 기업별 진단보고서 및 신청 준비 방향 안내"],
                ["04", "1년간 추가 매칭", "이용기간 중 확인 가능한 신규 공고와 제공된 기업정보 변화를 반영해 추가 검토"],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-xl border border-slate-200 p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">{number}</span>
                  <h3 className="mt-3 font-bold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-blue-900 p-5 text-white">
              <h3 className="text-lg font-bold">한 번 검토하고 끝나는 서비스가 아닙니다.</h3>
              <p className="mt-2 text-sm leading-7 text-blue-50">현재 적합한 운전자금이 없더라도 결제일부터 1년 동안 확인 가능한 신규 공고를 바탕으로 추가 매칭을 검토합니다. 기업자료를 미리 제출하면 공고별 요건과 신청 시기에 맞춘 준비사항 및 신청 가이드를 안내합니다.</p>
            </div>
            <p className="mt-3 text-xs leading-6 text-gray-500">공고 일정과 조건은 기관 사정에 따라 변경될 수 있습니다. 신청 및 최종 제출은 사업자가 직접 진행합니다.</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold text-blue-700">선택형 유료 서비스</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">운전자금 AI 진단 · 1년 이용권</h2>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">49,000원 <span className="text-base font-normal text-gray-600">+ 부가세 4,900원</span></p>
            <p className="mt-1 text-sm font-semibold text-gray-700">실제 결제금액 53,900원</p>
            <p className="mt-3 font-bold text-blue-800">결제일부터 1년 · 선정 후 추가 성공보수 없음</p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-gray-700">
              <li>기업별 운전자금 진단 및 공고 매칭</li>
              <li>공고별 신청요건·우대조건 및 준비서류 검토</li>
              <li>AI 진단보고서와 전문가 검토</li>
              <li>신청 준비사항 및 신청 절차 가이드</li>
              <li>이용기간 내 신규 공고에 대한 추가 운전자금 매칭</li>
            </ul>
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-bold text-gray-900">전문 컨설팅은 별도 서비스입니다.</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">기존 여성기업·장애인기업·벤처기업 인증의 보유 여부는 운전자금 매칭 시 검토할 수 있지만, 인증 신규 취득 지원과 시설자금·R&amp;D·기타 경영컨설팅은 기본 이용권에 포함되지 않습니다.</p>
            </div>
            <p className="mt-5 text-xs leading-6 text-gray-500">정책자금 선정이나 대출 실행을 보장하지 않습니다. 기관에 대한 신청과 최종 제출은 사업자가 직접 진행하며, 유료 서비스 결제 안내는 고객 로그인 후 확인할 수 있습니다.</p>
            <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800">운전자금 진단 이용 안내 · 고객 로그인</Link>
            <Link href="/policy-fund" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">전문 컨설팅 상세 보기</Link>
          </section>
        </div>
      </main>
  );
}
