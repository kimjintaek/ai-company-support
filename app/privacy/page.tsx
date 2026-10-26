"use client";
import Link from "next/link";
function Section({id,title,children}:{id?:string;title:string;children:React.ReactNode}){return <section id={id} className="scroll-mt-6"><h2 className="text-xl font-semibold text-gray-900">{title}</h2><div className="mt-3 space-y-3 leading-7 text-gray-700">{children}</div></section>}
export default function PrivacyPage(){
return <main className="min-h-screen bg-gray-50 px-6 py-12"><article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
<p className="text-sm font-semibold text-blue-600">기업지원사업 AI 진단</p><h1 className="mt-2 text-3xl font-bold text-gray-900">개인정보 처리 및 동의 안내</h1><p className="mt-3 text-sm leading-6 text-gray-500">운영자: 주식회사 다온지원센터 · 적용 버전: 2026-10-26-v1</p>
<p className="mt-6 leading-7 text-gray-700">회사는 기업지원사업 진단 및 매칭 서비스를 제공하기 위해 아래와 같이 개인정보를 처리합니다. 필수 항목에 동의하지 않으면 회원가입 및 서비스 제공이 제한될 수 있습니다. 선택 항목은 동의하지 않아도 기본 서비스를 이용할 수 있습니다.</p>
<div className="mt-8 space-y-8">
<Section id="collection" title="1. [필수] 개인정보 수집·이용 동의">
<p><strong>이용 목적:</strong> 회원 식별 및 계정 관리, 기업지원사업 진단·매칭, 진단보고서 및 사업계획서 초안 작성, 전문가 검토, 고객 문의 대응, 서비스 및 결제·이용권 관리, 중요 안내 전달.</p>
<p><strong>수집 항목:</strong> 대표자명, 사업자명, 연락처, 이메일, 비밀번호(인증 서비스에서 관리), 업종, 지역, 사업 형태, 사업자등록증, 재무제표, 4대 사회보험 관련 자료 및 이용자가 서비스 이용 중 제출하는 기업정보·자료.</p>
<p><strong>보유 및 이용 기간:</strong> 회원 및 서비스 이용 기간 동안 목적에 필요한 범위에서 보유합니다. 회원 탈퇴 또는 처리 목적 달성 시 지체 없이 파기하되, 관련 법령에 따라 보존해야 하는 정보는 해당 법정 기간 동안 별도 보관합니다. 제출자료는 진단·매칭 및 고객 지원에 필요한 기간 동안 접근을 제한해 관리합니다.</p>
<p><strong>동의 거부 권리:</strong> 이용자는 동의를 거부할 수 있으나, 필수 항목에 동의하지 않으면 회원가입 또는 진단 서비스 이용이 제한됩니다.</p></Section>
<Section id="marketing" title="2. [선택] 개인정보 마케팅 활용 동의">
<p><strong>이용 목적:</strong> 다온지원센터가 제공하거나 안내하는 기업지원사업·정책자금 정보, 경영컨설팅, 세무·절세 관련 서비스, 기업 인증·연구개발 지원, 기업보험 및 기타 기업 대상 서비스의 안내와 맞춤형 서비스 제안.</p>
<p><strong>이용 항목:</strong> 대표자명, 연락처, 이메일, 사업자명, 업종, 지역 및 서비스 이용 과정에서 제공한 기업 기본정보 중 마케팅 목적에 필요한 항목.</p>
<p><strong>보유 및 이용 기간:</strong> 동의 철회 또는 회원 탈퇴 시까지. 법령상 별도 보존 의무가 있는 경우에는 해당 기간을 따릅니다.</p>
<p><strong>동의 거부 권리:</strong> 동의를 거부해도 회원가입 및 기본 진단 서비스 이용에는 제한이 없습니다. 동의 후에도 언제든지 철회할 수 있습니다.</p></Section>
<Section id="advertising" title="3. [선택] 광고성 정보 수신 동의">
<p><strong>발송 목적 및 내용:</strong> 기업지원사업·정책자금·컨설팅 등 서비스 관련 프로모션, 이벤트 및 광고성 안내.</p>
<p><strong>수신 항목 및 방법:</strong> 연락처 및 이메일을 이용한 문자메시지(SMS), 이메일, 카카오톡 등 전자적 전송매체. 실제 발송은 이용자가 제공한 연락처와 사용 가능한 채널에 한합니다.</p>
<p><strong>보유 및 이용 기간:</strong> 광고성 정보 수신 동의 철회 또는 회원 탈퇴 시까지.</p>
<p><strong>동의 거부 및 철회:</strong> 동의를 거부하거나 철회해도 기본 서비스 이용에는 제한이 없습니다. 수신한 광고성 안내의 수신거부 방법 또는 회사에 대한 요청으로 철회할 수 있습니다.</p></Section>
<Section title="4. 개인정보 처리 업무 및 보안">
<p>서비스는 웹사이트 호스팅, 계정 인증, 데이터베이스 및 파일 저장을 위해 클라우드 기반 기술 서비스를 이용합니다. 외부 처리업체의 정확한 법인명, 처리 위치, 국외 이전 여부 및 세부 위탁 내용은 실제 배포·계정 설정을 확인하여 확정하고 별도로 안내해야 합니다.</p>
<p>회사는 업무상 필요한 권한만 부여하고 개인정보 보호를 위한 기술적·관리적 조치를 적용하기 위해 노력합니다. 이용자는 다른 사람의 개인정보가 포함된 자료를 제출할 때 적법한 제출 권한을 확보해야 합니다.</p></Section>
<Section title="5. 이용자의 권리 및 문의">
<p>이용자는 자신의 개인정보 열람·정정·삭제 및 처리정지를 요청하거나 선택 동의를 철회할 수 있습니다. 요청은 <a className="font-semibold text-blue-700 underline" href="http://pf.kakao.com/_QxnX/chat" target="_blank" rel="noreferrer">다온지원센터 카카오톡 채널 상담</a>을 통해 접수할 수 있습니다.</p>
<p>개인정보 처리 관련 문의는 회사에 요청해 주세요. 개인정보 보호 담당자의 성명·직책과 별도 연락처는 운영자가 지정한 뒤 이 문서에 추가해야 합니다.</p></Section>
<Section title="6. 동의 기록"><p>회사는 동의 항목별 동의 여부, 동의 시각 및 문서 버전을 기록하여 동의 이력을 관리합니다. 선택 동의 여부는 필수 동의와 구분해 기록합니다.</p></Section>
</div>
<div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>운영자 확인 필요:</strong> 이 문서는 플랫폼에 적용하기 위한 초안입니다. 공개 운영 전 개인정보 처리 담당자 연락처, 클라우드 업체의 정확한 위탁·국외 이전 정보, 자료 보유기간 및 법정 보존기간을 실제 운영 설정과 대조해 확정해야 합니다.</div>
<div className="mt-6 flex flex-wrap gap-3"><Link href="/terms" className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">서비스 이용약관</Link><Link href="/diagnosis" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">진단 신청으로 돌아가기</Link></div>
</article></main>;
}