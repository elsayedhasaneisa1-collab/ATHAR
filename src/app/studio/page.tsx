"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Palette } from "lucide-react";
import { AtharBadge, AtharSkeleton } from "@/components/ui/DesignSystem";

// Lazy-load studio editor ONLY when user opens /studio (Resource conservation rule!)
const AtharStudioEditor = dynamic(() => import("@/components/studio/AtharStudioEditor"), {
  ssr: false,
  loading: () => <AtharSkeleton className="h-[520px]" />,
});

export default function StudioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1.5">
        <AtharBadge tone="gold">
          <Palette className="w-3.5 h-3.5" /> ATHAR STUDIO — استوديو التصميم الفاخر
        </AtharBadge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">
          استوديو تصميم البطاقات والدعوات
        </h1>
        <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
          صمّم بطاقات قرآنية ودعوات ومنشورات إسلامية فاخرة بزخارف هندسية وتصدير فوري بدقة 1200×630 أو 1080×1080.
        </p>
      </div>

      <AtharStudioEditor />
    </div>
  );
}
