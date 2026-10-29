import React from 'react';

interface PandaMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'waving' | 'reading' | 'celebrating';
  speech?: string;
  onClick?: () => void;
  className?: string;
}

export const PandaMascot: React.FC<PandaMascotProps> = ({
  size = 'md',
  expression = 'happy',
  speech,
  onClick,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Speech Bubble */}
      {speech && (
        <div className="mb-2 px-3 py-1.5 bg-white border-2 border-amber-300 rounded-2xl shadow-md text-slate-800 text-xs sm:text-sm font-semibold max-w-xs text-center relative animate-bounce">
          {speech}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}

      {/* SVG Cartoon Panda */}
      <svg
        viewBox="0 0 200 200"
        className={`${sizeMap[size]} filter drop-shadow-md transition-transform active:scale-95`}
      >
        <defs>
          <linearGradient id="pandaCheek" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FF80AB" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#FF4081" stop-opacity="0.5" />
          </linearGradient>
          <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFD54F" />
            <stop offset="100%" stop-color="#FFB300" />
          </linearGradient>
        </defs>

        {/* Ears */}
        <circle cx="55" cy="55" r="26" fill="#1E293B" />
        <circle cx="55" cy="55" r="14" fill="#FF80AB" opacity="0.6" />
        <circle cx="145" cy="55" r="26" fill="#1E293B" />
        <circle cx="145" cy="55" r="14" fill="#FF80AB" opacity="0.6" />

        {/* Body */}
        <ellipse cx="100" cy="155" rx="55" ry="42" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3" />
        <ellipse cx="100" cy="158" rx="42" ry="32" fill="#F8FAFC" />

        {/* Little Feet */}
        <ellipse cx="65" cy="180" rx="20" ry="14" fill="#1E293B" />
        <ellipse cx="135" cy="180" rx="20" ry="14" fill="#1E293B" />
        <circle cx="65" cy="180" r="6" fill="#FF80AB" opacity="0.5" />
        <circle cx="135" cy="180" r="6" fill="#FF80AB" opacity="0.5" />

        {/* Paws */}
        {expression === 'waving' ? (
          <>
            <ellipse cx="45" cy="140" rx="16" ry="14" fill="#1E293B" />
            {/* Raised waving paw */}
            <g className="origin-[150px_130px] animate-pulse">
              <ellipse cx="160" cy="105" rx="16" ry="18" fill="#1E293B" transform="rotate(30 160 105)" />
              <circle cx="160" cy="105" r="5" fill="#FF80AB" />
            </g>
          </>
        ) : expression === 'reading' ? (
          <>
            {/* Holding colorful book */}
            <ellipse cx="60" cy="142" rx="14" ry="12" fill="#1E293B" />
            <ellipse cx="140" cy="142" rx="14" ry="12" fill="#1E293B" />
            {/* Open Book in center */}
            <rect x="75" y="130" width="24" height="28" rx="3" fill="#4FC3F7" transform="rotate(-6 85 140)" />
            <rect x="100" y="130" width="24" height="28" rx="3" fill="#81C784" transform="rotate(6 110 140)" />
            <line x1="80" y1="138" x2="94" y2="137" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
            <line x1="80" y1="144" x2="94" y2="143" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
            <line x1="106" y1="137" x2="120" y2="138" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
            <line x1="106" y1="143" x2="120" y2="144" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
            <text x="82" y="152" font-size="8" font-weight="bold" fill="#FFFFFF">ABC</text>
            <text x="108" y="152" font-size="8" font-weight="bold" fill="#FFFFFF">123</text>
          </>
        ) : (
          <>
            <ellipse cx="50" cy="142" rx="16" ry="14" fill="#1E293B" />
            <ellipse cx="150" cy="142" rx="16" ry="14" fill="#1E293B" />
          </>
        )}

        {/* Head */}
        <ellipse cx="100" cy="100" rx="64" ry="54" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3" />

        {/* Eye Patches */}
        <ellipse cx="76" cy="95" rx="18" ry="22" fill="#1E293B" transform="rotate(-15 76 95)" />
        <ellipse cx="124" cy="95" rx="18" ry="22" fill="#1E293B" transform="rotate(15 124 95)" />

        {/* Big Sparkling Eyes */}
        <circle cx="80" cy="93" r="8" fill="#FFFFFF" />
        <circle cx="82" cy="92" r="4" fill="#1E293B" />
        <circle cx="78" cy="90" r="2" fill="#FFFFFF" />

        <circle cx="120" cy="93" r="8" fill="#FFFFFF" />
        <circle cx="118" cy="92" r="4" fill="#1E293B" />
        <circle cx="122" cy="90" r="2" fill="#FFFFFF" />

        {/* Cute Cheeks */}
        <ellipse cx="56" cy="112" rx="10" ry="6" fill="url(#pandaCheek)" />
        <ellipse cx="144" cy="112" rx="10" ry="6" fill="url(#pandaCheek)" />

        {/* Nose and Smile */}
        <ellipse cx="100" cy="110" rx="9" ry="6" fill="#1E293B" />
        <path
          d="M 100 116 Q 100 124 93 124 Q 85 124 86 117"
          fill="none"
          stroke="#1E293B"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M 100 116 Q 100 124 107 124 Q 115 124 114 117"
          fill="none"
          stroke="#1E293B"
          stroke-width="3"
          stroke-linecap="round"
        />

        {/* Open happy smile tongue */}
        <path
          d="M 94 122 Q 100 132 106 122 Z"
          fill="#FF4081"
        />

        {/* Graduation cap or star badge */}
        <polygon points="100,32 135,46 100,58 65,46" fill="url(#goldCap)" stroke="#FFA000" stroke-width="1.5" />
        <polygon points="100,58 135,46 135,52 100,64" fill="#FFA000" />
        <circle cx="100" cy="45" r="3" fill="#D97706" />
        <line x1="100" y1="46" x2="135" y2="58" stroke="#EF4444" stroke-width="2" />
        <circle cx="135" cy="58" r="3.5" fill="#EF4444" />
      </svg>
    </div>
  );
};
