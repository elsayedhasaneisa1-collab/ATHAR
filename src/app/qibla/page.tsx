"use client";

import React, { useEffect, useState } from "react";
import { Compass, Info, Smartphone } from "lucide-react";
import {
  AtharCard,
  AtharBadge,
  AtharButton,
  GovernorateSearchSelect,
} from "@/components/ui/DesignSystem";
import { findGovernorate } from "@/lib/constants";
import { calculateQiblaBearing } from "@/lib/islamic-data";
import { useAthar } from "@/components/providers/AtharProvider";

export default function QiblaPage() {
  const { user, toast } = useAthar();
  const [governorate, setGovernorate] = useState("القاهرة");
  const [heading, setHeading] = useState<number>(0);
  const [sensorActive, setSensorActive] = useState(false);
  const [sensorUnsupported, setSensorUnsupported] = useState(false);

  useEffect(() => {
    if (user?.governorate) setGovernorate(user.governorate);
  }, [user]);

  const govInfo = findGovernorate(governorate) || findGovernorate("القاهرة")!;
  const qiblaAngle = calculateQiblaBearing(govInfo.lat, govInfo.lng);
  const needleRotation = (qiblaAngle - heading + 360) % 360;

  const enableCompassSensor = async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setSensorUnsupported(true);
      toast({ type: "info", title: "جهازك لا يدعم مستشعر البوصلة", message: "يمكنك استخدام مؤشر الشمال اليدوي بالأسفل." });
      return;
    }

    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    try {
      if (typeof DOE.requestPermission === "function") {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          toast({ type: "warning", title: "لم يتم منح إذن المستشعر" });
          return;
        }
      }
      setSensorActive(true);
      toast({ type: "success", title: "تم تفعيل مستشعر البوصلة", message: "حرّك الهاتف بشكل رقم 8 للمعايرة الدقيقة." });
    } catch {
      setSensorUnsupported(true);
    }
  };

  useEffect(() => {
    if (!sensorActive) return;
    const handler = (event: DeviceOrientationEvent) => {
      const webkitHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
        .webkitCompassHeading;
      if (typeof webkitHeading === "number") {
        setHeading(Math.round(webkitHeading));
      } else if (typeof event.alpha === "number") {
        setHeading(Math.round((360 - event.alpha) % 360));
      }
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [sensorActive]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1.5">
        <AtharBadge tone="gold">
          <Compass className="w-3.5 h-3.5" /> ATHAR QIBLA — اتجاه الكعبة المشرفة
        </AtharBadge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">بوصلة القبلة</h1>
        <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
          حساب فلكي دقيق لزاوية القبلة بناءً على محافظتك دون جمع موقعك الدقيق عبر GPS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <AtharCard glow className="flex flex-col items-center text-center py-8 space-y-6">
            {/* Interactive Compass Dial */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg viewBox="0 0 240 240" className="w-full h-full">
                <circle cx="120" cy="120" r="110" fill="#071913" stroke="rgba(212,175,55,0.45)" strokeWidth="2" />
                <circle cx="120" cy="120" r="92" fill="none" stroke="rgba(212,175,55,0.16)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="120" y="28" textAnchor="middle" fill="#D4AF37" fontSize="13" fontWeight="bold">ش</text>
                <text x="120" y="220" textAnchor="middle" fill="#9EB0A8" fontSize="12">ج</text>
                <text x="215" y="124" textAnchor="middle" fill="#9EB0A8" fontSize="12">ق</text>
                <text x="25" y="124" textAnchor="middle" fill="#9EB0A8" fontSize="12">غ</text>

                {/* Rotating Qibla Pointer */}
                <g transform={`rotate(${needleRotation} 120 120)`} className="transition-transform duration-300">
                  <polygon points="120,30 132,120 120,104 108,120" fill="#D4AF37" />
                  <polygon points="120,210 127,120 120,132 113,120" fill="rgba(16,185,129,0.45)" />
                  <rect x="112" y="42" width="16" height="16" rx="3" fill="#060A09" stroke="#F8E49E" strokeWidth="1.5" />
                  <circle cx="120" cy="120" r="8" fill="#F8E49E" />
                </g>
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[var(--athar-text-muted)]">زاوية القبلة من الشمال الحقيقي ({govInfo.nameAr})</p>
              <p className="text-4xl font-extrabold athar-gold-text font-mono">{qiblaAngle}°</p>
              <p className="text-xs text-emerald-300">
                اتجاه الجنوب الشرقي نحو الكعبة المشرفة
              </p>
            </div>

            <div className="w-full max-w-sm space-y-2 pt-2 border-t border-[var(--athar-border-subtle)]">
              <div className="flex items-center justify-between text-xs text-[var(--athar-text-muted)]">
                <span>البديل اليدوي (توجيه الشمال):</span>
                <span className="font-mono text-[var(--athar-gold-soft)]">{heading}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={359}
                value={heading}
                onChange={(e) => {
                  setSensorActive(false);
                  setHeading(Number(e.target.value));
                }}
                aria-label="توجيه الشمال يدويًا"
                className="w-full accent-[#D4AF37]"
              />
            </div>

            <AtharButton variant="secondary" onClick={enableCompassSensor}>
              <Smartphone className="w-4 h-4" />
              {sensorActive ? "المستشعر يعمل حاليًا" : "تفعيل مستشعر البوصلة في الهاتف"}
            </AtharButton>

            {sensorUnsupported && (
              <p className="text-xs text-amber-300">
                المستشعر غير مدعوم على هذا الجهاز أو المتصفح؛ استخدم الشريط اليدوي أعلاه بعد تحديد اتجاه الشمال.
              </p>
            )}
          </AtharCard>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <AtharCard className="space-y-4">
            <GovernorateSearchSelect
              label="اختر محافظتك"
              value={governorate}
              onChange={setGovernorate}
              required={false}
            />
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[var(--athar-border-subtle)] text-xs space-y-1.5 text-[var(--athar-text-muted)]">
              <p className="font-bold text-[var(--athar-gold-soft)] flex items-center gap-1.5">
                <Info className="w-4 h-4" /> تعليمات المعايرة الدقيقة
              </p>
              <ul className="list-disc pr-4 space-y-1">
                <li>أمسك الهاتف بشكل أفقي ومستوٍ بعيدًا عن الأجهزة المعدنية والمغناطيس.</li>
                <li>حرّك الهاتف في الهواء على شكل رقم (8) مرتين لمعايرة البوصلة المغناطيسية.</li>
                <li>عند استخدام الكمبيوتر، اعتمد على الزاوية المعلنة ({qiblaAngle}° من الشمال باتجاه الشرق).</li>
              </ul>
            </div>
          </AtharCard>
        </div>
      </div>
    </div>
  );
}
