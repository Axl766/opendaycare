export type AuthLogoVariant = "coral" | "light";

export function AuthLogo({ variant }: { variant: AuthLogoVariant }) {
  const isCoral = variant === "coral";

  return (
    <div className={isCoral ? "flex items-center gap-[13px]" : "flex items-center gap-[11px]"}>
      <div
        className={
          isCoral
            ? "w-[46px] h-[46px] rounded-[14px] bg-[rgba(255,255,255,.22)] flex items-center justify-center shrink-0"
            : "w-[38px] h-[38px] rounded-[12px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] flex items-center justify-center shrink-0"
        }
      >
        <svg
          width={isCoral ? 26 : 21}
          height={isCoral ? 26 : 21}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </div>
      <span
        className={
          isCoral
            ? "font-display font-semibold text-[21px] tracking-[.5px] text-white"
            : "font-display font-semibold text-[17px] text-[#3F362E]"
        }
      >
        OpenDayCare
      </span>
    </div>
  );
}
