import React from "react";
import type { Metadata } from "next";
import { AtharCard } from "@/components/ui/DesignSystem";

export const metadata: Metadata = {
  title: "سياسة الخصوصية وحذف الحساب",
  description: "تفاصيل البيانات المجمعة، حماية الخصوصية، وسياسة حذف الحساب في ATHAR | أَثَر.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">
          سياسة الخصوصية وحذف الحساب
        </h1>
        <p className="text-xs text-[var(--athar-text-muted)]">
          نلتزم بمبدأ تقليل البيانات (Data Minimization) وعدم كشف أي بيانات شخصية للعامة. يُنصح بمراجعة هذه السياسة قانونيًا قبل الإطلاق الواسع.
        </p>
      </div>

      <AtharCard className="space-y-5 text-sm leading-relaxed text-[var(--athar-text-muted)]">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[var(--athar-text)]">1. البيانات التي نجمعها وسبب جمعها</h2>
          <ul className="list-disc pr-5 space-y-1">
            <li><strong>اسم المستخدم:</strong> لتعريف حسابك داخل المنصة.</li>
            <li><strong>رقم الهاتف:</strong> لتسجيل الدخول فقط — لا يظهر للعامة أبدًا.</li>
            <li><strong>البريد الإلكتروني (اختياري):</strong> للتواصل الرسمي عند رغبتك.</li>
            <li><strong>النوع:</strong> لتعيين الصورة الافتراضية للحساب المجاني فقط — لا يظهر للعامة ولا في معاينات Open Graph ولا يرتبط بأي صلاحية.</li>
            <li><strong>المحافظة (إجبارية — من 27 محافظة مصرية):</strong> لضبط مواقيت الصلاة الافتراضية والتحليلات الجغرافية المجمّعة فقط دون استخدام GPS أو استنتاج الموقع من IP.</li>
            <li><strong>البيانات الخاصة:</strong> الدفتر الشخصي، العادات، الأهداف، والمفضلة خاصة بك وحدك.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[var(--athar-text)]">2. الخدمات الخارجية المستخدمة</h2>
          <p>
            نستخدم واجهات مجانية موثوقة لجلب مواقيت الصلاة والتاريخ الهجري (AlAdhan) ونص وتلاوات القرآن الكريم (Islamic Network / AlQuran Cloud / MP3Quran) مع تطبيق Caching لتقليل الطلبات، دون إرسال بياناتك الشخصية إليها.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[var(--athar-text)]">3. سياسة حذف الحساب والاحتفاظ بالبيانات</h2>
          <p>
            يمكنك حذف حسابك نهائيًا في أي وقت من صفحة <strong>إعدادات الحساب &gt; الأمان وحذف الحساب</strong> بعد التحقق من كلمة المرور والتأكيد النهائي. يؤدي الحذف إلى إبطال جميع جلساتك وحذف ملفك الشخصي ودفترك وعاداتك وأهدافك وإشعاراتك، مع الاحتفاظ فقط بسجل تدقيق مجهول الهوية لأغراض الأمان والامتثال القانوني عند اللزوم دون أي أسرار أو كلمات مرور.
          </p>
        </section>
      </AtharCard>
    </div>
  );
}
