"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Search,
  Check,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Loader2,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { EGYPT_GOVERNORATES } from "@/lib/constants";

/* === ATHAR SIGNATURE EMBLEM === */
export function AtharLogo({ size = 38, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="shrink-0 drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
      >
        <defs>
          <linearGradient id="atharLogoGold" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8E4A0" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#946F15" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#071B14" stroke="url(#atharLogoGold)" strokeWidth="1.6" />
        <polygon
          points="32,8 38,14 48,14 48,24 54,30 48,36 48,46 38,46 32,52 26,46 16,46 16,36 10,30 16,24 16,14 26,14"
          stroke="#D4AF37"
          strokeOpacity="0.28"
          strokeWidth="0.9"
        />
        <path
          d="M36 16C26.5 16.5 19.5 24 19.5 33.5C19.5 43.2 27.3 51 37 51C42.3 51 47 48.6 50.2 44.8C47.5 46.2 44.5 47 41.2 47C32 47 24.6 39.6 24.6 30.4C24.6 24.2 28 18.8 33.1 16C34 16 35 16 36 16Z"
          fill="url(#atharLogoGold)"
        />
        <path d="M41 21L42.2 24.6L45.8 25.8L42.2 27L41 30.6L39.8 27L36.2 25.8L39.8 24.6L41 21Z" fill="#F8E4A0" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold tracking-wide athar-gold-text">أَثَر</span>
            <span className="text-[11px] font-semibold tracking-[0.22em] opacity-75">ATHAR</span>
          </div>
          <span className="text-[10px] text-[var(--athar-text-muted)] mt-0.5">اترك أثرًا يبقى بعدك</span>
        </div>
      )}
    </div>
  );
}

/* === UNIFIED BUTTON SYSTEM === */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface AtharButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function AtharButton({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: AtharButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "athar-gold-gradient text-[#06120D] font-bold shadow-[0_6px_20px_-6px_rgba(212,175,55,0.55)] hover:brightness-110 active:scale-[0.98]",
    secondary:
      "bg-[var(--athar-emerald)] text-[var(--athar-text)] border border-[var(--athar-border)] hover:brightness-125 active:scale-[0.98]",
    outline:
      "bg-transparent text-[var(--athar-gold-soft)] border border-[var(--athar-border)] hover:bg-[var(--athar-gold)]/10 active:scale-[0.98]",
    ghost:
      "bg-transparent text-[var(--athar-text)] hover:bg-white/5 active:scale-[0.98]",
    danger:
      "bg-red-600/90 text-white border border-red-400/30 hover:bg-red-600 active:scale-[0.98]",
    success:
      "bg-emerald-600 text-white border border-emerald-400/30 hover:bg-emerald-500 active:scale-[0.98]",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5",
    md: "h-11 px-5 text-sm rounded-xl gap-2",
    lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
    icon: "h-10 w-10 p-0 rounded-xl justify-center",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--athar-gold)] disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

/* === UNIFIED CARD === */
export function AtharCard({
  className = "",
  children,
  glow = false,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className={`athar-card rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
        glow ? "ring-1 ring-[var(--athar-gold)]/30 shadow-[0_0_40px_-15px_rgba(212,175,55,0.3)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* === BADGES & VERIFICATION SEALS === */
export function AtharBadge({
  children,
  tone = "gold",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "gold" | "emerald" | "neutral" | "danger" | "info";
  className?: string;
}) {
  const tones = {
    gold: "bg-[var(--athar-gold)]/15 text-[var(--athar-gold-soft)] border-[var(--athar-gold)]/35",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    neutral: "bg-white/8 text-[var(--athar-text-muted)] border-white/15",
    danger: "bg-red-500/15 text-red-300 border-red-500/30",
    info: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function VerificationSeal({ badge }: { badge: string | null | undefined }) {
  if (!badge) return null;
  const isVip = badge.includes("VIP");
  const isPro = badge.includes("PRO");
  return (
    <span
      title="توثيق معتمد بعد مراجعة بشرية من إدارة أَثَر"
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${
        isVip
          ? "athar-gold-gradient text-[#06120D] border-[#F6E19C]"
          : isPro
          ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
          : "bg-[var(--athar-gold)]/15 text-[var(--athar-gold-soft)] border-[var(--athar-gold)]/40"
      }`}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      {badge}
    </span>
  );
}

/* === FORM CONTROLS === */
export function AtharInput({
  label,
  error,
  hint,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--athar-text)]">
          {label}
          {props.required && <span className="text-[var(--athar-gold)] mr-1">*</span>}
        </label>
      )}
      <input
        className={`w-full h-11 px-3.5 rounded-xl bg-[var(--athar-bg-elevated)] border ${
          error ? "border-red-500/70" : "border-[var(--athar-border-subtle)] focus:border-[var(--athar-gold)]"
        } text-[var(--athar-text)] placeholder:text-[var(--athar-text-muted)]/60 text-sm outline-none transition-colors ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[var(--athar-text-muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AtharPasswordInput({
  label,
  error,
  value,
  showStrength = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  value: string;
  showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  const score =
    (value.length >= 8 ? 1 : 0) +
    (/[A-Za-z\u0600-\u06FF]/.test(value) ? 1 : 0) +
    (/[0-9]/.test(value) ? 1 : 0) +
    (/[^A-Za-z0-9\u0600-\u06FF]/.test(value) || value.length >= 12 ? 1 : 0);

  const strengthLabels = ["ضعيفة جدًا", "ضعيفة", "متوسطة", "قوية", "فائقة القوة"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-emerald-500", "bg-[var(--athar-gold)]"];

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--athar-text)]">
          {label}
          {props.required && <span className="text-[var(--athar-gold)] mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          className={`w-full h-11 pr-3.5 pl-11 rounded-xl bg-[var(--athar-bg-elevated)] border ${
            error ? "border-red-500/70" : "border-[var(--athar-border-subtle)] focus:border-[var(--athar-gold)]"
          } text-[var(--athar-text)] placeholder:text-[var(--athar-text-muted)]/60 text-sm outline-none transition-colors`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[var(--athar-text-muted)] hover:text-[var(--athar-gold)] transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="space-y-1 pt-1">
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  score >= idx ? strengthColors[score] : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-[var(--athar-text-muted)]">
            قوة كلمة المرور: <span className="text-[var(--athar-text)] font-medium">{strengthLabels[score]}</span>
          </p>
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AtharTextarea({
  label,
  error,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--athar-text)]">
          {label}
          {props.required && <span className="text-[var(--athar-gold)] mr-1">*</span>}
        </label>
      )}
      <textarea
        className={`w-full min-h-[100px] p-3.5 rounded-xl bg-[var(--athar-bg-elevated)] border ${
          error ? "border-red-500/70" : "border-[var(--athar-border-subtle)] focus:border-[var(--athar-gold)]"
        } text-[var(--athar-text)] placeholder:text-[var(--athar-text-muted)]/60 text-sm outline-none transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

/* === SEARCHABLE 27 EGYPT GOVERNORATES SELECT (NO DEFAULT VALUE!) === */
export function GovernorateSearchSelect({
  value,
  onChange,
  label = "المحافظة (مصر — 27 محافظة)",
  error,
  required = true,
  placeholder = "اختر محافظتك...",
}: {
  value: string;
  onChange: (gov: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const filtered = EGYPT_GOVERNORATES.filter(
    (g) => g.nameAr.includes(query.trim()) || g.nameEn.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--athar-text)]">
          {label}
          {required && <span className="text-[var(--athar-gold)] mr-1">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full h-11 px-3.5 rounded-xl bg-[var(--athar-bg-elevated)] border ${
          error ? "border-red-500/70" : open ? "border-[var(--athar-gold)]" : "border-[var(--athar-border-subtle)]"
        } flex items-center justify-between text-sm transition-colors cursor-pointer`}
      >
        <span className={`flex items-center gap-2 ${value ? "text-[var(--athar-text)]" : "text-[var(--athar-text-muted)]/70"}`}>
          <MapPin className="w-4 h-4 text-[var(--athar-gold)] shrink-0" />
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--athar-text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl bg-[var(--athar-surface-solid)] border border-[var(--athar-border)] shadow-2xl overflow-hidden">
          <div className="p-2.5 border-b border-[var(--athar-border-subtle)]">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--athar-text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن المحافظة..."
                autoFocus
                className="w-full h-9 pr-9 pl-3 rounded-lg bg-[var(--athar-bg)] border border-[var(--athar-border-subtle)] text-xs text-[var(--athar-text)] outline-none focus:border-[var(--athar-gold)]"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-[var(--athar-text-muted)] py-4">لا توجد محافظة مطابقة</p>
            ) : (
              filtered.map((g) => {
                const selected = value === g.nameAr;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      onChange(g.nameAr);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-right transition-colors cursor-pointer ${
                      selected
                        ? "bg-[var(--athar-gold)]/15 text-[var(--athar-gold-soft)] font-semibold"
                        : "text-[var(--athar-text)] hover:bg-white/5"
                    }`}
                  >
                    <span>{g.nameAr}</span>
                    {selected && <Check className="w-4 h-4 text-[var(--athar-gold)]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

/* === MODAL / DIALOG SYSTEM (NO BROWSER ALERT/CONFIRM!) === */
export function AtharDialog({
  open,
  onClose,
  title,
  description,
  tone = "info",
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "danger";
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-[var(--athar-gold)]" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    danger: <XCircle className="w-5 h-5 text-red-400" />,
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[var(--athar-surface-solid)] border border-[var(--athar-border)] shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-[var(--athar-border-subtle)] flex items-center justify-center shrink-0">
              {icons[tone]}
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--athar-text)]">{title}</h3>
              {description && <p className="text-xs text-[var(--athar-text-muted)] mt-0.5">{description}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-[var(--athar-text-muted)] hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children && <div className="space-y-4">{children}</div>}
        {footer && <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[var(--athar-border-subtle)]">{footer}</div>}
      </div>
    </div>
  );
}

/* === PROGRESS BAR, SKELETON, EMPTY STATE === */
export function AtharProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return (
    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full athar-gold-gradient transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function AtharEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-[var(--athar-border)] bg-white/[0.02]">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--athar-gold)]/10 border border-[var(--athar-border)] flex items-center justify-center text-[var(--athar-gold)]">
        {icon}
      </div>
      <h3 className="text-base font-bold text-[var(--athar-text)]">{title}</h3>
      <p className="text-sm text-[var(--athar-text-muted)] max-w-md mx-auto mt-1.5">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AtharSkeleton({ className = "h-24 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/[0.06] ${className}`} />;
}
