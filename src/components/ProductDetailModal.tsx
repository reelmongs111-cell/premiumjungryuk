import { useEffect } from 'react';
import { X, Check, ShieldCheck } from 'lucide-react';
import { ProductItem } from '../data/brandData';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#131110] border border-[#2C241E] rounded-sm overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="제품 상세 정보 닫기"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#0A0A0B]/80 border border-[#2C241E] text-[#F4EFE6] hover:text-[#C8A97E] transition-colors cursor-pointer rounded-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Image Column */}
          <div className="md:col-span-5 bg-[#0A0A0B] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#241E1A]">
            <ResilientImage
              src={product.image}
              alt={product.imageAlt}
              className="w-full aspect-square object-cover rounded-sm"
              fallbackTitle={product.nameEn}
            />
          </div>

          {/* Specifications Column */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <nav
                aria-label="제품 경로"
                className="flex items-center gap-1.5 text-[11px] text-[#8E8578] mb-2"
              >
                <span>홈</span>
                <span aria-hidden="true">/</span>
                <span>제품 정보</span>
                <span aria-hidden="true">/</span>
                <span className="text-[#C8A97E]">{product.nameKo}</span>
              </nav>

              <div className="flex items-center gap-2 text-xs text-[#C8A97E] tracking-wide">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.editionLabel}</span>
              </div>

              <h3
                id="product-modal-title"
                className="font-editorial text-2xl md:text-3xl font-semibold text-[#F4EFE6] mt-2"
              >
                {product.nameKo}
              </h3>
              <p className="text-sm text-[#B9B0A2] mt-1">{product.subtitle}</p>

              <div className="mt-5 pb-5 border-b border-[#241E1A] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#F4EFE6] font-medium tabular-nums">
                  {product.volume}
                </span>
                <span className="text-[#C8A97E] tabular-nums">
                  {product.dailyServing}
                </span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[#D6CEC2]">
                {product.description}
              </p>

              {/* Verified Ingredients Table */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold tracking-wider text-[#C8A97E] mb-3">
                  확인된 주요 원료 및 배합 정보
                </h4>
                <div className="border border-[#241E1A] divide-y divide-[#241E1A] bg-[#0E0C0B]">
                  {product.verifiedIngredients.map((item) => (
                    <div
                      key={item.name}
                      className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs"
                    >
                      <span className="text-[#F4EFE6] font-medium">{item.name}</span>
                      <div className="flex items-center gap-2 text-[#B9B0A2] tabular-nums shrink-0">
                        <span className="text-[#C8A97E] font-medium">{item.amount}</span>
                        <span aria-hidden="true">/</span>
                        <span>{item.origin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Standards */}
              <div className="mt-5 space-y-2">
                {product.qualityStandards.map((std) => (
                  <div key={std} className="flex items-start gap-2.5 text-xs text-[#D6CEC2]">
                    <Check className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{std}</span>
                  </div>
                ))}
              </div>

              {/* Verified Legal Disclaimer */}
              <div className="mt-5 p-3.5 bg-[#1B1512] border border-[#2C241E] flex items-start gap-2.5 text-xs text-[#B9B0A2] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{product.disclaimer}</span>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-[#241E1A] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-[#D6CEC2] border border-[#2C241E] hover:border-[#C8A97E] hover:text-[#F4EFE6] transition-colors rounded-sm cursor-pointer"
              >
                닫기
              </button>
              <a
                href="https://bitmon01.shop"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors rounded-sm cursor-pointer"
              >
                셀렉션 담기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
