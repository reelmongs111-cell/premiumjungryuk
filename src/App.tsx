import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  MapPin,
  Phone,
  Clock,
  Mail,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  IMAGES,
  HERO_PILLARS,
  BRAND_PILLARS,
  PRODUCTS,
  FAQS,
  ProductItem,
} from './data/brandData';
import {
  NOT_FOUND_SEO,
  findSeoPage,
  normalizePathname,
} from './seo/seoData';
import { Header } from './components/Header';
import { ResilientImage } from './components/ResilientImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartEntry } from './components/CartDrawer';
import { LegalModal } from './components/LegalModal';

type CategoryFilter = '전체' | '활력 케어' | '데일리 밸런스' | '기프트 에디션';

const CATEGORIES: CategoryFilter[] = [
  '전체',
  '활력 케어',
  '데일리 밸런스',
  '기프트 에디션',
];

function upsertHeadTag(
  selector: string,
  createEl: () => HTMLElement,
  applyAttrs: (el: HTMLElement) => void
) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = createEl();
    document.head.appendChild(el);
  }
  applyAttrs(el);
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePathname(window.location.pathname)
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('전체');
  const [cartItems, setCartItems] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string>(FAQS[0].id);

  // Customer Center Inquiry Form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('제품 원료 및 섭취 상담');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryAgreed, setInquiryAgreed] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const matchedSeo = findSeoPage(currentPath);
  const isNotFound = !matchedSeo;
  const activeProduct = matchedSeo?.productId
    ? PRODUCTS.find((p) => p.id === matchedSeo.productId) ?? null
    : null;
  const activeLegalPage = matchedSeo?.legalPage ?? null;

  const navigateToPath = (nextPath: string, sectionIdToScroll?: string) => {
    const normalized = normalizePathname(nextPath);
    if (normalizePathname(window.location.pathname) !== normalized) {
      window.history.pushState(null, '', normalized);
    }
    setCurrentPath(normalized);

    if (sectionIdToScroll) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(sectionIdToScroll);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else if (normalized === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const targetPath = sectionId === 'hero' ? '/' : `/${sectionId}`;
    navigateToPath(targetPath, sectionId);
  };

  useEffect(() => {
    const handlePopState = () => {
      const next = normalizePathname(window.location.pathname);
      setCurrentPath(next);
      const seo = findSeoPage(next);
      if (seo?.sectionId && !seo.productId && !seo.legalPage) {
        window.requestAnimationFrame(() => {
          document
            .getElementById(seo.sectionId!)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const seo = findSeoPage(currentPath);
    if (seo?.sectionId && seo.path !== '/' && !seo.productId && !seo.legalPage) {
      const timer = window.setTimeout(() => {
        document
          .getElementById(seo.sectionId!)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [currentPath]);

  useEffect(() => {
    const seo = findSeoPage(currentPath);
    const title = seo ? seo.title : NOT_FOUND_SEO.title;
    const description = seo ? seo.description : NOT_FOUND_SEO.description;
    const robots = seo
      ? 'index, follow, max-image-preview:large'
      : NOT_FOUND_SEO.robots;
    const existingCanonical = document.head
      .querySelector('link[rel="canonical"]')
      ?.getAttribute('href');
    let origin = 'https://powerwang.xyz';
    if (existingCanonical) {
      try {
        origin = new URL(existingCanonical).origin;
      } catch {
        origin = 'https://powerwang.xyz';
      }
    }
    const canonicalHref = `${origin}${seo ? seo.path : currentPath}`;

    document.title = title;

    upsertHeadTag(
      'meta[name="description"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      },
      (el) => el.setAttribute('content', description)
    );

    upsertHeadTag(
      'meta[name="robots"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'robots');
        return m;
      },
      (el) => el.setAttribute('content', robots)
    );

    upsertHeadTag(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      },
      (el) => el.setAttribute('href', canonicalHref)
    );

    upsertHeadTag(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:title');
        return m;
      },
      (el) => el.setAttribute('content', title)
    );

    upsertHeadTag(
      'meta[property="og:description"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:description');
        return m;
      },
      (el) => el.setAttribute('content', description)
    );

    upsertHeadTag(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:url');
        return m;
      },
      (el) => el.setAttribute('content', canonicalHref)
    );

    upsertHeadTag(
      'meta[name="twitter:title"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'twitter:title');
        return m;
      },
      (el) => el.setAttribute('content', title)
    );

    upsertHeadTag(
      'meta[name="twitter:description"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'twitter:description');
        return m;
      },
      (el) => el.setAttribute('content', description)
    );

    if (seo && seo.breadcrumbs.length > 0) {
      const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: seo.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `${origin}${crumb.path}`,
        })),
      };
      upsertHeadTag(
        'script#route-breadcrumb-ld',
        () => {
          const s = document.createElement('script');
          s.id = 'route-breadcrumb-ld';
          s.type = 'application/ld+json';
          return s;
        },
        (el) => {
          el.textContent = JSON.stringify(breadcrumbLd);
        }
      );
    }
  }, [currentPath]);

  const filteredProducts =
    selectedCategory === '전체'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const totalCartCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);

  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setAddedNotice(`${product.nameKo}가 셀렉션 백에 담겼습니다.`);
    window.setTimeout(() => {
      setAddedNotice((current) =>
        current === `${product.nameKo}가 셀렉션 백에 담겼습니다.` ? null : current
      );
    }, 3200);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = inquiryPhone.replace(/[^0-9]/g, '');

    if (!inquiryName.trim()) {
      setInquiryError('성함을 입력해 주세요.');
      return;
    }
    if (cleanedPhone.length < 10) {
      setInquiryError('연락 가능한 전화번호를 정확히 입력해 주세요.');
      return;
    }
    if (!inquiryMessage.trim()) {
      setInquiryError('문의하실 내용을 간략히 작성해 주세요.');
      return;
    }
    if (!inquiryAgreed) {
      setInquiryError('개인정보 수집 및 상담 안내에 동의해 주세요.');
      return;
    }

    setInquiryError('');
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F4EFE6]">
      <Header onNavigate={scrollToSection} />

      {isNotFound ? (
        <main className="min-h-[75vh] flex items-center justify-center px-6 pt-28 pb-20">
          <div className="max-w-lg w-full text-center bg-[#131110] border border-[#241E1A] p-10 rounded-sm">
            <p className="text-xs font-medium tracking-[0.2em] text-[#C8A97E] tabular-nums">
              404 NOT FOUND
            </p>
            <h1 className="font-editorial text-3xl font-semibold text-[#F4EFE6] mt-3">
              요청하신 페이지를 찾을 수 없습니다
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#B9B0A2]">
              주소가 변경되었거나 존재하지 않는 경로입니다. 정력원 메인 페이지에서
              브랜드 안내와 활력 케어 제품 정보를 확인하실 수 있습니다.
            </p>
            <div className="mt-8">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('/');
                }}
                className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors rounded-sm"
              >
                정력원 메인으로 돌아가기
              </a>
            </div>
          </div>
        </main>
      ) : (
      <main>
        {/* 1. HERO SECTION */}
        <section
          id="hero"
          className="relative pt-16 md:pt-20 overflow-hidden bg-[#0A0A0B]"
        >
          <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
            {/* Full-bleed Hero Photography with Korean middle-aged gentleman positioned on the right */}
            <div className="absolute inset-0">
              <ResilientImage
                src={IMAGES.heroGentleman}
                alt="건장하고 당당한 체형에 세련된 다크 쓰리피스 수트를 입고 서울 고급 호텔 라운지에 선 40대 한국 중년 남성 모델"
                loading="eager"
                className="w-full h-full object-cover object-[72%_20%] md:object-[68%_20%]"
                fallbackTitle="정력원"
              />
              {/* Measured contrast scrim on left and bottom so text stays >=7:1 legible without obscuring the model's face */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-[#0A0A0B]/15 md:via-[#0A0A0B]/65 md:to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]/30"
              />
            </div>

            {/* Hero Foreground Copy (strictly confined to left column, away from right-positioned subject) */}
            <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-20 lg:py-28">
              <div className="max-w-xl">
                <p className="text-xs md:text-sm font-medium tracking-[0.18em] text-[#C8A97E]">
                  정력원 · 4060 MEN&apos;S VITALITY LIFESTYLE
                </p>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-semibold leading-[1.2] text-[#F4EFE6] mt-4">
                  시간이 지나도
                  <br />
                  변하지 않는 자신감
                </h1>

                <p className="mt-6 text-base md:text-lg leading-relaxed text-[#D6CEC2] max-w-lg">
                  세월의 깊이를 품은 대한민국 중년 남성을 위한 활력 브랜드 정력원.
                  검증된 원료와 정제된 루틴으로 활력 있는 일상과 품격 있는 순간을
                  지켜나갑니다.
                </p>

                <div className="mt-10">
                  <a
                    href="https://bitmon01.shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3.5 px-10 py-4.5 md:px-12 md:py-5 text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-[#D9B882] via-[#E8CC99] to-[#C8A26A] text-[#0A0A0B] hover:brightness-105 border border-[#F3DFAF]/70 shadow-[0_12px_34px_rgba(217,184,130,0.28)] transition-all duration-200 rounded-sm cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4EFE6]"
                  >
                    <span>정력원 바로가기</span>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.25]" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Full-Width Editorial Pillar Strip below Hero */}
          <div className="border-t border-b border-[#241E1A] bg-[#0E0D0C]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#241E1A]">
                {HERO_PILLARS.map((pillar) => (
                  <div key={pillar.index} className="py-6 sm:px-6 first:sm:pl-0 last:sm:pr-0">
                    <span className="text-xs font-medium tracking-widest text-[#C8A97E] tabular-nums">
                      {pillar.index}
                    </span>
                    <h2 className="font-sans text-sm font-semibold text-[#F4EFE6] mt-1.5">
                      {pillar.title}
                    </h2>
                    <p className="text-xs leading-relaxed text-[#B9B0A2] mt-1.5">
                      {pillar.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. BRAND STORY SECTION */}
        <section id="brand" className="py-20 lg:py-28 bg-[#0A0A0B]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              {/* Brand Story Visual: Healthy Korean man in his 50s in Seoul morning sunlight */}
              <div className="lg:col-span-6 flex flex-col">
                <div className="relative flex-1 min-h-[360px] lg:min-h-[520px] overflow-hidden rounded-sm border border-[#241E1A] bg-[#131110]">
                  <ResilientImage
                    src={IMAGES.brandStoryMan}
                    alt="아침 햇살이 비치는 서울의 모던한 건축 정원을 걷는 건강하고 탄탄한 체형의 40~50대 한국 중년 남성"
                    className="w-full h-full object-cover object-top"
                    fallbackTitle="DAILY VITALITY"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#8E8578]">
                  <span>Seoul Morning Routine</span>
                  <span aria-hidden="true">·</span>
                  <span>나를 위한 건강한 선택</span>
                </div>
              </div>

              {/* Brand Story Editorial Content */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs font-medium tracking-[0.16em] text-[#C8A97E]">
                  JEONGRYEOKWON PHILOSOPHY
                </p>
                <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#F4EFE6] leading-[1.3] mt-3">
                  활력 있는 일상,
                  <br />
                  자신감 있는 라이프스타일
                </h2>
                <p className="mt-5 text-sm md:text-base leading-relaxed text-[#D6CEC2]">
                  40대 이후의 시간은 단순한 숫자가 아닌 경험과 성숙이 쌓이는
                  시기입니다. 정력원은 한국의 중년 남성이 스스로의 활력과
                  컨디션을 돌보며, 일과 휴식 모두에서 여유로운 중심을 지킬 수
                  있도록 돕는 정직한 웰니스 기준을 만듭니다.
                </p>

                <div className="mt-10 divide-y divide-[#241E1A] border-t border-b border-[#241E1A]">
                  {BRAND_PILLARS.map((item) => (
                    <div key={item.number} className="py-5">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold text-[#C8A97E] tabular-nums">
                          {item.number}
                        </span>
                        <h3 className="font-sans text-base font-semibold text-[#F4EFE6]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#B9B0A2] pl-7">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. COUPLE LIFESTYLE SECTION */}
        <section
          id="lifestyle"
          className="py-20 lg:py-28 bg-[#16120F] border-t border-b border-[#2A221D]"
        >
          <div className="max-w-6xl mx-auto px-6 space-y-20">
            {/* Section Header */}
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-[0.16em] text-[#C8A97E]">
                COUPLE LIFESTYLE
              </p>
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#F4EFE6] leading-[1.3] mt-3">
                함께하는 순간이 더욱 행복하도록
              </h2>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-[#D6CEC2]">
                스스로를 잘 돌보는 남성의 여유로움은 곁에 있는 소중한 사람과의
                시간을 더욱 따뜻하게 만듭니다. 서로를 바라보며 미소 짓는 평범한
                저녁과 여유로운 주말 아침의 품격을 담았습니다.
              </p>
            </div>

            {/* Primary Couple Split: Evening Fine Dining */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-7">
                <div className="h-full min-h-[320px] lg:min-h-[440px] overflow-hidden rounded-sm border border-[#2F2620] bg-[#0A0A0B]">
                  <ResilientImage
                    src={IMAGES.coupleEvening}
                    alt="고급스러운 다이닝 라운지에서 건강하고 당당한 체형의 한국 중년 남성과 환하게 웃는 한국 중년 여성이 함께하는 모습"
                    className="w-full h-full object-cover object-center"
                    fallbackTitle="TOGETHERNESS"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center bg-[#1D1713] border border-[#2F2620] p-8 lg:p-10 rounded-sm">
                <span className="text-xs font-medium tracking-wider text-[#C8A97E]">
                  EVENING DIALOGUE · 품격 있는 동행
                </span>
                <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-[#F4EFE6] leading-snug mt-3">
                  미소가 자연스러운
                  <br />
                  기분 좋은 저녁의 대화
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#D6CEC2]">
                  오랜 시간 함께 걸어온 배우자와 마주 앉아 나누는 가벼운 웃음과
                  진솔한 대화. 건강한 생활 리듬에서 비롯된 남성의 안정감은
                  함께하는 공간 전체에 부드럽고 편안한 온기를 더합니다.
                </p>
                <div className="mt-8 pt-6 border-t border-[#2F2620] flex items-center justify-between text-xs text-[#B9B0A2]">
                  <span>자연스러운 교감과 여유</span>
                  <span className="text-[#C8A97E]">4050 프리미엄 라이프</span>
                </div>
              </div>
            </div>

            {/* Secondary Couple Split: Weekend Morning Leisure (Reversed layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center bg-[#1D1713] border border-[#2F2620] p-8 lg:p-10 rounded-sm">
                <span className="text-xs font-medium tracking-wider text-[#C8A97E]">
                  WEEKEND LEISURE · 여유로운 주말
                </span>
                <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-[#F4EFE6] leading-snug mt-3">
                  일상의 품격이 완성되는
                  <br />
                  평온한 아침의 티타임
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#D6CEC2]">
                  주말 아침 햇살 아래 따뜻한 차 한 잔을 나누며 하루의 계획을
                  이야기하는 시간. 균형 잡힌 자기 관리와 규칙적인 휴식이 만나
                  일상 속 소소한 행복을 더욱 선명하게 만들어 줍니다.
                </p>
                <div className="mt-8 pt-6 border-t border-[#2F2620] flex items-center justify-between text-xs text-[#B9B0A2]">
                  <span>균형 있는 웰니스 습관</span>
                  <span className="text-[#C8A97E]">정력원 라이프스타일</span>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="h-full min-h-[320px] lg:min-h-[440px] overflow-hidden rounded-sm border border-[#2F2620] bg-[#0A0A0B]">
                  <ResilientImage
                    src={IMAGES.coupleMorning}
                    alt="따뜻한 햇살이 드는 거실에서 함께 차를 마시며 즐겁게 웃고 있는 50대 한국 중년 부부"
                    className="w-full h-full object-cover object-center"
                    fallbackTitle="MORNING HARMONY"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT INFORMATION & COLLECTION SECTION */}
        <section id="products" className="py-20 lg:py-28 bg-[#0A0A0B]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#241E1A]">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-[#C8A97E]">
                  VERIFIED COLLECTION
                </p>
                <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#F4EFE6] mt-3">
                  나를 위한 건강한 선택
                </h2>
                <p className="mt-2 text-sm text-[#B9B0A2]">
                  원산지와 배합 함량이 명확히 확인된 정력원의 정식 활력
                  라인업입니다.
                </p>
              </div>

              {/* Filter Tabs & Shopping Bag Trigger */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
                <div
                  role="tablist"
                  aria-label="제품 카테고리 필터"
                  className="inline-flex items-center gap-1 p-1 bg-[#131110] border border-[#241E1A] rounded-sm"
                >
                  {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#C8A97E] text-[#0A0A0B]'
                            : 'text-[#D6CEC2] hover:text-[#F4EFE6]'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#1B1512] border border-[#3B312A] hover:border-[#C8A97E] text-[#F4EFE6] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C8A97E]" aria-hidden="true" />
                  <span>셀렉션 백</span>
                  <span className="text-[#C8A97E] font-semibold tabular-nums">
                    ({totalCartCount})
                  </span>
                </button>
              </div>
            </div>

            {/* Brief Added Confirmation Bar */}
            {addedNotice && (
              <div
                role="status"
                className="mt-6 px-4 py-3 bg-[#1B1512] border border-[#C8A97E]/40 flex items-center justify-between gap-4 rounded-sm"
              >
                <div className="flex items-center gap-2.5 text-xs md:text-sm text-[#F4EFE6]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A97E] shrink-0" />
                  <span>{addedNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="text-xs font-medium text-[#C8A97E] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  셀렉션 백 열기
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col justify-between bg-[#131110] border border-[#241E1A] hover:border-[#3B312A] transition-colors duration-200 rounded-sm overflow-hidden"
                >
                  <div>
                    <div className="bg-[#0E0C0B] border-b border-[#241E1A] overflow-hidden">
                      <ResilientImage
                        src={product.image}
                        alt={product.imageAlt}
                        className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-[1.02]"
                        fallbackTitle={product.nameEn}
                      />
                    </div>

                    <div className="p-6">
                      {/* Unboxed clean metadata */}
                      <div className="flex items-center gap-2 text-xs text-[#C8A97E]">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.editionLabel}</span>
                      </div>

                      <h3 className="font-editorial text-xl font-semibold text-[#F4EFE6] mt-2">
                        {product.nameKo}
                      </h3>
                      <p className="text-xs text-[#B9B0A2] mt-1">{product.subtitle}</p>

                      <p className="mt-4 text-sm leading-relaxed text-[#D6CEC2] line-clamp-3">
                        {product.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-[#241E1A] flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#F4EFE6] font-medium tabular-nums">
                          {product.volume}
                        </span>
                        <span className="text-[#C8A97E] tabular-nums">
                          {product.dailyServing}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex items-center gap-3">
                    <a
                      href={`/products/${product.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPath(`/products/${product.id}`);
                      }}
                      className="flex-1 inline-flex items-center justify-center py-2.5 px-4 text-xs font-medium text-[#F4EFE6] border border-[#2C241E] hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
                    >
                      상세 성분 보기
                    </a>
                    <a
                      href="https://bitmon01.shop"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 inline-flex items-center justify-center py-2.5 px-4 text-xs font-medium bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
                    >
                      셀렉션 담기
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Verified Information Compliance Note */}
            <div className="mt-10 p-5 bg-[#131110] border border-[#241E1A] flex items-start gap-3 rounded-sm">
              <ShieldCheck
                className="w-5 h-5 text-[#C8A97E] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-[#B9B0A2]">
                정력원의 모든 제품은 확인된 원료 정보와 관련 법령의 표시 기준을
                준수합니다. 본 제품은 질병의 예방 및 치료를 위한 의약품이
                아니며, 균형 잡힌 식단과 규칙적인 운동을 병행하는 건강한
                라이프스타일의 보조 수단으로 섭취하시기 바랍니다.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section
          id="faq"
          className="py-20 lg:py-28 bg-[#12100E] border-t border-b border-[#241E1A]"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto">
              <p className="text-xs font-medium tracking-[0.16em] text-[#C8A97E]">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#F4EFE6] mt-3">
                자주 묻는 질문
              </h2>
              <p className="mt-3 text-sm text-[#B9B0A2]">
                제품 원료, 섭취 기준, 배송 및 상담 절차를 투명하게 안내해
                드립니다.
              </p>
            </div>

            <div className="mt-12 divide-y divide-[#241E1A] border-t border-b border-[#241E1A]">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      aria-expanded={isOpen}
                      className="w-full py-6 flex items-start justify-between gap-6 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E]"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-xs font-semibold text-[#C8A97E] tabular-nums pt-1">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <span className="block text-xs text-[#8E8578] mb-1">
                            {faq.category}
                          </span>
                          <span className="text-base font-medium text-[#F4EFE6] group-hover:text-[#C8A97E] transition-colors">
                            {faq.question}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#C8A97E] shrink-0 mt-1 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-6 pl-9 pr-6 text-sm leading-relaxed text-[#D6CEC2]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. CUSTOMER CENTER & PRIVATE CONCIERGE SECTION */}
        <section id="support" className="py-20 lg:py-28 bg-[#0A0A0B]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Customer Center Info */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-[#C8A97E]">
                    CUSTOMER CONCIERGE
                  </p>
                  <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#F4EFE6] mt-3">
                    프라이빗 고객센터
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#D6CEC2]">
                    제품 선택부터 섭취 방법, 정기 배송 및 프라이빗 기프트
                    상담까지 전문 컨시어지 팀이 1:1로 정성껏 안내해 드립니다.
                  </p>
                </div>

                <div className="space-y-5 pt-4 border-t border-[#241E1A] text-sm">
                  <div className="flex items-start gap-3.5">
                    <Phone
                      className="w-4 h-4 text-[#C8A97E] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-[#8E8578]">전담 컨시어지 직통</p>
                      <p className="text-[#F4EFE6] font-medium mt-0.5 tabular-nums">
                        02-514-8890
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock
                      className="w-4 h-4 text-[#C8A97E] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-[#8E8578]">운영 시간</p>
                      <p className="text-[#F4EFE6] mt-0.5 tabular-nums">
                        오전 09:00 – 00:00 (1년 365일 무료 상담 운영)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MapPin
                      className="w-4 h-4 text-[#C8A97E] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-[#8E8578]">정력원 본사 오피스</p>
                      <p className="text-[#F4EFE6] mt-0.5">
                        서울특별시 강남구 도곡로3길 19
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail
                      className="w-4 h-4 text-[#C8A97E] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-[#8E8578]">이메일 문의</p>
                      <p className="text-[#F4EFE6] mt-0.5">
                        Zeus@naver.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Consultation Form */}
              <div className="lg:col-span-7 bg-[#131110] border border-[#241E1A] p-7 md:p-10 rounded-sm">
                {inquirySubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <CheckCircle2 className="w-10 h-10 text-[#C8A97E] mx-auto" />
                    <h3 className="font-editorial text-2xl font-semibold text-[#F4EFE6]">
                      1:1 상담 신청이 완료되었습니다
                    </h3>
                    <p className="text-sm text-[#D6CEC2] max-w-md mx-auto leading-relaxed">
                      {inquiryName}님, 소중한 문의를 남겨주셔서 감사합니다.
                      전담 매니저가 내용 확인 후 입력하신 연락처로 신속히
                      회신드리겠습니다.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInquirySubmitted(false);
                        setInquiryName('');
                        setInquiryPhone('');
                        setInquiryMessage('');
                        setInquiryAgreed(false);
                      }}
                      className="mt-4 px-6 py-2.5 text-xs font-medium text-[#C8A97E] border border-[#C8A97E]/40 hover:border-[#C8A97E] transition-colors rounded-sm cursor-pointer"
                    >
                      추가 문의하기
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-5">
                    <h3 className="font-editorial text-xl font-semibold text-[#F4EFE6]">
                      1:1 프라이빗 상담 접수
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="inquiry-name"
                          className="block text-xs text-[#B9B0A2] mb-2"
                        >
                          성함
                        </label>
                        <input
                          id="inquiry-name"
                          type="text"
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="홍길동"
                          className="w-full px-4 py-3 text-sm bg-[#0A0A0B] border border-[#2C241E] text-[#F4EFE6] placeholder:text-[#6B6359] focus:outline-none focus:border-[#C8A97E] rounded-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="inquiry-phone"
                          className="block text-xs text-[#B9B0A2] mb-2"
                        >
                          연락처
                        </label>
                        <input
                          id="inquiry-phone"
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="010-0000-0000"
                          className="w-full px-4 py-3 text-sm bg-[#0A0A0B] border border-[#2C241E] text-[#F4EFE6] placeholder:text-[#6B6359] focus:outline-none focus:border-[#C8A97E] rounded-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-topic"
                        className="block text-xs text-[#B9B0A2] mb-2"
                      >
                        상담 분야
                      </label>
                      <select
                        id="inquiry-topic"
                        value={inquiryTopic}
                        onChange={(e) => setInquiryTopic(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#0A0A0B] border border-[#2C241E] text-[#F4EFE6] focus:outline-none focus:border-[#C8A97E] rounded-sm"
                      >
                        <option value="제품 원료 및 섭취 상담">
                          제품 원료 및 섭취 상담
                        </option>
                        <option value="기프트 에디션 및 기업 선물 문의">
                          기프트 에디션 및 기업 선물 문의
                        </option>
                        <option value="정기 배송 및 멤버십 안내">
                          정기 배송 및 멤버십 안내
                        </option>
                        <option value="서울 프라이빗 라운지 방문 예약">
                          서울 프라이빗 라운지 방문 예약
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-message"
                        className="block text-xs text-[#B9B0A2] mb-2"
                      >
                        문의 내용
                      </label>
                      <textarea
                        id="inquiry-message"
                        rows={4}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="궁금하신 제품, 섭취 루틴 또는 상담 희망 시간을 편하게 남겨주세요."
                        className="w-full px-4 py-3 text-sm bg-[#0A0A0B] border border-[#2C241E] text-[#F4EFE6] placeholder:text-[#6B6359] focus:outline-none focus:border-[#C8A97E] rounded-sm resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        id="inquiry-agree"
                        type="checkbox"
                        checked={inquiryAgreed}
                        onChange={(e) => setInquiryAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#C8A97E] cursor-pointer"
                      />
                      <label
                        htmlFor="inquiry-agree"
                        className="text-xs text-[#B9B0A2] leading-relaxed cursor-pointer"
                      >
                        상담 응대를 위한 최소한의 개인정보(성함, 연락처) 수집 및
                        이용에 동의합니다.
                      </label>
                    </div>

                    {inquiryError && (
                      <p role="alert" className="text-xs text-[#E5988B]">
                        {inquiryError}
                      </p>
                    )}

                    <a
                      href="https://bitmon01.shop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3.5 px-6 text-sm font-medium bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors duration-200 rounded-sm cursor-pointer"
                    >
                      프라이빗 상담 신청하기
                    </a>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      )}

      {/* QUIET FOOTER */}
      <footer className="bg-[#080809] border-t border-[#241E1A] py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('hero');
                }}
                className="font-editorial text-xl font-semibold tracking-[0.18em] text-[#F4EFE6] hover:text-[#C8A97E] transition-colors"
              >
                정력원
              </a>
              <p className="text-xs text-[#8E8578] mt-1.5">
                품격 있는 중년의 라이프스타일 · 시간이 지나도 변하지 않는 자신감
              </p>
            </div>

            <nav aria-label="하단 메뉴" className="flex flex-wrap items-center gap-6 text-xs text-[#B9B0A2]">
              <a
                href="/brand"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('brand');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                정력원 소개
              </a>
              <a
                href="/lifestyle"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('lifestyle');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                라이프스타일
              </a>
              <a
                href="/products"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('products');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                제품 정보
              </a>
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                FAQ
              </a>
              <a
                href="/support"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('support');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                고객센터
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('/privacy');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                개인정보처리방침
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('/terms');
                }}
                className="hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                이용약관
              </a>
            </nav>
          </div>

          <div className="pt-6 border-t border-[#1D1815] flex flex-col md:flex-row md:items-end justify-between gap-4 text-xs text-[#787066] leading-relaxed">
            <div className="space-y-1">
              <p>
                상호명 : 정력원 · 대표자 : 오찬휘 · 주소 : 서울특별시 강남구 도곡로3길 19 ·
                사업자등록번호 : 115-03-35541 · 통신판매업신고번호 : 제2018-서울강남-0884
              </p>
              <p>
                본 사이트에 소개된 제품은 질병의 예방 및 치료를 위한 의약품이
                아닙니다. 개인의 건강 상태에 따라 전문가와 상담 후 섭취하시기
                바랍니다.
              </p>
            </div>
            <p className="shrink-0 tabular-nums">
              © {new Date().getFullYear()} 정력원. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => navigateToPath('/products', 'products')}
        onAddToCart={handleAddToCart}
      />

      <LegalModal
        type={activeLegalPage}
        onClose={() => navigateToPath('/')}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
