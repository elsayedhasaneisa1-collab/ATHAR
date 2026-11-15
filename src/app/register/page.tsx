"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import {
  AtharCard,
  AtharInput,
  AtharPasswordInput,
  AtharButton,
  GovernorateSearchSelect,
  AtharLogo,
} from "@/components/ui/DesignSystem";
import { useAthar } from "@/components/providers/AtharProvider";
import { registerSchema } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser, setShowOnboarding, toast } = useAthar();
  const startedAtRef = useRef<number>(Date.now());
  const submittingRef = useRef(false);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [governorate, setGovernorate] = useState(""); // NO default value!
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [websiteTrap, setWebsiteTrap] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setFormError("");
    setErrors({});

    const parsed = registerSchema.safeParse({
      username,
      phone,
      email,
      password,
      passwordHint,
      gender: gender || undefined,
      governorate,
      termsAccepted,
      websiteTrap,
      formStartedAt: startedAtRef.current,
    });

    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!map[key]) map[key] = issue.message;
      }
      setErrors(map);
      setFormError(parsed.error.issues[0]?.message || "يرجى مراجعة الحقول المطلوبة");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          phone,
          email,
          password,
          passwordHint,
          gender,
          governorate,
          termsAccepted,
          websiteTrap,
          formStartedAt: startedAtRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "تعذر إتمام التسجيل");
        return;
      }

      await refreshUser();
      toast({
        type: "success",
        title: "أهلًا بك في ATHAR | أَثَر",
        message: "تم إنشاء حسابك بنجاح، استعد لرحلتك الترحيبية.",
      });
      if (data.triggerOnboarding) {
        setShowOnboarding(true);
      } else {
        router.push("/");
      }
    } catch {
      setFormError("تعذر الاتصال بالخادم، يرجى المحاولة لاحقًا");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-6 space-y-2">
        <div className="flex justify-center">
          <AtharLogo size={46} />
        </div>
        <h1 className="font-display text-3xl font-bold athar-gold-text pt-2">إنشاء حساب جديد</h1>
        <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
          انضم إلى منظومة أَثَر الرقمية — تسجيل آمن وسريع بدون رسائل OTP، بخصوصية تامة.
        </p>
      </div>

      <AtharCard glow>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Honeypot field hidden from legitimate users */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={websiteTrap}
              onChange={(e) => setWebsiteTrap(e.target.value)}
            />
          </div>

          <AtharInput
            label="اسم المستخدم"
            required
            placeholder="مثال: أحمد المنصوري"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AtharInput
              label="رقم الهاتف"
              required
              type="tel"
              dir="ltr"
              placeholder="01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              hint="يُستخدم لتسجيل الدخول فقط ولا يظهر للعامة"
            />
            <AtharInput
              label="البريد الإلكتروني (اختياري)"
              type="email"
              dir="ltr"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </div>

          <AtharPasswordInput
            label="كلمة المرور"
            required
            showStrength
            placeholder="8 أحرف على الأقل مع أرقام"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <AtharInput
            label="تلميح كلمة المرور (سري)"
            required
            placeholder="جملة تذكرك بكلمة مرورك دون كتابتها"
            value={passwordHint}
            onChange={(e) => setPasswordHint(e.target.value)}
            error={errors.passwordHint}
            hint="لا يظهر للعامة، ولا يُسمح بأن يطابق كلمة المرور"
          />

          {/* Gender selection — strictly for FREE default avatar ONLY */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--athar-text)]">
              النوع <span className="text-[var(--athar-gold)]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: "male", label: "ذكر" },
                  { id: "female", label: "أنثى" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGender(opt.id)}
                  className={`h-11 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    gender === opt.id
                      ? "bg-[var(--athar-gold)]/15 border-[var(--athar-gold)] text-[var(--athar-gold-soft)]"
                      : "bg-[var(--athar-bg-elevated)] border-[var(--athar-border-subtle)] text-[var(--athar-text-muted)] hover:border-white/25"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--athar-text-muted)]">
              يُستخدم فقط لتعيين الصورة الافتراضية للحساب المجاني، ولا يُعرض للعامة أبدًا.
            </p>
            {errors.gender && <p className="text-xs text-red-400">{errors.gender}</p>}
          </div>

          {/* Mandatory 27 Egypt Governorates Searchable Select */}
          <GovernorateSearchSelect
            value={governorate}
            onChange={setGovernorate}
            error={errors.governorate}
            required
          />
          <p className="text-[11px] text-[var(--athar-text-muted)] -mt-2">
            لا نطلب GPS. تُستخدم المحافظة لضبط مواقيت الصلاة والتحليلات المجمعة فقط ولا تُعرض للعامة.
          </p>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-[var(--athar-border-subtle)] cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 accent-[#D4AF37] w-4 h-4"
            />
            <span className="text-xs text-[var(--athar-text-muted)] leading-relaxed">
              أوافق على{" "}
              <Link href="/terms" className="text-[var(--athar-gold-soft)] underline">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-[var(--athar-gold-soft)] underline">
                سياسة الخصوصية
              </Link>{" "}
              الخاصة بمنصة ATHAR | أَثَر.
            </span>
          </label>
          {errors.termsAccepted && <p className="text-xs text-red-400">{errors.termsAccepted}</p>}

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/35 text-xs text-red-300">
              {formError}
            </div>
          )}

          <AtharButton type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            <UserPlus className="w-4 h-4" />
            إنشاء الحساب وبدء رحلة أَثَر
          </AtharButton>

          <div className="flex items-center justify-between pt-2 text-xs text-[var(--athar-text-muted)]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              تشفير كامل لكلمات المرور
            </span>
            <Link href="/login" className="text-[var(--athar-gold-soft)] font-semibold hover:underline">
              لديك حساب؟ تسجيل الدخول
            </Link>
          </div>
        </form>
      </AtharCard>

      <p className="text-center text-[11px] text-[var(--athar-text-muted)] mt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[var(--athar-gold)]" />
        بعد التسجيل مباشرة ستبدأ تجربة الترحيب ثلاثية الأبعاد (ATHAR JOURNEY) مرة واحدة فقط.
      </p>
    </div>
  );
}
