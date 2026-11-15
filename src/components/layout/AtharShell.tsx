"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Sparkles,
  HeartHandshake,
  Clock,
  Compass,
  Calendar,
  Send,
  Users,
  BookMarked,
  Archive,
  Palette,
  BarChart3,
  Crown,
  Bell,
  Palette as ThemeIcon,
  User,
  Settings,
  LogOut,
  Shield,
  Headphones,
  MessageCircle,
  Mail,
  AlertOctagon,
  HelpCircle,
  Menu,
  X,
  CircleDot,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAthar } from "@/components/providers/AtharProvider";
import { AtharLogo, AtharButton, AtharDialog, VerificationSeal } from "@/components/ui/DesignSystem";
import { ATHAR_THEMES, formatWhatsAppIntlUrl, hasRoleAccess } from "@/lib/constants";
import dynamic from "next/dynamic";

const AtharOnboarding3D = dynamic(() => import("@/components/onboarding/AtharOnboarding3D"), {
  ssr: false,
});

const PRIMARY_NAV = [
  { href: "/quran", label: "القرآن", icon: BookOpen },
  { href: "/adhkar", label: "الأذكار", icon: Sparkles },
  { href: "/tasbih", label: "المسبحة", icon: CircleDot },
  { href: "/dua", label: "الأدعية", icon: HeartHandshake },
  { href: "/prayer", label: "الصلاة", icon: Clock },
  { href: "/invitations", label: "الدعوات", icon: Send },
  { href: "/campaigns", label: "الحملات", icon: Users },
];

const MORE_NAV = [
  { href: "/qibla", label: "بوصلة القبلة", icon: Compass },
  { href: "/hijri", label: "التقويم الهجري", icon: Calendar },
  { href: "/community", label: "المجتمعات", icon: Users },
  { href: "/journal", label: "الدفتر والعادات", icon: BookMarked },
  { href: "/legacy", label: "الأثر الرقمي", icon: Archive },
  { href: "/studio", label: "استوديو أَثَر", icon: Palette },
  { href: "/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/pricing", label: "العضويات", icon: Crown },
  { href: "/support", label: "مركز الدعم", icon: Headphones },
];

const MOBILE_BOTTOM_NAV = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/tasbih", label: "المسبحة", icon: CircleDot },
  { href: "/quran", label: "القرآن", icon: BookOpen },
  { href: "/adhkar", label: "الأذكار", icon: Sparkles },
  { href: "/profile", label: "حسابي", icon: User },
];

export function AtharShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    unreadNotifications,
    theme,
    setTheme,
    logout,
    toasts,
    dismissToast,
    supportContacts,
    showOnboarding,
    setShowOnboarding,
    refreshUser,
  } = useAthar();

  const [moreOpen, setMoreOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportFabOpen, setSupportFabOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const lastTrackedRef = useRef("");

  // Privacy-preserving aggregated pageview beacon
  useEffect(() => {
    if (!pathname || pathname === lastTrackedRef.current || pathname.startsWith("/admin")) return;
    lastTrackedRef.current = pathname;
    let returning = false;
    try {
      returning = window.localStorage.getItem("athar_visited") === "1";
      window.localStorage.setItem("athar_visited", "1");
    } catch {
      // Ignore
    }
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, returning, source: document.referrer ? "referral" : "direct" }),
    }).catch(() => undefined);
  }, [pathname]);

  // Close menus on route change
  useEffect(() => {
    setMoreOpen(false);
    setThemeOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setSupportFabOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col athar-geo-pattern relative">
      {/* 3D Onboarding Experience — ONLY triggered directly after successful registration! */}
      {showOnboarding && user && !user.onboardingCompleted && (
        <AtharOnboarding3D
          username={user.username}
          onFinish={async (skipped) => {
            await fetch("/api/auth/onboarding", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ skipped }),
            }).catch(() => undefined);
            setShowOnboarding(false);
            await refreshUser();
            router.push("/");
          }}
        />
      )}

      {/* TOP NAVIGATION HEADER */}
      {!isAdminRoute && (
        <header className="sticky top-0 z-40 border-b border-[var(--athar-border)] bg-[var(--athar-bg)]/85 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link href="/" className="shrink-0 focus-visible:outline-none">
              <AtharLogo size={36} />
            </Link>

            {/* Desktop Primary Navigation */}
            <nav className="hidden xl:flex items-center gap-1" aria-label="التنقل الرئيسي">
              {PRIMARY_NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? "bg-[var(--athar-gold)]/15 text-[var(--athar-gold-soft)] border border-[var(--athar-gold)]/30"
                        : "text-[var(--athar-text-muted)] hover:text-[var(--athar-text)] hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Ecosystem Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen((o) => !o);
                    setThemeOpen(false);
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--athar-text-muted)] hover:text-[var(--athar-text)] hover:bg-white/5 cursor-pointer"
                >
                  المنظومة
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
                {moreOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[var(--athar-surface-solid)] border border-[var(--athar-border)] shadow-2xl p-2 grid grid-cols-1 gap-0.5 z-50">
                    {MORE_NAV.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--athar-text)] hover:bg-[var(--athar-gold)]/10 hover:text-[var(--athar-gold-soft)] transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[var(--athar-gold)]" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right / Actions Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Theme Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setThemeOpen((o) => !o);
                    setMoreOpen(false);
                    setProfileOpen(false);
                  }}
                  aria-label="تبديل السمة"
                  className="w-9 h-9 rounded-xl border border-[var(--athar-border-subtle)] bg-white/5 flex items-center justify-center text-[var(--athar-gold)] hover:border-[var(--athar-gold)]/50 transition-colors cursor-pointer"
                >
                  <ThemeIcon className="w-4 h-4" />
                </button>
                {themeOpen && (
                  <div className="absolute left-0 mt-2 w-64 max-w-[90vw] rounded-2xl bg-[var(--athar-surface-solid)] border border-[var(--athar-border)] shadow-2xl p-2.5 z-50">
                    <p className="text-xs font-bold text-[var(--athar-gold-soft)] px-2 pb-2 border-b border-[var(--athar-border-subtle)]">
                      محرك سمات أَثَر (8 أنماط)
                    </p>
                    <div className="mt-2 space-y-1 max-h-72 overflow-y-auto">
                      {ATHAR_THEMES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTheme(t.id);
                            setThemeOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-right transition-colors cursor-pointer ${
                            theme === t.id
                              ? "bg-[var(--athar-gold)]/15 border border-[var(--athar-gold)]/35"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-[var(--athar-text)]">{t.nameAr}</p>
                            <p className="text-[10px] text-[var(--athar-text-muted)]">{t.descriptionAr}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: t.previewBg }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ background: t.previewGold }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {user ? (
                <>
                  {/* Notifications */}
                  <Link
                    href="/settings/notifications"
                    aria-label="الإشعارات"
                    className="relative w-9 h-9 rounded-xl border border-[var(--athar-border-subtle)] bg-white/5 flex items-center justify-center text-[var(--athar-text)] hover:border-[var(--athar-gold)]/50 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full athar-gold-gradient text-[#06120D] text-[10px] font-bold flex items-center justify-center">
                        {unreadNotifications > 9 ? "9+" : unreadNotifications}
                      </span>
                    )}
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen((o) => !o);
                        setThemeOpen(false);
                        setMoreOpen(false);
                      }}
                      className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl border border-[var(--athar-border)] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-7 h-7 rounded-lg object-cover border border-[var(--athar-gold)]/40"
                      />
                      <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--athar-text-muted)]" />
                    </button>

                    {profileOpen && (
                      <div className="absolute left-0 mt-2 w-64 max-w-[90vw] rounded-2xl bg-[var(--athar-surface-solid)] border border-[var(--athar-border)] shadow-2xl p-2 z-50">
                        <div className="px-3 py-2.5 border-b border-[var(--athar-border-subtle)] mb-1">
                          <p className="text-sm font-bold truncate">{user.username}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--athar-emerald)] text-[var(--athar-gold-soft)]">
                              {user.membershipPlan}
                            </span>
                            <VerificationSeal badge={user.verificationBadge} />
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
                        >
                          <User className="w-4 h-4 text-[var(--athar-gold)]" /> الملف الشخصي
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
                        >
                          <Settings className="w-4 h-4 text-[var(--athar-gold)]" /> إعدادات الحساب
                        </Link>
                        <Link
                          href="/settings/membership"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
                        >
                          <Crown className="w-4 h-4 text-[var(--athar-gold)]" /> العضوية والتوثيق
                        </Link>
                        {hasRoleAccess(user.role, "support") && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--athar-gold-soft)] bg-[var(--athar-gold)]/10 hover:bg-[var(--athar-gold)]/20 my-1 font-semibold"
                          >
                            <Shield className="w-4 h-4" /> ATHAR Control Center
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            setLogoutConfirmOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 cursor-pointer mt-1"
                        >
                          <LogOut className="w-4 h-4" /> تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <AtharButton variant="ghost" size="sm">
                      دخول
                    </AtharButton>
                  </Link>
                  <Link href="/register">
                    <AtharButton variant="primary" size="sm">
                      إنشاء حساب
                    </AtharButton>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="القائمة"
                className="xl:hidden w-9 h-9 rounded-xl border border-[var(--athar-border-subtle)] bg-white/5 flex items-center justify-center text-[var(--athar-text)] cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Slide-Down Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden border-t border-[var(--athar-border)] bg-[var(--athar-surface-solid)] px-4 py-4 max-h-[80vh] overflow-y-auto">
              {!user && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link href="/login">
                    <AtharButton variant="outline" size="sm" className="w-full">
                      تسجيل الدخول
                    </AtharButton>
                  </Link>
                  <Link href="/register">
                    <AtharButton variant="primary" size="sm" className="w-full">
                      حساب جديد
                    </AtharButton>
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[...PRIMARY_NAV, ...MORE_NAV].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-[var(--athar-border-subtle)] text-xs font-medium hover:border-[var(--athar-gold)]/40"
                    >
                      <Icon className="w-4 h-4 text-[var(--athar-gold)] shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </header>
      )}

      {/* MAIN PAGE CONTENT */}
      <main className={`flex-1 ${!isAdminRoute ? "pb-24 lg:pb-0" : ""}`}>{children}</main>

      {/* LUXURY ATHAR FOOTER */}
      {!isAdminRoute && (
        <footer className="border-t border-[var(--athar-border)] bg-[#040807] text-[#F5F3EC] mt-16 pb-24 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <AtharLogo size={42} />
                <p className="text-xs leading-6 text-[#9EB0A8]">
                  منظومة رقمية إسلامية متكاملة تجمع بين العبادة والقرآن والأذكار والتنظيم الشخصي والدعوات والحملات والمجتمعات والتصميم الفاخر — بخصوصية عالية وأداء سريع.
                </p>
                <a
                  href={supportContacts.whatsappCommunity}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-400/35 text-emerald-200 text-xs font-bold hover:bg-emerald-600/30 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  انضم إلى مجتمعنا على واتساب
                </a>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#F0D788] mb-3.5">العبادة والروحانيات</h4>
                <ul className="space-y-2 text-xs text-[#9EB0A8]">
                  <li><Link href="/quran" className="hover:text-[#F0D788]">القرآن الكريم</Link></li>
                  <li><Link href="/adhkar" className="hover:text-[#F0D788]">مكتبة الأذكار</Link></li>
                  <li><Link href="/tasbih" className="hover:text-[#F0D788]">المسبحة الإلكترونية</Link></li>
                  <li><Link href="/dua" className="hover:text-[#F0D788]">مكتبة الأدعية</Link></li>
                  <li><Link href="/prayer" className="hover:text-[#F0D788]">مواقيت الصلاة</Link></li>
                  <li><Link href="/qibla" className="hover:text-[#F0D788]">بوصلة القبلة</Link></li>
                  <li><Link href="/hijri" className="hover:text-[#F0D788]">التقويم الهجري</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#F0D788] mb-3.5">منظومة أَثَر</h4>
                <ul className="space-y-2 text-xs text-[#9EB0A8]">
                  <li><Link href="/invitations" className="hover:text-[#F0D788]">نظام الدعوات</Link></li>
                  <li><Link href="/campaigns" className="hover:text-[#F0D788]">الحملات الجماعية</Link></li>
                  <li><Link href="/community" className="hover:text-[#F0D788]">المجتمعات الهادفة</Link></li>
                  <li><Link href="/studio" className="hover:text-[#F0D788]">استوديو التصميم</Link></li>
                  <li><Link href="/legacy" className="hover:text-[#F0D788]">مساحة الأثر الرقمي</Link></li>
                  <li><Link href="/pricing" className="hover:text-[#F0D788]">خطط العضويات</Link></li>
                  <li><Link href="/features" className="hover:text-[#F0D788]">مميزات المنصة</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#F0D788] mb-3.5">الدعم والتواصل والسياسات</h4>
                <ul className="space-y-2 text-xs text-[#9EB0A8]">
                  <li><Link href="/support" className="hover:text-[#F0D788]">مركز الدعم والبلاغات</Link></li>
                  <li><Link href="/about" className="hover:text-[#F0D788]">عن ATHAR</Link></li>
                  <li><Link href="/terms" className="hover:text-[#F0D788]">الشروط والأحكام</Link></li>
                  <li><Link href="/privacy" className="hover:text-[#F0D788]">سياسة الخصوصية وحذف الحساب</Link></li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={formatWhatsAppIntlUrl(supportContacts.whatsappPrimary)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] hover:border-[#D4AF37]/50"
                  >
                    واتساب
                  </a>
                  <a
                    href={supportContacts.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] hover:border-[#D4AF37]/50"
                  >
                    تيليجرام
                  </a>
                  <a
                    href={supportContacts.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] hover:border-[#D4AF37]/50"
                  >
                    فيسبوك
                  </a>
                  <a
                    href={supportContacts.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] hover:border-[#D4AF37]/50"
                  >
                    إنستغرام
                  </a>
                  <a
                    href={supportContacts.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] hover:border-[#D4AF37]/50"
                  >
                    تيك توك
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9EB0A8]">
              <p>© {new Date().getFullYear()} ATHAR | أَثَر — جميع الحقوق محفوظة. «اترك أثرًا يبقى بعدك»</p>
              <p>بريد التواصل الرسمي: {supportContacts.email}</p>
            </div>
          </div>
        </footer>
      )}

      {/* FLOATING SUPPORT ACTION BUTTON */}
      {!isAdminRoute && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 z-40">
          {supportFabOpen && (
            <div className="mb-3 w-64 rounded-2xl bg-[var(--athar-surface-solid)] border border-[var(--athar-border)] shadow-2xl p-2 space-y-1">
              <p className="px-3 py-1.5 text-xs font-bold text-[var(--athar-gold-soft)] border-b border-[var(--athar-border-subtle)]">
                مركز دعم أَثَر السريع
              </p>
              <a
                href={formatWhatsAppIntlUrl(supportContacts.whatsappPrimary, "السلام عليكم، أحتاج مساعدة في منصة ATHAR")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-emerald-500/10 text-emerald-300"
              >
                <MessageCircle className="w-4 h-4" /> واتساب الدعم ({supportContacts.whatsappPrimary})
              </a>
              <a
                href={`mailto:${supportContacts.email}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
              >
                <Mail className="w-4 h-4 text-[var(--athar-gold)]" /> البريد الإلكتروني
              </a>
              <Link
                href="/support?category=issue"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
              >
                <AlertOctagon className="w-4 h-4 text-amber-400" /> الإبلاغ عن مشكلة
              </Link>
              <Link
                href="/support?category=privacy"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
              >
                <Shield className="w-4 h-4 text-red-400" /> بلاغ انتهاك خصوصية
              </Link>
              <Link
                href="/support#faq"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-white/5"
              >
                <HelpCircle className="w-4 h-4 text-[var(--athar-gold)]" /> الأسئلة الشائعة
              </Link>
              <a
                href={supportContacts.whatsappCommunity}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs bg-emerald-600/20 text-emerald-200 font-semibold hover:bg-emerald-600/30"
              >
                <Users className="w-4 h-4" /> انضم إلى مجتمعنا على واتساب
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSupportFabOpen((o) => !o)}
            aria-label="الدعم الفني السريع"
            className="w-12 h-12 rounded-2xl athar-gold-gradient text-[#06120D] shadow-[0_10px_28px_-6px_rgba(212,175,55,0.65)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {supportFabOpen ? <X className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Mobile Only — Never Shown on Desktop!) */}
      {!isAdminRoute && (
        <nav
          aria-label="التنقل السفلي للهاتف"
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--athar-border)] bg-[var(--athar-bg)]/95 backdrop-blur-xl pb-safe"
        >
          <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
            {MOBILE_BOTTOM_NAV.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                    active ? "text-[var(--athar-gold-soft)]" : "text-[var(--athar-text-muted)]"
                  }`}
                >
                  <span
                    className={`p-1.5 rounded-xl transition-colors ${
                      active ? "bg-[var(--athar-gold)]/15 text-[var(--athar-gold)]" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* GLOBAL TOAST STACK */}
      <div className="fixed top-20 left-4 right-4 sm:right-auto sm:w-96 z-[95] space-y-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon =
            t.type === "success"
              ? CheckCircle2
              : t.type === "error"
              ? XCircle
              : t.type === "warning"
              ? AlertTriangle
              : Info;
          const borderTone =
            t.type === "success"
              ? "border-emerald-500/40"
              : t.type === "error"
              ? "border-red-500/40"
              : t.type === "warning"
              ? "border-amber-500/40"
              : "border-[var(--athar-gold)]/40";
          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-2xl bg-[var(--athar-surface-solid)] border ${borderTone} shadow-2xl p-3.5 flex items-start gap-3`}
            >
              <Icon className="w-5 h-5 shrink-0 text-[var(--athar-gold)] mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--athar-text)]">{t.title}</p>
                {t.message && <p className="text-[11px] text-[var(--athar-text-muted)] mt-0.5">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="text-[var(--athar-text-muted)] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* LOGOUT CONFIRMATION DIALOG */}
      <AtharDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        title="تأكيد تسجيل الخروج"
        description="سيتم إبطال جلستك الحالية على الخادم وحماية صفحاتك الخاصة."
        tone="warning"
        footer={
          <>
            <AtharButton variant="ghost" size="sm" onClick={() => setLogoutConfirmOpen(false)}>
              إلغاء
            </AtharButton>
            <AtharButton
              variant="danger"
              size="sm"
              onClick={async () => {
                setLogoutConfirmOpen(false);
                await logout();
                router.push("/login");
              }}
            >
              تأكيد الخروج
            </AtharButton>
          </>
        }
      />
    </div>
  );
}
