import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
};

export default function Logo({ className, size = "md", dark = false }: LogoProps) {
  const sizes = {
    sm: { container: "h-8 w-8", text: "text-lg" },
    md: { container: "h-10 w-10", text: "text-xl" },
    lg: { container: "h-12 w-12", text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Abstract ascending bars */}
      <div className={cn("relative flex items-center justify-center", s.container)}>
        <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="tickoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="tickoGradDark" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          
          {/* Rising bars - growth pattern */}
          <rect x="4" y="28" width="7" height="8" rx="2" fill={dark ? "url(#tickoGradDark)" : "url(#tickoGrad)"} opacity="0.3" />
          <rect x="14" y="20" width="7" height="16" rx="2" fill={dark ? "url(#tickoGradDark)" : "url(#tickoGrad)"} opacity="0.55" />
          <rect x="24" y="10" width="7" height="26" rx="2" fill={dark ? "url(#tickoGradDark)" : "url(#tickoGrad)"} />
        </svg>
      </div>

      <span className={cn("font-semibold tracking-tight", dark ? "text-white" : "text-slate-800", s.text)}>
        ticko
      </span>
    </div>
  );
}
