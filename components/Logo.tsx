interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rentdirect-mark" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B6B4B" />
          <stop offset="0.62" stopColor="#073B2D" />
          <stop offset="1" stopColor="#101A18" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="14" fill="url(#rentdirect-mark)" />
      <path d="M0 9H40" stroke="#F2B84B" strokeWidth="3" strokeDasharray="5 4" opacity="0.95" />
      <path d="M0 34H40" stroke="#B85B34" strokeWidth="3" strokeDasharray="7 3" opacity="0.9" />
      <path d="M6 32H34" stroke="#F2B84B" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M20 9L32 19H8L20 9Z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* House body */}
      <rect x="12" y="19" width="16" height="13" rx="1.5" fill="white" fillOpacity="0.95" />
      {/* Door */}
      <rect x="17" y="24" width="6" height="8" rx="1" fill="#0F6E56" />
      <path
        d="M27 15.5L30 18.5M30 18.5L27 21.5M30 18.5H24"
        stroke="#F2B84B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={32} />
      <span className="text-brand font-black text-xl tracking-tight leading-none">
        Rent<span className="text-[#101A18]">Direct</span>
      </span>
    </span>
  );
}
