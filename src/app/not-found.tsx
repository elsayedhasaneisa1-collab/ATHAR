import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { AtharCard, AtharButton } from "@/components/ui/DesignSystem";

export default function NotFoundPage() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-12">
      <AtharCard glow className="max-w-md w-full text-center space-y-4 py-10">
        <Compass className="w-12 h-12 text-[var(--athar-gold)] mx-auto" />
        <h1 className="font-display text-3xl font-bold athar-gold-text">الصفحة غير موجودة (404)</h1>
        <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
          يبدو أن الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.
        </p>
        <div className="pt-2">
          <Link href="/">
            <AtharButton variant="primary">
              <Home className="w-4 h-4" /> العودة إلى الرئيسية
            </AtharButton>
          </Link>
        </div>
      </AtharCard>
    </div>
  );
}
