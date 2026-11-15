import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, BookOpen, Users } from "lucide-react";
import { AtharCard, AtharButton, AtharLogo } from "@/components/ui/DesignSystem";

export const metadata: Metadata = {
  title: "عن ATHAR | أَثَر",
  description: "تعرف على رؤية ورسالة منظومة ATHAR | أَثَر الرقمية الإسلامية المتكاملة.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <AtharCard glow className="text-center space-y-4 py-10">
        <div className="flex justify-center">
          <AtharLogo size={54} />
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold athar-gold-text">
          «اترك أثرًا يبقى بعدك»
        </h1>
        <p className="text-sm sm:text-base text-[var(--athar-text-muted)] max-w-2xl mx-auto leading-relaxed">
          ATHAR | أَثَر ليست مجرد موقع أذكار أو مسبحة إلكترونية؛ بل منظومة رقمية إسلامية متكاملة تجمع بين العبادة اليومية، القرآن الكريم، التنظيم الشخصي، الدعوات، الحملات الخيرية، المجتمعات الآمنة، التصميم الفاخر، والتحليلات الشفافة في بيئة تحترم خصوصيتك.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/register">
            <AtharButton variant="primary" size="lg">ابدأ رحلتك الآن</AtharButton>
          </Link>
          <Link href="/features">
            <AtharButton variant="outline" size="lg">استعرض المزايا</AtharButton>
          </Link>
        </div>
      </AtharCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AtharCard className="space-y-2.5">
          <BookOpen className="w-7 h-7 text-[var(--athar-gold)]" />
          <h2 className="font-bold text-lg">أصالة وموثوقية شرعية</h2>
          <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">
            لا نولّد آيات قرآنية أو أحاديث بالذكاء الاصطناعي ولا نغيّر تشكيل المصحف، ونلتزم بذكر المصدر والمرجع للأذكار والأدعية الموثقة.
          </p>
        </AtharCard>

        <AtharCard className="space-y-2.5">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          <h2 className="font-bold text-lg">خصوصية وأمان متعدد الطبقات</h2>
          <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">
            حماية كاملة للجلسات، تشفير كلمات المرور، عدم جمع موقع GPS، وعدم إظهار رقم الهاتف أو النوع أو المحافظة للعامة.
          </p>
        </AtharCard>

        <AtharCard className="space-y-2.5">
          <Users className="w-7 h-7 text-[var(--athar-gold)]" />
          <h2 className="font-bold text-lg">أثر مجتمعي هادف</h2>
          <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">
            حملات ومجتمعات ودعوات تهدف إلى التعاون على البر والخير بعيدًا عن المفاضلة في الثواب أو الإزعاج الاجتماعي.
          </p>
        </AtharCard>
      </div>

      <AtharCard className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[var(--athar-gold)] shrink-0" />
          <div>
            <h3 className="font-bold text-base">هل لديك اقتراح أو رغبة في المساهمة؟</h3>
            <p className="text-xs text-[var(--athar-text-muted)]">فريق ATHAR يرحب بتواصلك وملاحظاتك عبر مركز الدعم.</p>
          </div>
        </div>
        <Link href="/support">
          <AtharButton variant="secondary">تواصل معنا</AtharButton>
        </Link>
      </AtharCard>
    </div>
  );
}
