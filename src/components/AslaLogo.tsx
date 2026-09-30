import React, { useState } from 'react';
import aslaOfficialCrestImg from '../assets/images/asla_official_crest_logo_1790721777624.jpg';

export interface AslaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  subtitle?: string;
  showText?: boolean;
  className?: string;
}

export const AslaCrestVector: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    {/* Outer Shield Crest Base */}
    <path
      d="M60,6 L104,22 L104,60 C104,88 84,106 60,114 C36,106 16,88 16,60 L16,22 Z"
      fill="#FFFFFF"
      stroke="#0B3B75"
      strokeWidth="4"
    />
    <path
      d="M60,12 L98,26 L98,59 C98,83 80,99 60,107 C40,99 22,83 22,59 L22,26 Z"
      fill="#F8FAFC"
      stroke="#FACC15"
      strokeWidth="2.5"
    />

    {/* Graduation Cap */}
    <polygon points="60,15 30,28 60,41 90,28" fill="#0B3B75" />
    <path d="M42,35 L42,45 C42,50 78,50 78,45 L78,35" fill="#0B3B75" />
    {/* Gold Tassel */}
    <path d="M82,31 L86,42" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
    <circle cx="86" cy="44" r="2.8" fill="#FACC15" />

    {/* Left Laurel Wreath */}
    <path
      d="M28,54 C24,68 29,85 46,94"
      fill="none"
      stroke="#0B3B75"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <ellipse cx="25" cy="58" rx="3" ry="5" transform="rotate(-25 25 58)" fill="#0B3B75" />
    <ellipse cx="25" cy="69" rx="3" ry="5" transform="rotate(-12 25 69)" fill="#0B3B75" />
    <ellipse cx="29" cy="79" rx="3" ry="5" transform="rotate(8 29 79)" fill="#0B3B75" />
    <ellipse cx="36" cy="88" rx="3" ry="5" transform="rotate(25 36 88)" fill="#0B3B75" />

    {/* Right Laurel Wreath */}
    <path
      d="M92,54 C96,68 91,85 74,94"
      fill="none"
      stroke="#0B3B75"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <ellipse cx="95" cy="58" rx="3" ry="5" transform="rotate(25 95 58)" fill="#0B3B75" />
    <ellipse cx="95" cy="69" rx="3" ry="5" transform="rotate(12 95 69)" fill="#0B3B75" />
    <ellipse cx="91" cy="79" rx="3" ry="5" transform="rotate(-8 91 79)" fill="#0B3B75" />
    <ellipse cx="84" cy="88" rx="3" ry="5" transform="rotate(-25 84 88)" fill="#0B3B75" />

    {/* Golden Open Book */}
    <path
      d="M34,56 Q47,51 60,58 Q73,51 86,56 L86,83 Q73,78 60,85 Q47,78 34,83 Z"
      fill="#FACC15"
      stroke="#0B3B75"
      strokeWidth="2.5"
    />
    <line x1="60" y1="58" x2="60" y2="85" stroke="#0B3B75" strokeWidth="2.5" />
    <path d="M39,64 Q49,61 55,65" fill="none" stroke="#0B3B75" strokeWidth="1.8" />
    <path d="M39,71 Q49,68 55,72" fill="none" stroke="#0B3B75" strokeWidth="1.8" />
    <path d="M81,64 Q71,61 65,65" fill="none" stroke="#0B3B75" strokeWidth="1.8" />
    <path d="M81,71 Q71,68 65,72" fill="none" stroke="#0B3B75" strokeWidth="1.8" />

    {/* Green Palm Tree in Center of Book */}
    <path d="M60,56 L60,76" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M60,56 Q51,49 46,55" fill="none" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M60,56 Q69,49 74,55" fill="none" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M60,53 Q54,45 50,49" fill="none" stroke="#15803D" strokeWidth="2.3" strokeLinecap="round" />
    <path d="M60,53 Q66,45 70,49" fill="none" stroke="#15803D" strokeWidth="2.3" strokeLinecap="round" />

    {/* Bottom Ribbon */}
    <path
      d="M38,93 Q60,101 82,93"
      fill="none"
      stroke="#0B3B75"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const AslaLogo: React.FC<AslaLogoProps> = ({
  size = 'md',
  theme = 'light',
  subtitle = 'Aprantisaj se lò Akademi',
  showText = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const badgeSizeClasses = {
    sm: 'w-10 h-10 rounded-xl p-0.5',
    md: 'w-12 h-12 rounded-xl p-1',
    lg: 'w-16 h-16 rounded-2xl p-1',
    xl: 'w-20 h-20 rounded-2xl p-1.5',
  }[size];

  const titleClasses = {
    sm: 'text-sm sm:text-base font-black tracking-tight leading-tight',
    md: 'text-base sm:text-lg font-black tracking-tight leading-tight',
    lg: 'text-xl sm:text-2xl font-black tracking-tight leading-tight',
    xl: 'text-2xl sm:text-3xl font-black tracking-tight leading-tight',
  }[size];

  const subtitleClasses = {
    sm: 'text-[10px] font-bold tracking-wide mt-0.5',
    md: 'text-[11px] font-bold tracking-wide mt-0.5',
    lg: 'text-xs sm:text-sm font-bold tracking-wide mt-1',
    xl: 'text-xs sm:text-sm font-bold tracking-wide mt-1',
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-[#0B3B75]';
  const subTextColor = theme === 'dark' ? 'text-[#FACC15]' : 'text-[#0B3B75]';

  const normalizedSubtitle =
    subtitle === 'Aprann • Santi • Leve' || subtitle === 'Aprann Santi Leve'
      ? 'Aprantisaj se lò Akademi'
      : subtitle;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`${badgeSizeClasses} bg-white border-2 ${
          theme === 'dark' ? 'border-[#FACC15]/80 shadow-md' : 'border-[#0B3B75]/15 shadow-sm'
        } flex items-center justify-center shrink-0 overflow-hidden`}
      >
        {!imgError ? (
          <img
            src={aslaOfficialCrestImg}
            alt="Emblèm Ofisyèl Aprantisaj se lò Akademi (ASLA)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-lg"
            onError={() => setImgError(true)}
          />
        ) : (
          <AslaCrestVector className="w-full h-full" />
        )}
      </div>

      {showText && (
        <div className="text-left">
          <div className={`${titleClasses} ${textColor}`}>
            Aprantisaj se lò Akademi
          </div>
          {normalizedSubtitle && (
            <div className={`${subtitleClasses} ${subTextColor} whitespace-nowrap`}>
              {normalizedSubtitle === 'Aprantisaj se lò Akademi'
                ? 'ASLA · Grades 7–12'
                : normalizedSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
