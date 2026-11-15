import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CircleDot,
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
} from "lucide-react";
import { AtharCard, AtharButton } from "@/components/ui/DesignSystem";

export const metadata: Metadata = {
  title: "مميزات منظومة أَثَر",
  description: "اكتشف جميع أقسام ومميزات منصة ATHAR | أَثَر الرقمية الإسلامية.",
};

const FEATURES = [
  { href: "/quran", icon: BookOpen, title: "ATHAR QURAN — القرآن الكريم", desc: "114 سورة بالرسم العثماني الموثق، اختيار القراء، تشغيل وتكرار الآيات، علامات مرجعية، وخطط الختم." },
  { href: "/tasbih", icon: CircleDot, title: "ATHAR TASBIH — المسبحة الذكية", desc: "عداد مريح للهاتف، أذكار جاهزة ومخصصة، أهداف يومية، اهتزاز وصوت اختياري، وحفظ ذكي دون إرهاق القاعدة." },
  { href: "/adhkar", icon: Sparkles, title: "ATHAR ADHKAR — مكتبة الأذكار", desc: "أذكار الصباح والمساء والنوم والاستيقاظ والصلاة وبعدها مع عدد التكرار والمصدر والمرجع." },
  { href: "/dua", icon: HeartHandshake, title: "ATHAR DUA — مكتبة الأدعية", desc: "أدعية القرآن والسنة والأدعية العامة الموثقة، مع المفضلة وصندوق الدعاء الشخصي الخاص." },
  { href: "/prayer", icon: Clock, title: "ATHAR PRAYER — مواقيت الصلاة", desc: "مواقيت دقيقة لجميع محافظات مصر الـ27 باختيار يدوي دون GPS، مع العد التنازلي وطرق الحساب." },
  { href: "/qibla", icon: Compass, title: "ATHAR QIBLA — بوصلة القبلة", desc: "حساب زاوية القبلة بدقة فلكية مع دعم مستشعر البوصلة وإرشادات المعايرة والبديل اليدوي." },
  { href: "/hijri", icon: Calendar, title: "ATHAR HIJRI — التقويم الهجري", desc: "عرض شهري ومناسبات إسلامية مع إمكانية تعديل التاريخ الهجري حسب الرؤية المحلية." },
  { href: "/invitations", icon: Send, title: "ATHAR INVITATIONS — نظام الدعوات", desc: "محرر دعوات راقٍ مع معاينة فورية وروابط Open Graph محمية بضوابط SSRF." },
  { href: "/campaigns", icon: Users, title: "ATHAR CAMPAIGNS — الحملات", desc: "إنشاء حملات عامة وخاصة، تتبع التقدم، وتوزيع المهام مع حماية بيانات المشاركين." },
  { href: "/community", icon: Users, title: "ATHAR COMMUNITY — المجتمعات", desc: "مجتمعات هادفة للنقاش البنّاء مع نظام إشراف وبلاغات وRate Limiting." },
  { href: "/journal", icon: BookMarked, title: "ATHAR JOURNAL — الدفتر والعادات", desc: "ملاحظات خاصة، أهداف، وعادات يومية محمية بالكامل بخصوصية المستخدم." },
  { href: "/legacy", icon: Archive, title: "ATHAR LEGACY — الأثر الرقمي", desc: "أرشفة المبادرات والمشاريع والأعمال النافعة مع خيار النشر العام أو الخاص." },
  { href: "/studio", icon: Palette, title: "ATHAR STUDIO — استوديو التصميم", desc: "تصميم بطاقات ودعوات إسلامية فاخرة بزخارف وخطوط عربية وتصدير فوري بجودة عالية." },
  { href: "/analytics", icon: BarChart3, title: "ATHAR ANALYTICS — التحليلات", desc: "لوحة تحليلات حقيقية لمتابعة الدعوات والعادات والأهداف دون أرقام وهمية." },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">
          مزايا منظومة ATHAR | أَثَر
        </h1>
        <p className="text-sm text-[var(--athar-text-muted)]">
          كل قسم صُمم ليعمل فعليًا بقاعدة بيانات حقيقية وأمان متكامل وتجربة عربية فاخرة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.href} href={f.href} className="group">
              <AtharCard className="h-full space-y-3 hover:border-[var(--athar-gold)]/55">
                <div className="w-11 h-11 rounded-xl bg-[var(--athar-gold)]/12 border border-[var(--athar-border)] flex items-center justify-center text-[var(--athar-gold)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold">{f.title}</h2>
                <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">{f.desc}</p>
              </AtharCard>
            </Link>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link href="/pricing">
          <AtharButton variant="primary" size="lg">
            <Crown className="w-4 h-4" /> مقارنة باقات العضويات
          </AtharButton>
        </Link>
      </div>
    </div>
  );
}
