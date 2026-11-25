export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface SitemapImageEntry {
  path: string;
  title: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoPageConfig {
  path: string;
  title: string;
  description: string;
  keywords: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: string;
  sectionId?: string;
  productId?: string;
  legalPage?: 'privacy' | 'terms';
  images: SitemapImageEntry[];
  breadcrumbs: BreadcrumbItem[];
}

export const CONTENT_LASTMOD = '2026-11-24';

export const MAIN_PAGE_TITLE = '정력원 | 프리미엄 중년 남성 활력 케어';
export const MAIN_PAGE_DESCRIPTION =
  '40~60대 한국 중년 남성을 위한 프리미엄 활력 영양제 브랜드 정력원. 아연, L-아르기닌, 옥타코사놀 등 검증된 원료 기반의 중년 남성 활력 케어와 품격 있는 라이프스타일, 365일 무료 프라이빗 상담을 만나보세요.';

export const DEFAULT_OG_IMAGE_PATH =
  '/src/assets/images/hero_korean_gentleman_fit_1795566944337.jpg';

export const NOT_FOUND_SEO = {
  title: '페이지를 찾을 수 없습니다 | 정력원',
  description:
    '요청하신 페이지를 찾을 수 없습니다. 정력원 메인 페이지에서 중년 남성 활력 케어 제품과 브랜드 안내를 확인해 보세요.',
  robots: 'noindex, nofollow',
};

export const SEO_PAGES: SeoPageConfig[] = [
  {
    path: '/',
    title: MAIN_PAGE_TITLE,
    description: MAIN_PAGE_DESCRIPTION,
    keywords:
      '정력원, 중년 남성 활력 영양제, 중년 남성 활력 케어, 4050 남성 건강, 아연, L-아르기닌, 옥타코사놀, 정력원 블랙 리저브',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'weekly',
    priority: '1.0',
    sectionId: 'hero',
    images: [
      {
        path: '/src/assets/images/hero_korean_gentleman_fit_1795566944337.jpg',
        title: '정력원 4060 대한민국 중년 남성 프리미엄 활력 라이프스타일 메인 모델',
      },
    ],
    breadcrumbs: [{ name: '홈', path: '/' }],
  },
  {
    path: '/brand',
    title: '정력원 소개 | 중년 남성의 건강한 활력 철학',
    description:
      '바쁜 일상 속에서도 흔들리지 않는 컨디션 관리를 제안하는 정력원의 브랜드 철학과 정직한 원료 배합 기준, 데일리 활력 루틴을 소개합니다.',
    keywords: '정력원 소개, 브랜드 철학, 중년 남성 활력 루틴, 정직한 원료 기준',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.8',
    sectionId: 'brand',
    images: [
      {
        path: '/src/assets/images/brand_story_vitality_fit_1795566944889.jpg',
        title: '정력원 활력 있는 일상 건강 루틴을 즐기는 한국 중년 남성',
      },
    ],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '정력원 소개', path: '/brand' },
    ],
  },
  {
    path: '/lifestyle',
    title: '커플 라이프스타일 | 정력원 4050 웰니스 스토리',
    description:
      '스스로를 돌보는 남성의 여유와 배우자와 함께하는 따뜻한 저녁, 평온한 주말 아침 티타임이 어우러진 정력원의 중년 라이프스타일 스토리입니다.',
    keywords: '중년 부부 라이프스타일, 4050 웰니스, 정력원 스토리, 품격 있는 일상',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.8',
    sectionId: 'lifestyle',
    images: [
      {
        path: '/src/assets/images/couple_lifestyle_fit_1795566945462.jpg',
        title: '고급 다이닝 라운지에서 미소 짓는 4050 한국 중년 커플 라이프스타일',
      },
      {
        path: '/src/assets/images/couple_morning_leisure_1795565594049.jpg',
        title: '주말 아침 거실에서 차를 나누며 웃는 50대 한국 중년 부부',
      },
    ],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '라이프스타일', path: '/lifestyle' },
    ],
  },
  {
    path: '/products',
    title: '제품 정보 | 정력원 검증된 활력 케어 라인업',
    description:
      'GMP 인증 제조 시설에서 원산지와 함량이 확인된 원료로 배합한 정력원 블랙 리저브 엘릭서, 골드 밸런스 데일리, 시그니처 듀오 세트를 살펴보세요.',
    keywords: '정력원 제품 정보, 블랙 리저브 엘릭서, 골드 밸런스 데일리, 시그니처 듀오 세트',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'weekly',
    priority: '0.9',
    sectionId: 'products',
    images: [
      {
        path: '/src/assets/images/product_vitality_elixir_1795565594639.jpg',
        title: '정력원 시그니처 매트 블랙 글라스 보틀 및 다크 브라운 패키지',
      },
    ],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '제품 정보', path: '/products' },
    ],
  },
  {
    path: '/products/jeongryeokwon-black-elixir',
    title: '정력원 블랙 리저브 엘릭서 | 아연·아르기닌 중년 남성 활력 영양제',
    description:
      'L-아르기닌, 프랑스산 글루콘산 아연, 타우린, 비타민 B군을 균형 있게 담은 정력원 대표 30일분 중년 남성 활력 영양제 데일리 케어 상세 정보입니다.',
    keywords: '정력원 블랙 리저브 엘릭서, 중년 남성 활력 영양제, 글루콘산 아연, L-아르기닌',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.8',
    sectionId: 'products',
    productId: 'jeongryeokwon-black-elixir',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '제품 정보', path: '/products' },
      { name: '정력원 블랙 리저브 엘릭서', path: '/products/jeongryeokwon-black-elixir' },
    ],
  },
  {
    path: '/products/jeongryeokwon-gold-balance',
    title: '정력원 골드 밸런스 데일리 | 옥타코사놀·마카·비타민 D3',
    description:
      '골프, 등산 등 활동적인 중년 남성을 위한 미국산 옥타코사놀 20mg, 스위스산 비타민 D3, 페루산 블랙 마카 추출분말 배합 60정 데일리 밸런스 제품입니다.',
    keywords: '정력원 골드 밸런스 데일리, 옥타코사놀, 블랙 마카, 비타민 D3',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.8',
    sectionId: 'products',
    productId: 'jeongryeokwon-gold-balance',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '제품 정보', path: '/products' },
      { name: '정력원 골드 밸런스 데일리', path: '/products/jeongryeokwon-gold-balance' },
    ],
  },
  {
    path: '/products/jeongryeokwon-signature-duo',
    title: '정력원 시그니처 듀오 세트 | 프리미엄 2종 기프트 에디션',
    description:
      '블랙 리저브 엘릭서와 골드 밸런스 데일리 본품, 전용 월넛 트레이와 기프트 박스로 구성된 정력원 60일 집중 활력 관리 및 선물용 스페셜 에디션입니다.',
    keywords: '정력원 시그니처 듀오 세트, 중년 남성 선물, 프리미엄 기프트 에디션',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.8',
    sectionId: 'products',
    productId: 'jeongryeokwon-signature-duo',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '제품 정보', path: '/products' },
      { name: '정력원 시그니처 듀오 세트', path: '/products/jeongryeokwon-signature-duo' },
    ],
  },
  {
    path: '/faq',
    title: '자주 묻는 질문(FAQ) | 정력원 원료·섭취·배송 안내',
    description:
      '정력원 제품의 GMP 인증 원료 검증 절차, 권장 섭취 시간, 복용 중인 의약품과의 상호작용 주의사항, 안심 비밀 배송 및 교환 환불 기준을 안내합니다.',
    keywords: '정력원 FAQ, 섭취 방법, GMP 인증 원료, 안심 배송, 교환 환불',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.7',
    sectionId: 'faq',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '자주 묻는 질문', path: '/faq' },
    ],
  },
  {
    path: '/support',
    title: '프라이빗 고객센터 | 정력원 365일 1:1 맞춤 상담',
    description:
      '오전 09시부터 자정까지 연중무휴 365일 운영되는 정력원 전담 컨시어지 고객센터입니다. 제품 성분, 섭취 루틴, 기프트 상담을 1:1로 신청하세요.',
    keywords: '정력원 고객센터, 365일 상담, 1:1 컨시어지, 서울 강남구 도곡로',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'monthly',
    priority: '0.7',
    sectionId: 'support',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '고객센터', path: '/support' },
    ],
  },
  {
    path: '/privacy',
    title: '개인정보처리방침 | 정력원',
    description:
      '정력원이 1:1 상담 접수 및 안심 배송 서비스 제공을 위해 수집하는 최소한의 개인정보 항목, 보유 기간, 파기 절차 및 이용자 권리 안내입니다.',
    keywords: '정력원 개인정보처리방침, 개인정보 보호, 상담 정보 관리',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'yearly',
    priority: '0.3',
    legalPage: 'privacy',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '개인정보처리방침', path: '/privacy' },
    ],
  },
  {
    path: '/terms',
    title: '이용약관 | 정력원',
    description:
      '정력원 웹사이트 및 전담 컨시어지 상담·주문 예약 서비스 이용에 관한 회원 및 비회원 이용자의 권리, 의무, 책임 사항을 규정한 공식 이용약관입니다.',
    keywords: '정력원 이용약관, 서비스 약관, 전자상거래 안내',
    lastmod: CONTENT_LASTMOD,
    changefreq: 'yearly',
    priority: '0.3',
    legalPage: 'terms',
    images: [],
    breadcrumbs: [
      { name: '홈', path: '/' },
      { name: '이용약관', path: '/terms' },
    ],
  },
];

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const cleaned = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
}

export function findSeoPage(pathname: string): SeoPageConfig | undefined {
  const normalized = normalizePathname(pathname);
  return SEO_PAGES.find((page) => page.path === normalized);
}
