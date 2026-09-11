import React from 'react';

interface OnionSpriteProps {
  mood?: 'happy' | 'sly' | 'evil' | 'shocked';
  size?: number;
  className?: string;
}

export const OnionSprite: React.FC<OnionSpriteProps> = ({
  mood = 'happy',
  size = 120,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`drop-shadow-xl ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green onion sprouts / stems on top */}
      <path
        d="M95 40 C 90 10, 70 5, 55 15 C 65 30, 85 45, 95 48 Z"
        fill="#22c55e"
        stroke="#15803d"
        strokeWidth="3"
      />
      <path
        d="M105 40 C 110 5, 130 0, 145 10 C 135 28, 115 45, 105 48 Z"
        fill="#4ade80"
        stroke="#16a34a"
        strokeWidth="3"
      />
      <path
        d="M100 45 C 98 15, 102 10, 100 0 C 103 10, 108 25, 102 45 Z"
        fill="#16a34a"
        stroke="#15803d"
        strokeWidth="2"
      />

      {/* Main onion bulb body */}
      <defs>
        <radialGradient id="onionGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="85%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        <linearGradient id="evilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
      </defs>

      {/* Outer bulb shape */}
      <path
        d="M100 45 C 155 50, 185 100, 180 150 C 175 190, 135 198, 100 198 C 65 198, 25 190, 20 150 C 15 100, 45 50, 100 45 Z"
        fill={mood === 'evil' ? 'url(#evilGrad)' : 'url(#onionGrad)'}
        stroke={mood === 'evil' ? '#7f1d1d' : '#a16207'}
        strokeWidth="4"
      />

      {/* Onion skin contour stripes */}
      <path
        d="M100 45 C 65 65, 50 115, 55 190"
        stroke={mood === 'evil' ? '#f87171' : '#fef9c3'}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M100 45 C 135 65, 150 115, 145 190"
        stroke={mood === 'evil' ? '#f87171' : '#fef9c3'}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M100 45 C 85 85, 80 135, 85 196"
        stroke={mood === 'evil' ? '#b91c1c' : '#ca8a04'}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M100 45 C 115 85, 120 135, 115 196"
        stroke={mood === 'evil' ? '#b91c1c' : '#ca8a04'}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Eyes */}
      {mood === 'happy' && (
        <>
          {/* Big friendly cartoon eyes */}
          <ellipse cx="75" cy="115" rx="14" ry="18" fill="#ffffff" stroke="#713f12" strokeWidth="2.5" />
          <ellipse cx="125" cy="115" rx="14" ry="18" fill="#ffffff" stroke="#713f12" strokeWidth="2.5" />
          {/* Pupils */}
          <circle cx="78" cy="116" r="8" fill="#1e1b4b" />
          <circle cx="128" cy="116" r="8" fill="#1e1b4b" />
          <circle cx="81" cy="112" r="3.5" fill="#ffffff" />
          <circle cx="131" cy="112" r="3.5" fill="#ffffff" />
          {/* Cheerful mouth */}
          <path
            d="M80 145 Q 100 165, 120 145"
            stroke="#713f12"
            strokeWidth="4"
            strokeLinecap="round"
            fill="#dc2626"
          />
          {/* Blush */}
          <ellipse cx="60" cy="135" rx="8" ry="5" fill="#f87171" opacity="0.6" />
          <ellipse cx="140" cy="135" rx="8" ry="5" fill="#f87171" opacity="0.6" />
        </>
      )}

      {mood === 'sly' && (
        <>
          {/* Sly eyes */}
          <path d="M60 110 Q 75 105, 90 112" stroke="#713f12" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="78" cy="116" r="6" fill="#1e1b4b" />
          <path d="M110 112 Q 125 105, 140 110" stroke="#713f12" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="122" cy="116" r="6" fill="#1e1b4b" />
          {/* Smirk */}
          <path
            d="M85 145 Q 105 160, 130 140"
            stroke="#713f12"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {mood === 'evil' && (
        <>
          {/* Glowing red sharp evil eyes */}
          <polygon points="62,105 90,118 68,125" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />
          <polygon points="138,105 110,118 132,125" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="76" cy="116" r="3" fill="#dc2626" />
          <circle cx="124" cy="116" r="3" fill="#dc2626" />
          {/* Menacing sharp jagged grin */}
          <path
            d="M65 140 Q 100 175, 135 140 Q 100 150, 65 140 Z"
            fill="#18181b"
            stroke="#fca5a5"
            strokeWidth="2"
          />
          {/* Sharp teeth */}
          <polygon points="80,143 85,152 90,144" fill="#ffffff" />
          <polygon points="95,145 100,155 105,145" fill="#ffffff" />
          <polygon points="110,144 115,152 120,143" fill="#ffffff" />
        </>
      )}

      {mood === 'shocked' && (
        <>
          {/* Shocked / O-mouth */}
          <circle cx="75" cy="110" r="12" fill="#ffffff" stroke="#713f12" strokeWidth="2.5" />
          <circle cx="125" cy="110" r="12" fill="#ffffff" stroke="#713f12" strokeWidth="2.5" />
          <circle cx="75" cy="110" r="4" fill="#000000" />
          <circle cx="125" cy="110" r="4" fill="#000000" />
          <ellipse cx="100" cy="150" rx="10" ry="16" fill="#7f1d1d" stroke="#713f12" strokeWidth="3" />
        </>
      )}

      {/* Bottom onion root hairs */}
      <path d="M92 198 C 88 206, 85 212, 80 215" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 198 C 100 208, 102 215, 100 218" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
      <path d="M108 198 C 112 206, 115 212, 120 215" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
