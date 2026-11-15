"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import {
  AtharCard,
  AtharInput,
  AtharPasswordInput,
  AtharButton,
  AtharLogo,
} from "@/components/ui/DesignSystem";
import { useAthar } from "@/components/providers/AtharProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, toast } = useAthar();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [websiteTrap, setWebsiteTrap] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, websiteTrap }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "بيانات الدخول غير صحيحة");
        return;
      }

      await refreshUser();
      toast({ type: "success", title: "مرحبًا بعودتك إلى ATHAR" });
      router.push("/");
    } catch {
      setError("تعذر الاتصال بالخادم، حاول لاحقًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-6 space-y-2">
        <div className="flex justify-center">
          <AtharLogo size={46} />
        </div>
        <h1 className="font-display text-3xl font-bold athar-gold-text pt-2">تسجيل الدخول</h1>
        <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
          ادخل برقم هاتفك وكلمة المرور دون الحاجة لرموز OTP
        </p>
      </div>

      <AtharCard glow>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="hidden" aria-hidden="true">
            <input value={websiteTrap} onChange={(e) => setWebsiteTrap(e.target.value)} tabIndex={-1} />
          </div>

          <AtharInput
            label="رقم الهاتف"
            required
            type="tel"
            dir="ltr"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <AtharPasswordInput
            label="كلمة المرور"
            required
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-[var(--athar-gold-soft)] hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/35 text-xs text-red-300">
              {error}
            </div>
          )}

          <AtharButton type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            <LogIn className="w-4 h-4" />
            دخول إلى حسابي
          </AtharButton>

          <div className="pt-3 border-t border-[var(--athar-border-subtle)] flex items-center justify-between text-xs text-[var(--athar-text-muted)]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              جلسات HttpOnly محمية
            </span>
            <Link href="/register" className="text-[var(--athar-gold-soft)] font-semibold hover:underline">
              حساب جديد
            </Link>
          </div>
        </form>
      </AtharCard>
    </div>
  );
}
