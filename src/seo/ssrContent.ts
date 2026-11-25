import {
  BRAND_PILLARS,
  FAQS,
  HERO_PILLARS,
  IMAGES,
  PRODUCTS,
} from '../data/brandData.ts';
import type { SeoPageConfig } from './seoData.ts';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildSsrRootHtml(matchedPage?: SeoPageConfig): string {
  const headerHtml = `
    <header style="padding:20px 24px;border-bottom:1px solid #241E1A;background:#0A0A0B;">
      <div style="max-width:1152px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;">
        <a href="/" style="color:#ECCB86;font-weight:700;font-size:24px;text-decoration:none;">정력원</a>
        <nav aria-label="주요 메뉴" style="display:flex;gap:24px;">
          <a href="/brand" style="color:#D6CEC2;text-decoration:none;">정력원 소개</a>
          <a href="/lifestyle" style="color:#D6CEC2;text-decoration:none;">라이프스타일</a>
          <a href="/products" style="color:#D6CEC2;text-decoration:none;">제품 정보</a>
          <a href="/faq" style="color:#D6CEC2;text-decoration:none;">FAQ</a>
          <a href="/support" style="color:#D6CEC2;text-decoration:none;">고객센터</a>
        </nav>
        <a href="https://bitmon01.shop" rel="noopener noreferrer" style="color:#0A0A0B;background:#D4B072;padding:10px 18px;font-weight:600;text-decoration:none;">정력원 바로가기</a>
      </div>
    </header>`;

  const footerHtml = `
    <footer style="padding:40px 24px;border-top:1px solid #241E1A;background:#080809;color:#B9B0A2;">
      <div style="max-width:1152px;margin:0 auto;">
        <p style="color:#F4EFE6;font-weight:600;">정력원 — 품격 있는 중년의 라이프스타일</p>
        <nav aria-label="하단 메뉴" style="display:flex;gap:20px;margin:16px 0;">
          <a href="/brand" style="color:#B9B0A2;">정력원 소개</a>
          <a href="/lifestyle" style="color:#B9B0A2;">라이프스타일</a>
          <a href="/products" style="color:#B9B0A2;">제품 정보</a>
          <a href="/faq" style="color:#B9B0A2;">FAQ</a>
          <a href="/support" style="color:#B9B0A2;">고객센터</a>
          <a href="/privacy" style="color:#B9B0A2;">개인정보처리방침</a>
          <a href="/terms" style="color:#B9B0A2;">이용약관</a>
        </nav>
        <p style="font-size:12px;color:#787066;">상호명 : 정력원 · 대표자 : 오찬휘 · 주소 : 서울특별시 강남구 도곡로3길 19 · 사업자등록번호 : 115-03-35541 · 통신판매업신고번호 : 제2018-서울강남-0884 · 이메일 : Zeus@naver.com</p>
      </div>
    </footer>`;

  if (!matchedPage) {
    return `${headerHtml}
    <main style="max-width:720px;margin:0 auto;padding:96px 24px;text-align:center;">
      <p style="color:#C8A97E;font-size:12px;">404 NOT FOUND</p>
      <h1 style="color:#F4EFE6;font-size:32px;">요청하신 페이지를 찾을 수 없습니다</h1>
      <p style="color:#B9B0A2;">주소가 변경되었거나 존재하지 않는 경로입니다. 정력원 메인 페이지에서 브랜드 안내와 활력 케어 제품 정보를 확인하실 수 있습니다.</p>
      <p><a href="/" style="color:#C8A97E;">정력원 메인으로 돌아가기</a></p>
    </main>${footerHtml}`;
  }

  let pagePrimaryHeading = '시간이 지나도 변하지 않는 자신감';
  if (matchedPage.productId) {
    const product = PRODUCTS.find((p) => p.id === matchedPage.productId);
    if (product) pagePrimaryHeading = product.nameKo;
  } else if (matchedPage.legalPage === 'privacy') {
    pagePrimaryHeading = '개인정보처리방침';
  } else if (matchedPage.legalPage === 'terms') {
    pagePrimaryHeading = '이용약관';
  } else if (matchedPage.path === '/brand') {
    pagePrimaryHeading = '활력 있는 일상, 자신감 있는 라이프스타일';
  } else if (matchedPage.path === '/lifestyle') {
    pagePrimaryHeading = '함께하는 순간이 더욱 행복하도록';
  } else if (matchedPage.path === '/products') {
    pagePrimaryHeading = '나를 위한 건강한 선택';
  } else if (matchedPage.path === '/faq') {
    pagePrimaryHeading = '자주 묻는 질문';
  } else if (matchedPage.path === '/support') {
    pagePrimaryHeading = '프라이빗 고객센터';
  }

  const productItemsHtml = PRODUCTS.map(
    (product) => `
      <article>
        <h3><a href="/products/${escapeHtml(product.id)}" style="color:#F4EFE6;">${escapeHtml(product.nameKo)}</a></h3>
        <p>${escapeHtml(product.subtitle)}</p>
        <p>${escapeHtml(product.description)}</p>
        <p>${escapeHtml(product.volume)} · ${escapeHtml(product.dailyServing)}</p>
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt)}" />
      </article>`
  ).join('\n');

  const faqItemsHtml = FAQS.map(
    (faq) => `
      <article>
        <h3>${escapeHtml(faq.question)}</h3>
        <p>${escapeHtml(faq.answer)}</p>
      </article>`
  ).join('\n');

  return `${headerHtml}
  <main style="max-width:1152px;margin:0 auto;padding:48px 24px;">
    <section id="hero">
      <p style="color:#C8A97E;">정력원 · 4060 대한민국 중년 남성 활력 라이프스타일</p>
      <h1 style="color:#F4EFE6;font-size:40px;">${escapeHtml(pagePrimaryHeading)}</h1>
      <p>${escapeHtml(matchedPage.description)}</p>
      <img src="${escapeHtml(IMAGES.heroGentleman)}" alt="건장하고 당당한 체형에 세련된 다크 쓰리피스 수트를 입고 서울 고급 호텔 라운지에 선 40대 한국 중년 남성 모델" />
      <p><a href="https://bitmon01.shop" rel="noopener noreferrer" style="color:#C8A97E;">정력원 바로가기</a></p>
      <ul>
        ${HERO_PILLARS.map((p) => `<li><strong>${escapeHtml(p.title)}</strong>: ${escapeHtml(p.detail)}</li>`).join('')}
      </ul>
    </section>

    <section id="brand">
      <h2>정력원 브랜드 소개 — 활력 있는 일상</h2>
      <img src="${escapeHtml(IMAGES.brandStoryMan)}" alt="아침 햇살이 비치는 서울의 모던한 건축 정원을 걷는 건강하고 탄탄한 체형의 40~50대 한국 중년 남성" />
      ${BRAND_PILLARS.map((b) => `<article><h3>${escapeHtml(b.number)} ${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p></article>`).join('')}
    </section>

    <section id="lifestyle">
      <h2>4050 커플 라이프스타일</h2>
      <img src="${escapeHtml(IMAGES.coupleEvening)}" alt="고급스러운 다이닝 라운지에서 건강하고 당당한 체형의 한국 중년 남성과 환하게 웃는 한국 중년 여성이 함께하는 모습" />
      <img src="${escapeHtml(IMAGES.coupleMorning)}" alt="따뜻한 햇살이 드는 거실에서 함께 차를 마시며 즐겁게 웃고 있는 50대 한국 중년 부부" />
    </section>

    <section id="products">
      <h2>정력원 제품 라인업</h2>
      ${productItemsHtml}
    </section>

    <section id="faq">
      <h2>자주 묻는 질문 (FAQ)</h2>
      ${faqItemsHtml}
    </section>

    <section id="support">
      <h2>프라이빗 고객센터</h2>
      <p>전담 컨시어지 직통: 02-514-8890 · 운영 시간: 오전 09:00 – 00:00 (1년 365일 무료 상담 운영) · 서울특별시 강남구 도곡로3길 19</p>
    </section>
  </main>${footerHtml}`;
}
