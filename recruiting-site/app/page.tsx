const supportItems = [
  {
    number: "01",
    title: "기업영업 홍보자료",
    description: "정책자금과 기업지원 컨설팅 관련 주제를 채널별 게시물로 정리해 제공합니다.",
    tags: ["쇼츠 대본", "블로그 글", "SNS 게시물"],
  },
  {
    number: "02",
    title: "개인별 홍보 링크",
    description: "파트너별 유입 경로를 구분해 기업 상담 문의가 어디에서 발생했는지 확인할 수 있도록 설계합니다.",
    tags: ["개인 전용 링크", "유입 경로 구분", "상담 연결"],
  },
  {
    number: "03",
    title: "기업컨설팅 지원",
    description: "기업 고객의 정책자금 및 법인컨설팅 상담을 다온지원센터 전문 담당자와 연결합니다.",
    tags: ["정책자금", "기업지원", "전문가 상담"],
  },
];

const channels = [
  { name: "유튜브 쇼츠", detail: "짧은 영상 대본과 핵심 자막" },
  { name: "네이버 블로그", detail: "검색형 제목·본문·태그" },
  { name: "당근 비즈니스", detail: "지역 사업자 대상 게시글" },
  { name: "인스타그램", detail: "피드 문구·릴스 설명·해시태그" },
];

const steps = [
  ["01", "모집 안내 확인", "조직 운영 방식과 지원 내용을 확인합니다."],
  ["02", "상담 및 등록 절차", "소속 및 등록 가능 여부를 확인하고 절차를 진행합니다."],
  ["03", "영업지원 계정 안내", "기업영업 홍보자료와 개인별 안내 경로를 이용합니다."],
  ["04", "본인 채널에 게시", "제공된 자료를 확인하고 본인의 SNS 계정에 게시합니다."],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="다온 파트너스 홈">
          <span className="brand-mark">D</span>
          <span>DAON <b>PARTNERS</b></span>
        </a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <a href="#support">영업지원</a>
          <a href="#process">참여 절차</a>
          <a href="#faq">자주 묻는 질문</a>
        </nav>
        <a className="header-cta" href="#contact">모집 안내 보기 <span>↗</span></a>
      </header>

      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-inner">
          <div className="eyebrow"><span className="eyebrow-dot" /> DAON PARTNERS · BUSINESS SALES SUPPORT</div>
          <h1>
            보험영업에 더해,
            <br />
            <span>기업영업의 기회</span>를 준비하세요.
          </h1>
          <p className="hero-copy">
            보험설계사의 기존 영업활동은 유지하면서,
            <br className="desktop-break" />
            정책자금·기업컨설팅 고객을 발굴할 수 있도록 홍보자료와 영업지원 플랫폼을 제공합니다.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#support">제공되는 영업지원 확인 <span>→</span></a>
            <a className="button button-ghost" href="#process">참여 절차 보기</a>
          </div>
          <div className="hero-note">
            <span>✓</span> 별도 플랫폼 이용료를 받는 교육상품이 아닌, 조직 참여자를 위한 영업지원 체계
          </div>
        </div>
        <div className="hero-side-card">
          <div className="side-card-top"><span className="live-dot" /> PARTNER SUPPORT</div>
          <div className="side-card-title">기업영업 홍보자료</div>
          <div className="mock-content">
            <div className="mock-icon">▶</div>
            <div><b>정책자금 쇼츠</b><small>영상 대본 · 자막 구성</small></div>
            <span className="mock-arrow">↗</span>
          </div>
          <div className="mock-content">
            <div className="mock-icon mock-icon-blue">B</div>
            <div><b>블로그 콘텐츠</b><small>제목 · 본문 · 검색 태그</small></div>
            <span className="mock-arrow">↗</span>
          </div>
          <div className="mock-content">
            <div className="mock-icon mock-icon-orange">S</div>
            <div><b>SNS 게시물</b><small>당근 · 인스타그램</small></div>
            <span className="mock-arrow">↗</span>
          </div>
          <div className="side-card-foot">콘텐츠 예시 화면 · 실제 제공 기능은 단계별 구축 예정</div>
        </div>
        <div className="hero-bottom-label">INSURANCE PARTNER · CORPORATE CONSULTING</div>
      </section>

      <section className="intro section-wrap">
        <div className="section-kicker">WHY DAON PARTNERS</div>
        <div className="intro-layout">
          <h2>영업은 직접,<br /><span>홍보 준비는 더 쉽게.</span></h2>
          <div className="intro-text">
            새로운 영업을 위해 별도의 마케팅팀이나 콘텐츠 제작 역량을 갖출 필요가 없도록,
            다온지원센터가 기업영업에 필요한 홍보자료와 플랫폼을 지원하는 구조를 준비합니다.
            <p>파트너는 제공된 자료를 검토하고 본인의 계정과 영업 네트워크를 통해 고객을 발굴합니다.</p>
          </div>
        </div>
      </section>

      <section className="support-section" id="support">
        <div className="section-wrap">
          <div className="section-kicker">PARTNER SALES SUPPORT</div>
          <div className="section-heading-row">
            <h2>파트너에게 제공할<br /><span>세 가지 영업지원</span></h2>
            <p>공통 콘텐츠를 제작하고 파트너별 홍보 경로를 구분하는 방식으로 운영합니다.</p>
          </div>
          <div className="support-grid">
            {supportItems.map((item) => (
              <article className="support-card" key={item.number}>
                <div className="card-number">{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="channel-section section-wrap">
        <div className="section-kicker">CONTENT CHANNELS</div>
        <div className="section-heading-row">
          <h2>한 가지 주제를<br /><span>채널에 맞게 다르게.</span></h2>
          <p>같은 주제를 그대로 복제하는 방식이 아니라, 채널의 이용자와 형식에 맞춰 게시용 자료를 구성합니다.</p>
        </div>
        <div className="channel-grid">
          {channels.map((channel, index) => (
            <div className="channel-item" key={channel.name}>
              <span className="channel-index">0{index + 1}</span>
              <div><b>{channel.name}</b><small>{channel.detail}</small></div>
              <span className="channel-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      <section className="routine-section">
        <div className="section-wrap routine-layout">
          <div>
            <div className="section-kicker light-kicker">SIMPLE DAILY ROUTINE</div>
            <h2>하루 30분,<br /><span>꾸준한 홍보 활동을 목표로.</span></h2>
            <p className="routine-copy">홍보자료를 직접 기획하고 제작하는 시간을 줄이고, 본인 채널에 게시하고 문의를 확인하는 활동에 집중할 수 있도록 설계합니다.</p>
            <p className="routine-caution">※ 30분은 운영 목표이며, 실제 소요시간과 상담·고객관리 시간은 개인별로 달라질 수 있습니다.</p>
          </div>
          <div className="routine-list">
            <div><span>01</span><b>제공된 콘텐츠 확인</b><small>오늘의 주제와 채널별 자료 확인</small><strong>5분</strong></div>
            <div><span>02</span><b>개인 정보·지역 확인</b><small>게시 내용과 본인 홍보 경로 점검</small><strong>10분</strong></div>
            <div><span>03</span><b>본인 계정에 게시</b><small>쇼츠·블로그·SNS 게시</small><strong>10분</strong></div>
            <div><span>04</span><b>문의 확인</b><small>상담 요청 및 후속 연락 확인</small><strong>5분</strong></div>
          </div>
        </div>
      </section>

      <section className="process-section section-wrap" id="process">
        <div className="section-kicker">HOW TO JOIN</div>
        <div className="section-heading-row">
          <h2>참여 절차</h2>
          <p>소속 등록 및 영업지원 이용 가능 여부는 상담을 통해 확인합니다.</p>
        </div>
        <div className="process-grid">
          {steps.map(([number, title, description]) => (
            <div className="process-step" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-wrap faq-layout">
          <div><div className="section-kicker">FAQ</div><h2>자주 묻는 질문</h2></div>
          <div className="faq-list">
            <details><summary>보험영업을 중단해야 하나요?</summary><p>아닙니다. 기존 보험영업과 별도로 기업고객 발굴 활동을 병행하는 구상입니다. 구체적인 소속 및 활동 범위는 등록 상담 과정에서 확인합니다.</p></details>
            <details><summary>홍보 콘텐츠를 직접 만들어야 하나요?</summary><p>다온지원센터에서 공통 홍보자료를 제작해 제공하고, 파트너는 본인 채널에 맞게 확인·게시하는 방식으로 설계합니다.</p></details>
            <details><summary>게시하면 상담이나 계약이 보장되나요?</summary><p>아닙니다. 홍보자료와 영업지원 도구를 제공하는 것이며, 고객 유입·상담·계약 성과를 보장하지 않습니다.</p></details>
            <details><summary>개인 보험영업용 AI 마케팅도 제공하나요?</summary><p>현재 1차 구축 범위는 기업영업 홍보지원입니다. 개인 보험영업용 AI 마케팅은 향후 별도 검토할 예정입니다.</p></details>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="section-kicker light-kicker">DAON PARTNERS</div>
          <h2>기업영업 지원과 함께할<br /><span>파트너를 모집합니다.</span></h2>
          <p>보험영업 경험을 바탕으로 기업고객 발굴 활동까지 확장하고 싶은 분을 위한 파트너 모집 안내입니다.</p>
          <div className="contact-status">모집 상담 접수 기능은 연결 준비 중입니다.</div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="brand footer-brand"><span className="brand-mark">D</span><span>DAON <b>PARTNERS</b></span></div>
        <p>운영: (주)다온지원센터 · 보험설계사 파트너 모집 안내</p>
        <small>본 페이지는 영업지원 및 파트너 모집 안내를 위한 페이지입니다. 보험상품의 구체적인 보장내용·보험료·수익 등을 안내하거나 모집하는 광고가 아닙니다. 보험 관련 업무는 소속 보험회사 및 관련 법규·내부 심의 기준을 따릅니다.</small>
      </footer>
    </main>
  );
}
