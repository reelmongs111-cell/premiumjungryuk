export interface ProductItem {
  id: string;
  category: '활력 케어' | '데일리 밸런스' | '기프트 에디션';
  editionLabel: string;
  nameKo: string;
  nameEn: string;
  subtitle: string;
  volume: string;
  dailyServing: string;
  image: string;
  imageAlt: string;
  description: string;
  verifiedIngredients: {
    name: string;
    amount: string;
    origin: string;
  }[];
  qualityStandards: string[];
  disclaimer: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const IMAGES = {
  heroGentleman: '/src/assets/images/hero_korean_gentleman_fit_1795566944337.jpg',
  brandStoryMan: '/src/assets/images/brand_story_vitality_fit_1795566944889.jpg',
  coupleEvening: '/src/assets/images/couple_lifestyle_fit_1795566945462.jpg',
  coupleMorning: '/src/assets/images/couple_morning_leisure_1795565594049.jpg',
  productStudio: '/src/assets/images/product_vitality_elixir_1795565594639.jpg',
} as const;

export const HERO_PILLARS = [
  {
    index: '01',
    title: '4060 중년 남성 활력 설계',
    detail: '대한민국 중년 남성의 생체 리듬과 기초 체력을 고려한 정력원 포뮬러',
  },
  {
    index: '02',
    title: '투명한 원료 기준',
    detail: '원산지와 함량이 확인된 엄선 원료만을 정직하게 배합',
  },
  {
    index: '03',
    title: '365일 프라이빗 상담',
    detail: '섭취 가이드부터 안심 배송까지 전담 매니저의 연중무휴 케어',
  },
  {
    index: '04',
    title: '절제된 품격의 패키지',
    detail: '블랙 글라스와 샴페인 골드 마감의 소장 가치 있는 디자인',
  },
] as const;

export const BRAND_PILLARS = [
  {
    number: '01.',
    title: '활력 있는 일상, 자신감 있는 라이프스타일',
    description:
      '정력원이 지향하는 중년의 품격은 겉으로 드러나는 스타일을 넘어 매일의 건강한 활력에서 시작됩니다. 바쁜 비즈니스와 일상 속에서도 흔들리지 않는 컨디션 관리 기준을 제안합니다.',
  },
  {
    number: '02.',
    title: '나를 위한 건강한 선택',
    description:
      '과장된 문구나 확인되지 않은 성분을 배제하고, 국내산 6년근 홍삼 농축액, 아연, 비타민 B군 등 영양학적 근거가 명확한 원료만을 정직한 함량으로 담았습니다.',
  },
  {
    number: '03.',
    title: '품격 있는 중년의 루틴',
    description:
      '아침의 가벼운 산책과 규칙적인 수분 섭취, 그리고 하루 1회 정돈된 정력원 활력 루틴이 모여 시간이 지나도 변하지 않는 단단한 자신감을 완성합니다.',
  },
] as const;

export const PRODUCTS: ProductItem[] = [
  {
    id: 'jeongryeokwon-black-elixir',
    category: '활력 케어',
    editionLabel: '정력원 시그니처',
    nameKo: '정력원 블랙 리저브 엘릭서',
    nameEn: 'Jeongryeokwon Black Elixir',
    subtitle: '6년근 홍삼 농축액 · 아연 · L-아르기닌 데일리 캡슐',
    volume: '60캡슐 (500mg × 60)',
    dailyServing: '1일 1회, 1회 2캡슐 (30일분)',
    image: IMAGES.productStudio,
    imageAlt: '정력원 블랙 리저브 엘릭서 매트 블랙 글라스 보틀과 다크 브라운 패키지',
    description:
      '대한민국 40~60대 남성의 일상적인 활력과 정상적인 면역 기능 유지에 도움을 줄 수 있는 아연, 피로 개선에 도움을 줄 수 있는 6년근 홍삼 농축 분말을 중심으로 설계한 정력원의 대표 데일리 케어 제품입니다.',
    verifiedIngredients: [
      { name: '6년근 홍삼 농축분말 (진세노사이드 Rg1+Rb1+Rg3 합 10mg)', amount: '350mg', origin: '대한민국 금산' },
      { name: '글루콘산 아연 (아연 기준)', amount: '12mg (141%)', origin: '프랑스산' },
      { name: 'L-아르기닌 (부원료)', amount: '400mg', origin: '국내 정제' },
      { name: '비타민 B1 · B2 · B6 복합', amount: '1일 권장량 100%', origin: '유럽산' },
    ],
    qualityStandards: [
      '식품의약품안전처 우수건강기능식품제조기준(GMP) 인증 시설 제조',
      '이산화규소·스테아린산마그네슘 등 불필요한 부형제 최소화',
      '자외선 차단 매트 블랙 글라스 용기 적용',
    ],
    disclaimer:
      '본 제품은 질병의 예방 및 치료를 위한 의약품이 아니며, 개인의 체질 및 건강 상태에 따라 반응이 다를 수 있습니다.',
  },
  {
    id: 'jeongryeokwon-gold-balance',
    category: '데일리 밸런스',
    editionLabel: '기초 활력 케어',
    nameKo: '정력원 골드 밸런스 데일리',
    nameEn: 'Jeongryeokwon Gold Balance',
    subtitle: '옥타코사놀 · 마카 추출분말 · 비타민 D3 복합 설계',
    volume: '60정 (600mg × 60)',
    dailyServing: '1일 1회, 1회 2정 (30일분)',
    image: IMAGES.productStudio,
    imageAlt: '정력원 골드 밸런스 데일리 프리미엄 남성 영양 보충제 패키지',
    description:
      '골프, 등산, 테니스 등 활동적인 중년 라이프스타일을 즐기는 분들을 위해 지구력 증진에 도움을 줄 수 있는 옥타코사놀과 뼈 건강을 위한 비타민 D3를 조화롭게 배합했습니다.',
    verifiedIngredients: [
      { name: '옥타코사놀 (쌀겨 유래)', amount: '20mg', origin: '미국산' },
      { name: '비타민 D3', amount: '1,000 IU (250%)', origin: '스위스산' },
      { name: '페루산 블랙 마카 추출분말 (부원료)', amount: '250mg', origin: '페루 안데스' },
      { name: '판토텐산 · 나이아신', amount: '1일 권장량 100%', origin: '영국산' },
    ],
    qualityStandards: [
      '원료별 중금속 및 잔류농약 정밀 검사 완료',
      '개별 위생 블리스터 포장 및 습기 차단 설계',
      '국내 공인 시험기관 영양성분 함량 검증 완료',
    ],
    disclaimer:
      '본 제품은 질병의 예방 및 치료를 위한 의약품이 아닙니다. 특정 성분 알레르기가 있는 경우 원재료명을 확인하시기 바랍니다.',
  },
  {
    id: 'jeongryeokwon-signature-duo',
    category: '기프트 에디션',
    editionLabel: '스페셜 리저브',
    nameKo: '정력원 시그니처 듀오 세트',
    nameEn: 'Jeongryeokwon Signature Duo Set',
    subtitle: '블랙 리저브 엘릭서 + 골드 밸런스 데일리 + 기프트 케이스',
    volume: '2종 본품 구성 (각 30일분)',
    dailyServing: '아침·저녁 데일리 활력 루틴 가이드 포함',
    image: IMAGES.productStudio,
    imageAlt: '정력원 시그니처 듀오 기프트 에디션 고급 포장 세트',
    description:
      '스스로를 위한 60일 집중 활력 관리 또는 소중한 배우자·지인에게 감사의 마음을 전하기에 알맞은 정력원 프리미엄 선물 세트입니다. 샴페인 골드 각인 기프트 박스와 메시지 카드가 함께 제공됩니다.',
    verifiedIngredients: [
      { name: '정력원 블랙 리저브 엘릭서 본품 (60캡슐)', amount: '1 Box', origin: 'GMP 인증 국내 제조' },
      { name: '정력원 골드 밸런스 데일리 본품 (60정)', amount: '1 Box', origin: 'GMP 인증 국내 제조' },
      { name: '전용 월넛 트레이 & 메탈 스푼 (증정)', amount: '1 Set', origin: '서울 스튜디오 제작' },
    ],
    qualityStandards: [
      '프리미엄 딥 브라운 하드 케이스 & 샴페인 골드 실링',
      '전용 쇼핑백 및 맞춤형 감사 카드 동봉',
      '전담 컨시어지 안심 발송 및 선물 포장 무료 지원',
    ],
    disclaimer:
      '본 제품은 건강기능식품 및 가공식품 세트이며 의약품이 아닙니다. 섭취량 및 섭취 방법을 준수해 주십시오.',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: '원료 및 품질',
    question: '정력원 제품에 사용된 원료의 출처와 안전성은 어떻게 검증되나요?',
    answer:
      '정력원의 모든 제품은 식품의약품안전처 우수건강기능식품제조기준(GMP) 인증을 받은 국내 전문 제조 시설에서 생산됩니다. 국내산 6년근 홍삼, 프랑스산 글루콘산 아연, 스위스산 비타민 등 원산지와 시험 성적서가 확인된 정품 원료만을 사용하며, 제품 상세 정보에서 함량과 원산지를 투명하게 확인하실 수 있습니다.',
  },
  {
    id: 'faq-2',
    category: '섭취 방법',
    question: '하루 중 언제 섭취하는 것이 가장 좋으며, 섭취 기간은 어느 정도가 권장되나요?',
    answer:
      '식사 직후 충분한 물과 함께 1일 1회 정량(2캡슐 또는 2정)을 섭취하시는 것을 권장합니다. 위장이 예민하신 분은 가급적 아침 또는 점심 식후에 드시는 편이 편안합니다. 규칙적인 생활 습관과 함께 최소 8주 이상 일관된 루틴을 유지하시는 것을 추천해 드립니다.',
  },
  {
    id: 'faq-3',
    category: '건강 상담',
    question: '혈압약이나 당뇨약 등 기존 복용 중인 의약품이 있어도 섭취 가능한가요?',
    answer:
      '본 제품은 질병의 예방 및 치료를 위한 의약품이 아닌 건강기능식품입니다. 홍삼 및 일부 기능성 원료는 혈액항응고제나 혈당강하제 등 특정 의약품과 상호작용할 수 있으므로, 기저질환으로 치료 중이시거나 약물을 복용 중이신 경우에는 섭취 전 반드시 담당 의사 또는 약사와 상담하시기 바랍니다.',
  },
  {
    id: 'faq-4',
    category: '배송 및 포장',
    question: '배송 시 프라이버시 보호 및 선물 포장이 지원되나요?',
    answer:
      '네, 모든 주문 건은 외부에서 내용물을 유추할 수 없는 무지 이중 안전 박스로 깔끔하게 발송됩니다. 또한 시그니처 듀오 세트 및 별도 요청 시 품격 있는 다크 브라운 기프트 패키징과 감사 메시지 카드가 무료로 동봉됩니다.',
  },
  {
    id: 'faq-5',
    category: '상담 및 환불',
    question: '365일 상담 운영 시간과 미개봉 제품 교환·환불 규정은 어떻게 되나요?',
    answer:
      '정력원 전담 고객센터(오전 09:00 – 00:00, 연중무휴 365일 무료 상담)를 통해 제품 상담 및 정기 배송 변경을 간편하게 안내받으실 수 있습니다. 제품 수령 후 14일 이내 미개봉 상태의 경우 100% 교환 및 반품이 가능합니다.',
  },
];
