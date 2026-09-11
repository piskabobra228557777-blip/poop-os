import React from 'react';

interface GhostCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
  isVisible: boolean;
}

export const GhostCursor: React.FC<GhostCursorProps> = ({
  x,
  y,
  isClicking,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-auto z-100 cursor-none">
      <div
        style={{
          transform: `translate3d(${x}px, ${y}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="absolute top-0 left-0 pointer-events-none"
      >
        {/* macOS Arrow Cursor SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 2.5 L5.5 19.5 L10.5 15.5 L14.5 22.5 L17.5 21 L13.5 14 L19.5 14 Z"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Warning bubble explaining why mouse moves itself */}
        <div className="absolute left-6 -top-8 bg-red-950/95 text-red-200 border-2 border-red-500/80 px-2.5 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap shadow-2xl backdrop-blur-md animate-bounce pointer-events-none flex items-center space-x-1.5">
          <span>⚠️</span>
          <span className="font-bold">Курсор захвачен вирусом!</span>
        </div>

        {/* Click ripple circle */}
        {isClicking && (
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/30 animate-ping" />
        )}
      </div>
    </div>
  );
};
