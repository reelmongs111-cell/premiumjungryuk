import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = '정력원',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1B1512] via-[#120F0E] to-[#0A0A0B] border border-[#2C241E] p-6 text-center ${className}`}
      >
        <Sparkles className="w-6 h-6 text-[#C8A97E] mb-3 opacity-80" aria-hidden="true" />
        <span className="font-editorial text-sm tracking-widest text-[#C8A97E]">
          {fallbackTitle}
        </span>
        <span className="mt-1 text-xs text-[#B9B0A2] max-w-xs">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
