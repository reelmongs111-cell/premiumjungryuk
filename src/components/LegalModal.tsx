import { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!type) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#131110] border border-[#2C241E] rounded-sm shadow-2xl my-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="법적 고지 창 닫기"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-[#0A0A0B]/80 border border-[#2C241E] text-[#F4EFE6] hover:text-[#C8A97E] transition-colors cursor-pointer rounded-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <nav
          aria-label="현재 위치"
          className="flex items-center gap-2 text-xs text-[#C8A97E]"
        >
          <span>홈</span>
          <span aria-hidden="true">/</span>
          <span>{isPrivacy ? '개인정보처리방침' : '이용약관'}</span>
        </nav>

        <h1
          id="legal-modal-title"
          className="font-editorial text-2xl md:text-3xl font-semibold text-[#F4EFE6] mt-2 pb-4 border-b border-[#241E1A]"
        >
          {isPrivacy ? '개인정보처리방침' : '이용약관'}
        </h1>

        <div className="mt-5 space-y-5 text-sm leading-relaxed text-[#D6CEC2] max-h-[60vh] overflow-y-auto pr-1">
          {isPrivacy ? (
            <>
              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  1. 개인정보의 수집 및 이용 목적
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  정력원(대표자: 오찬휘)은 1:1 프라이빗 상담 응대, 제품 문의 회신,
                  안심 배송 일정 안내 등 이용자가 요청한 고객지원 서비스 제공을
                  위해서만 최소한의 개인정보를 수집 및 이용합니다.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  2. 수집하는 개인정보 항목
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  상담 신청 및 셀렉션 예약 시 성함, 연락처, 문의 내용 등 서비스
                  응대에 필요한 최소 항목만을 이용자의 명시적 동의하에 수집합니다.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  3. 보유 기간 및 파기 절차
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  수집된 개인정보는 상담 및 배송 안내 목적 달성 후 관련 법령에 따른
                  보존 의무 기간을 제외하고 지체 없이 안전한 방법으로 파기합니다.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  4. 개인정보 보호책임자 및 문의처
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  상호명: 정력원 · 대표자: 오찬휘 · 주소: 서울특별시 강남구 도곡로3길 19 ·
                  이메일: Zeus@naver.com · 직통: 02-514-8890
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  제1조 (목적)
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  본 약관은 정력원(이하 &quot;회사&quot;)이 운영하는 공식 웹사이트에서
                  제공하는 제품 정보 열람, 1:1 프라이빗 상담 및 관련 안내 서비스의
                  이용 조건과 절차를 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  제2조 (제품 정보 및 섭취 유의사항)
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  본 사이트에 소개되는 제품은 질병의 예방 및 치료를 위한 의약품이
                  아닌 건강기능식품 및 가공식품입니다. 개인의 체질 및 복용 중인
                  의약품에 따라 섭취 전 전문가와 상담하시기 바랍니다.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  제3조 (교환, 반품 및 고객센터)
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  제품 수령 후 14일 이내 미개봉 상태의 경우 교환 및 반품 안내가
                  가능하며, 연중무휴 365일 고객센터(오전 09:00 – 00:00, 02-514-8890)를
                  통해 접수하실 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-[#F4EFE6] mb-1.5">
                  제4조 (지식재산권)
                </h2>
                <p className="text-xs md:text-sm text-[#B9B0A2]">
                  사이트 내 모든 브랜드 상표, 텍스트, 이미지 및 디자인 자산에 대한
                  권리는 정력원에 귀속되며 무단 복제 및 상업적 도용을 금합니다.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#241E1A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors rounded-sm cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
