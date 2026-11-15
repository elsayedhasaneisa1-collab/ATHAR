"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { AtharButton, AtharCard } from "@/components/ui/DesignSystem";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-12">
      <AtharCard className="max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold">حدث خطأ غير متوقع</h2>
        <p className="text-sm text-[var(--athar-text-muted)]">
          نعتذر عن هذا الخلل المؤقت. تم الحفاظ على أمان بياناتك، يمكنك إعادة المحاولة الآن.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <AtharButton variant="primary" onClick={() => reset()}>
            <RotateCcw className="w-4 h-4" /> إعادة المحاولة
          </AtharButton>
          <Link href="/">
            <AtharButton variant="outline">
              <Home className="w-4 h-4" /> الرئيسية
            </AtharButton>
          </Link>
        </div>
      </AtharCard>
    </div>
  );
}
