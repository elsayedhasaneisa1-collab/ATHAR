"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Sparkles,
  CircleDot,
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
  ArrowLeft,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useAthar } from "@/components/providers/AtharProvider";
import {
  AtharButton,
  AtharCard,
  AtharBadge,
  AtharProgressBar,
  VerificationSeal,
} from "@/components/ui/DesignSystem";
import type { PrayerTimesData } from "@/lib/islamic-api";

const HeroCrescent3D = dynamic(() => import("./HeroCrescent3D"), {
  ssr: false,
  loading: () => <div className="w-full h-64 sm:h-80 lg:h-96 animate-pulse rounded-3xl bg-white/[0.03]" />,
});

interface HomeProps {
  prayer: PrayerTimesData;
  hijri: { hijriFull: string; gregorianFull: string };
  daily: {
    dhikr: { text: string; source: string; reference: string; repeat: number };
    dua: { title: string; text: string; source: string; reference: string };
    dailyWird: { juzNumber: number; title: string; description: string };
  };
  campaigns: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    goalTarget: number;
    currentProgress: number;
    unitLabel: string;
    creatorName: string;
    creatorBadge: string | null;
  }>;
  communities: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
  }>;
  latestInvitations: Array<{
    id: string;
    slug: string;
    title: string;
    type: string;
    creatorName: string;
    creatorBadge: string | null;
  }>;
  heroContent: { heroTitle: string; heroSubtitle: string };
}

const ECOSYSTEM_CARDS = [
  { href: "/quran", title: "القرآن الكريم", desc: "تلاوة، بحث، قراء، خطط ختم، وعلامات مرجعية", icon: BookOpen, mood: "from-amber-500/15 to-transparent" },
  { href: "/tasbih", title: "المسبحة الذكية", desc: "أذكار جاهزة ومخصصة، أهداف، وعمل دون إنترنت", icon: CircleDot, mood: "from-emerald-500/15 to-transparent" },
  { href: "/adhkar", title: "مكتبة الأذكار", desc: "أذكار الصباح والمساء والنوم والصلاة بمصادرها", icon: Sparkles, mood: "from-teal-500/15 to-transparent" },
  { href: "/dua", title: "مكتبة الأدعية", desc: "أدعية القرآن والسنة الموثقة وصندوق الدعاء الشخصي", icon: HeartHandshake, mood: "from-amber-400/15 to-transparent" },
  { href: "/prayer", title: "مواقيت الصلاة", desc: "مواقيت دقيقة لمحافظات مصر الـ27 دون طلب GPS", icon: Clock, mood: "from-emerald-600/15 to-transparent" },
  { href: "/qibla", title: "بوصلة القبلة", desc: "اتجاه الكعبة المشرفة بالزاوية والمستشعر أو يدويًا", icon: Compass, mood: "from-yellow-500/15 to-transparent" },
  { href: "/hijri", title: "التقويم الهجري", desc: "الأشهر الهجرية والمناسبات مع إمكانية التعديل", icon: Calendar, mood: "from-emerald-400/15 to-transparent" },
  { href: "/invitations", title: "نظام الدعوات", desc: "أنشئ وانشر دعوات القرآن والختمات والخير بمعاينة OG", icon: Send, mood: "from-amber-500/15 to-transparent" },
  { href: "/campaigns", title: "الحملات الجماعية", desc: "حملات عامة وخاصة لتوزيع المهام وقياس التقدم", icon: Users, mood: "from-emerald-500/15 to-transparent" },
  { href: "/community", title: "المجتمعات الهادفة", desc: "مساحات نقاش آمنة بضوابط الخصوصية والإشراف", icon: Users, mood: "from-sky-500/15 to-transparent" },
  { href: "/journal", title: "الدفتر والعادات", desc: "يوميات خاصة، أهداف، وعادات يومية بخصوصية تامة", icon: BookMarked, mood: "from-purple-500/15 to-transparent" },
  { href: "/legacy", title: "مساحة الأثر الرقمي", desc: "أرشفة مبادراتك ومشاريعك وأعمالك النافعة", icon: Archive, mood: "from-amber-500/15 to-transparent" },
  { href: "/studio", title: "استوديو أَثَر", desc: "محرر بطاقات ودعوات إسلامية وتصدير فوري PNG", icon: Palette, mood: "from-rose-500/15 to-transparent" },
  { href: "/analytics", title: "التحليلات الشخصية", desc: "متابعة حقيقية للدعوات والعادات والأهداف", icon: BarChart3, mood: "from-emerald-500/15 to-transparent" },
];

export default function HomeClient({
  prayer,
  hijri,
  daily,
  campaigns,
  communities,
  latestInvitations,
  heroContent,
}: HomeProps) {
  const { user } = useAthar();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 4 && h < 12) return "صباح الخير والبركة";
    if (h >= 12 && h < 17) return "طاب يومك بذكر الله";
    if (h >= 17 && h < 21) return "مساء السكينة والطمأنينة";
    return "أمسية مباركة ووقت هادئ للذكر";
  }, []);

  const prayerLabels = [
    { key: "Fajr", label: "الفجر", time: prayer.timings.Fajr },
    { key: "Sunrise", label: "الشروق", time: prayer.timings.Sunrise },
    { key: "Dhuhr", label: "الظهر", time: prayer.timings.Dhuhr },
    { key: "Asr", label: "العصر", time: prayer.timings.Asr },
    { key: "Maghrib", label: "المغرب", time: prayer.timings.Maghrib },
    { key: "Isha", label: "العشاء", time: prayer.timings.Isha },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--athar-border)] bg-gradient-to-br from-[#071D16] via-[#060C0A] to-[#0B1612] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <AtharBadge tone="gold">
                <Sparkles className="w-3.5 h-3.5" />
                {greeting} {user ? `يا ${user.username}` : ""}
              </AtharBadge>
              <AtharBadge tone="emerald">
                <Calendar className="w-3.5 h-3.5" />
                {hijri.hijriFull}
              </AtharBadge>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.26em] text-[var(--athar-gold)]">
                ATHAR | أَثَر — LUXURY ISLAMIC ECOSYSTEM
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight athar-gold-text">
                «{heroContent.heroTitle}»
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[var(--athar-text-muted)] leading-relaxed max-w-2xl">
              {heroContent.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {user ? (
                <>
                  <Link href="/quran">
                    <AtharButton variant="primary" size="lg">
                      <BookOpen className="w-4 h-4" /> ابدأ وردك القرآني
                    </AtharButton>
                  </Link>
                  <Link href="/invitations">
                    <AtharButton variant="secondary" size="lg">
                      <Send className="w-4 h-4" /> أنشئ دعوة خير
                    </AtharButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <AtharButton variant="primary" size="lg">
                      ابدأ رحلتك في أَثَر
                      <ArrowLeft className="w-4 h-4" />
                    </AtharButton>
                  </Link>
                  <Link href="/quran">
                    <AtharButton variant="outline" size="lg">
                      تصفح القرآن والأذكار
                    </AtharButton>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroCrescent3D />
          </div>
        </div>
      </section>

      {/* PRAYER TIMES & HIJRI STRIP */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--athar-gold)]" />
              مواقيت الصلاة اليوم
            </h2>
            <p className="text-xs text-[var(--athar-text-muted)] mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--athar-gold)]" />
              {prayer.governorate} — {hijri.gregorianFull}
            </p>
          </div>
          <Link href="/prayer" className="text-xs font-semibold text-[var(--athar-gold-soft)] hover:underline flex items-center gap-1">
            تغيير المحافظة والعد التنازلي <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {prayerLabels.map((p) => (
            <AtharCard key={p.key} className="!p-4 text-center hover:border-[var(--athar-gold)]/50">
              <p className="text-xs text-[var(--athar-text-muted)] font-medium">{p.label}</p>
              <p className="text-xl font-bold athar-gold-text mt-1 font-mono">{p.time}</p>
            </AtharCard>
          ))}
        </div>
      </section>

      {/* DAILY TRIO: DHIKR, DUA, WIRD */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AtharCard glow className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <AtharBadge tone="emerald">ذكر اليوم</AtharBadge>
              <span className="text-[11px] text-[var(--athar-text-muted)]">التكرار: {daily.dhikr.repeat}×</span>
            </div>
            <p className="font-quran text-lg leading-loose text-[var(--athar-text)]">{daily.dhikr.text}</p>
          </div>
          <div className="pt-3 border-t border-[var(--athar-border-subtle)] flex items-center justify-between gap-2 text-xs">
            <span className="text-[var(--athar-text-muted)]">{daily.dhikr.reference}</span>
            <Link href="/adhkar" className="text-[var(--athar-gold-soft)] font-semibold hover:underline">
              كل الأذكار
            </Link>
          </div>
        </AtharCard>

        <AtharCard glow className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <AtharBadge tone="gold">دعاء اليوم</AtharBadge>
              <span className="text-[11px] text-[var(--athar-text-muted)]">{daily.dua.source}</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--athar-gold-soft)]">{daily.dua.title}</h3>
            <p className="font-quran text-lg leading-loose text-[var(--athar-text)]">{daily.dua.text}</p>
          </div>
          <div className="pt-3 border-t border-[var(--athar-border-subtle)] flex items-center justify-between gap-2 text-xs">
            <span className="text-[var(--athar-text-muted)]">{daily.dua.reference}</span>
            <Link href="/dua" className="text-[var(--athar-gold-soft)] font-semibold hover:underline">
              مكتبة الأدعية
            </Link>
          </div>
        </AtharCard>

        <AtharCard glow className="flex flex-col justify-between space-y-4 bg-gradient-to-br from-[#0B251C]/80 to-transparent">
          <div className="space-y-3">
            <AtharBadge tone="gold">ورد اليوم</AtharBadge>
            <h3 className="font-display text-2xl font-bold text-[var(--athar-text)]">
              {daily.dailyWird.title}
            </h3>
            <p className="text-sm text-[var(--athar-text-muted)] leading-relaxed">
              {daily.dailyWird.description}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Link href="/quran" className="flex-1">
              <AtharButton variant="primary" size="sm" className="w-full">
                فتح المصحف
              </AtharButton>
            </Link>
            <Link href="/tasbih" className="flex-1">
              <AtharButton variant="outline" size="sm" className="w-full">
                فتح المسبحة
              </AtharButton>
            </Link>
          </div>
        </AtharCard>
      </section>

      {/* ATHAR UNIVERSE SECTIONS */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[var(--athar-gold)] tracking-wider">ATHAR UNIVERSE</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">أقسام المنظومة الرقمية</h2>
          </div>
          <Link href="/features" className="text-xs font-semibold text-[var(--athar-gold-soft)] hover:underline">
            استكشف جميع المزايا
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECOSYSTEM_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="group block">
                <div
                  className={`h-full athar-card rounded-2xl p-5 bg-gradient-to-br ${card.mood} hover:border-[var(--athar-gold)]/55 transition-all duration-200 group-hover:-translate-y-0.5`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--athar-gold)]/12 border border-[var(--athar-border)] flex items-center justify-center text-[var(--athar-gold)] mb-3.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--athar-text)]">{card.title}</h3>
                  <p className="text-xs text-[var(--athar-text-muted)] mt-1.5 leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ACTIVE CAMPAIGNS & PUBLIC COMMUNITIES (LIVE DB DATA) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">الحملات النشطة</h2>
            <Link href="/campaigns" className="text-xs font-semibold text-[var(--athar-gold-soft)] hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <AtharCard>
                <p className="text-sm text-[var(--athar-text-muted)]">لا توجد حملات عامة منشورة حاليًا.</p>
              </AtharCard>
            ) : (
              campaigns.map((camp) => (
                <AtharCard key={camp.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base">{camp.title}</h3>
                      <p className="text-xs text-[var(--athar-text-muted)] mt-1 line-clamp-2">{camp.description}</p>
                    </div>
                    <AtharBadge tone="emerald">نشطة</AtharBadge>
                  </div>
                  <AtharProgressBar value={camp.currentProgress} max={camp.goalTarget} />
                  <div className="flex items-center justify-between text-xs text-[var(--athar-text-muted)]">
                    <span>
                      التقدم: <strong className="text-[var(--athar-gold-soft)]">{camp.currentProgress}</strong> /{" "}
                      {camp.goalTarget} {camp.unitLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>{camp.creatorName}</span>
                      <VerificationSeal badge={camp.creatorBadge} />
                    </div>
                  </div>
                </AtharCard>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">المجتمعات العامة وآخر الإضافات</h2>
            <Link href="/community" className="text-xs font-semibold text-[var(--athar-gold-soft)] hover:underline">
              تصفح المجتمعات
            </Link>
          </div>
          <div className="space-y-3">
            {communities.map((comm) => (
              <Link key={comm.id} href="/community" className="block">
                <AtharCard className="hover:border-[var(--athar-gold)]/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">{comm.name}</h3>
                    <AtharBadge tone="gold">مجتمع عام</AtharBadge>
                  </div>
                  <p className="text-xs text-[var(--athar-text-muted)] line-clamp-2">{comm.description}</p>
                </AtharCard>
              </Link>
            ))}

            {latestInvitations.length > 0 && (
              <AtharCard className="space-y-2.5">
                <p className="text-xs font-bold text-[var(--athar-gold-soft)]">أحدث الدعوات المنشورة</p>
                {latestInvitations.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/invitations/${inv.slug}`}
                    className="flex items-center justify-between py-2 border-b last:border-0 border-[var(--athar-border-subtle)] hover:text-[var(--athar-gold-soft)]"
                  >
                    <span className="text-sm font-medium truncate">{inv.title}</span>
                    <span className="text-[11px] text-[var(--athar-text-muted)] shrink-0 mr-2">
                      بواسطة {inv.creatorName}
                    </span>
                  </Link>
                ))}
              </AtharCard>
            )}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="rounded-3xl border border-[var(--athar-border)] bg-gradient-to-l from-[#0B2E22] via-[#071611] to-[#0A100D] p-7 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--athar-gold-soft)]">
            <Crown className="w-4 h-4" />
            عضويات أَثَر المرنة — بدءًا من 0 ج.م
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            ارتقِ بتجربتك في ATHAR: FREE • PLUS • PRO • VIP
          </h2>
          <p className="text-sm text-[var(--athar-text-muted)] leading-relaxed">
            العبادة والقرآن والأذكار والمسبحة مجانية بالكامل للجميع. والباقات المدفوعة تفتح لك آفاق الدعوات الموسعة، استوديو التصميم، روابط معاينات Open Graph، والحملات الخاصة، مع توثيق بشري مستقل.
          </p>
          <p className="text-xs text-emerald-300/90 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            الاشتراك المدفوع لا يمنح شارة التوثيق تلقائيًا — جميع الشارات تخضع لمراجعة بشرية.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link href="/pricing">
            <AtharButton variant="primary" size="lg">
              عرض الباقات والأسعار
            </AtharButton>
          </Link>
          <Link href="/support">
            <AtharButton variant="outline" size="lg">
              تواصل مع الدعم
            </AtharButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
