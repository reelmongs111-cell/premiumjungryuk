import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'brand', label: '정력원 소개' },
  { id: 'lifestyle', label: '라이프스타일' },
  { id: 'products', label: '제품 정보' },
  { id: 'faq', label: 'FAQ' },
  { id: 'support', label: '고객센터' },
] as const;

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0B]/88 backdrop-blur-md border-b border-[#241E1A]">
      <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line gold-framed brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('hero');
          }}
          className="inline-flex items-center justify-center px-3.5 py-1 md:px-5 md:py-1.5 border-[1.5px] border-[#D8B46A] ring-1 ring-inset ring-[#F3DCA2]/25 bg-gradient-to-b from-[#1E1811] to-[#0C0A08] shadow-[0_0_18px_rgba(216,180,106,0.22)] font-editorial text-xl sm:text-2xl md:text-[26px] font-bold tracking-[0.2em] indent-[0.1em] text-[#ECCB86] hover:border-[#F2D596] hover:text-[#F7DFA4] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECCB86] rounded-sm"
        >
          정력원
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav aria-label="주요 메뉴" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.id);
              }}
              className="text-sm font-medium text-[#D6CEC2] hover:text-[#C8A97E] transition-colors duration-200 border-b border-transparent hover:border-[#C8A97E] py-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <a
            href="https://bitmon01.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold bg-[#D4B072] text-[#0A0A0B] hover:bg-[#E7C88E] transition-colors duration-200 rounded-sm whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4EFE6]"
          >
            정력원 바로가기
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#F4EFE6] hover:text-[#C8A97E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97E] rounded-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile responsive drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131110] border-t border-[#241E1A] px-6 py-5 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.id);
              }}
              className="block py-3 text-base font-medium text-[#F4EFE6] hover:text-[#C8A97E] border-b border-[#241E1A]/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4">
            <a
              href="https://bitmon01.shop"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-3 px-5 text-sm font-semibold bg-[#D4B072] text-[#0A0A0B] hover:bg-[#E7C88E] transition-colors rounded-sm cursor-pointer"
            >
              정력원 바로가기
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
