import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../data/brandData';
import { ResilientImage } from './ResilientImage';

export interface CartEntry {
  product: ProductItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartEntry[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderCompleted, setOrderCompleted] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, entry) => sum + entry.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!customerName.trim()) {
      setFormError('성함을 입력해 주세요.');
      return;
    }
    if (cleanedPhone.length < 10) {
      setFormError('연락 가능한 휴대폰 번호를 정확히 입력해 주세요.');
      return;
    }
    setFormError('');
    const orderNumber = `JRW-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setOrderCompleted(orderNumber);
    onClearCart();
  };

  const handleCloseDrawer = () => {
    setOrderCompleted(null);
    setFormError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="쇼핑백 및 주문 예약"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={handleCloseDrawer}
    >
      <div
        className="w-full max-w-md bg-[#131110] border-l border-[#2C241E] h-full flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#241E1A] flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-xl font-semibold text-[#F4EFE6]">
              셀렉션 백
            </h3>
            <p className="text-xs text-[#B9B0A2] mt-0.5 tabular-nums">
              선택하신 제품 {items.reduce((acc, item) => acc + item.quantity, 0)}건
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="쇼핑백 닫기"
            className="w-10 h-10 flex items-center justify-center text-[#D6CEC2] hover:text-[#C8A97E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {orderCompleted ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-[#C8A97E] mx-auto" />
              <h4 className="font-editorial text-xl font-semibold text-[#F4EFE6]">
                프라이빗 주문 예약이 접수되었습니다
              </h4>
              <p className="text-sm text-[#D6CEC2] leading-relaxed">
                예약 번호 <span className="text-[#C8A97E] font-medium tabular-nums">{orderCompleted}</span>로
                접수되었으며, 영업시간 기준 1시간 이내에 전담 컨시어지가 맞춤 상담 및 안심 배송 일정을 안내해 드립니다.
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="mt-4 px-6 py-2.5 text-sm font-medium bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors rounded-sm cursor-pointer"
              >
                확인
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-[#B9B0A2]">
                현재 셀렉션 백에 담긴 제품이 없습니다.
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-5 py-2 text-xs font-medium text-[#C8A97E] border border-[#C8A97E]/40 hover:border-[#C8A97E] transition-colors rounded-sm cursor-pointer"
              >
                제품 컬렉션 둘러보기
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-5 border-b border-[#241E1A]"
                >
                  <ResilientImage
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-20 h-20 object-cover rounded-sm shrink-0 bg-[#0A0A0B]"
                    fallbackTitle={product.nameKo}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#F4EFE6] truncate">
                          {product.nameKo}
                        </p>
                        <p className="text-xs text-[#B9B0A2] mt-0.5">
                          {product.volume}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`${product.nameKo} 삭제`}
                        className="text-[#8E8578] hover:text-[#F4EFE6] p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#2C241E] bg-[#0A0A0B] rounded-sm">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label="수량 감소"
                          className="w-8 h-8 flex items-center justify-center text-[#D6CEC2] hover:text-[#C8A97E] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-medium text-[#F4EFE6] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label="수량 증가"
                          className="w-8 h-8 flex items-center justify-center text-[#D6CEC2] hover:text-[#C8A97E] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs text-[#C8A97E]">
                        {product.editionLabel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Reservation */}
        {items.length > 0 && !orderCompleted && (
          <form
            onSubmit={handleSubmitOrder}
            className="px-6 py-5 bg-[#0E0C0B] border-t border-[#241E1A] space-y-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#B9B0A2]">
                선택하신 제품 총 <span className="text-[#F4EFE6] font-medium tabular-nums">{totalCount}</span>건
              </span>
              <span className="text-xs font-medium text-[#C8A97E]">
                무료 안심 배송 · 1:1 안내
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <input
                type="text"
                placeholder="성함"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#16120F] border border-[#2C241E] text-[#F4EFE6] placeholder:text-[#787066] focus:outline-none focus:border-[#C8A97E] rounded-sm"
              />
              <input
                type="tel"
                placeholder="연락처 (예: 010-1234-5678)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#16120F] border border-[#2C241E] text-[#F4EFE6] placeholder:text-[#787066] focus:outline-none focus:border-[#C8A97E] rounded-sm"
              />
            </div>

            {formError && (
              <p className="text-xs text-[#E5988B]">{formError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-5 text-sm font-medium bg-[#C8A97E] text-[#0A0A0B] hover:bg-[#DEC198] transition-colors rounded-sm cursor-pointer"
            >
              프라이빗 주문·상담 신청하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
