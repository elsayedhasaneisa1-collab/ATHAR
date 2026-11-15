"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Send,
  Plus,
  Copy,
  Pause,
  Play,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Flag,
  ShieldCheck,
} from "lucide-react";
import {
  AtharCard,
  AtharBadge,
  AtharButton,
  AtharInput,
  AtharTextarea,
  AtharDialog,
  VerificationSeal,
} from "@/components/ui/DesignSystem";
import { INVITATION_TYPES, INVITATION_TEMPLATES } from "@/lib/constants";
import { useAthar } from "@/components/providers/AtharProvider";

interface InvitationRow {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  templateId: string;
  themeColor: string;
  fontFamily: string;
  status: string;
  viewsCount: number;
  sharesCount: number;
  creatorName?: string;
  creatorBadge?: string | null;
}

interface OgImageRow {
  id: string;
  imageUrl: string;
  altText: string;
  contentType: string;
}

export default function InvitationsPage() {
  const { user, toast } = useAthar();
  const [tab, setTab] = useState<"editor" | "mine" | "public" | "og">("public");
  const [publicList, setPublicList] = useState<InvitationRow[]>([]);
  const [myList, setMyList] = useState<InvitationRow[]>([]);
  const [ogImages, setOgImages] = useState<OgImageRow[]>([]);
  const [quota, setQuota] = useState<{
    plan: string;
    limit: number;
    scope: string;
    used: number;
    ogImageLimit: number;
    ogImageUsed: number;
  } | null>(null);

  // Editor form state
  const [type, setType] = useState<string>("quran");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState<string>("emerald-royal");
  const [themeColor, setThemeColor] = useState("#D4AF37");
  const [fontFamily, setFontFamily] = useState<"amiri" | "cairo" | "tajawal">("amiri");
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedOgId, setSelectedOgId] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [submitting, setSubmitting] = useState(false);

  // OG Image Add form
  const [newOgUrl, setNewOgUrl] = useState("");
  const [newOgAlt, setNewOgAlt] = useState("");
  const [addingOg, setAddingOg] = useState(false);

  // Report dialog
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("محتوى مخالف");

  const loadAll = () => {
    fetch("/api/invitations?scope=public")
      .then((r) => r.json())
      .then((d) => setPublicList(d.invitations || []))
      .catch(() => undefined);

    if (user) {
      fetch("/api/invitations?scope=mine")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d) return;
          setMyList(d.invitations || []);
          setOgImages(d.ogImages || []);
          setQuota(d.quota || null);
        })
        .catch(() => undefined);
    }
  };

  useEffect(() => {
    loadAll();
  }, [user]);

  const createInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ type: "warning", title: "يرجى تسجيل الدخول لإنشاء دعوة" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          templateId,
          themeColor,
          fontFamily,
          targetUrl,
          ogImageId: selectedOgId || null,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ type: "error", title: data.error || "تعذر إنشاء الدعوة" });
      } else {
        toast({ type: "success", title: "تم حفظ الدعوة بنجاح" });
        setTitle("");
        setDescription("");
        setTargetUrl("");
        setTab("mine");
        loadAll();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (inv: InvitationRow) => {
    const next = inv.status === "published" ? "paused" : "published";
    const res = await fetch("/api/invitations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inv.id, status: next }),
    });
    if (res.ok) {
      loadAll();
      toast({ type: "success", title: next === "published" ? "تم نشر الدعوة" : "تم إيقاف الدعوة مؤقتًا" });
    }
  };

  const deleteInvitation = async (id: string) => {
    const res = await fetch(`/api/invitations?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      loadAll();
      toast({ type: "success", title: "تم حذف الدعوة" });
    }
  };

  const addOgImageUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingOg(true);
    try {
      const res = await fetch("/api/invitations/og-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: newOgUrl, altText: newOgAlt }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ type: "error", title: data.error || "تم رفض رابط الصورة" });
      } else {
        toast({ type: "success", title: "تم التحقق من الرابط وإضافته إلى مكتبة OG" });
        setNewOgUrl("");
        setNewOgAlt("");
        loadAll();
      }
    } finally {
      setAddingOg(false);
    }
  };

  const deleteOgImage = async (id: string) => {
    await fetch(`/api/invitations/og-images?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    loadAll();
  };

  const submitReport = async () => {
    if (!reportTargetId) return;
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "invitation", targetId: reportTargetId, reason: reportReason }),
    });
    const d = await res.json();
    toast({ type: res.ok ? "success" : "error", title: d.message || d.error });
    setReportTargetId(null);
  };

  const copyShareUrl = (slug: string) => {
    const url = `${window.location.origin}/invitations/${slug}`;
    navigator.clipboard.writeText(url).catch(() => undefined);
    fetch("/api/invitations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackShare: true, slug }),
    }).catch(() => undefined);
    toast({ type: "success", title: "تم نسخ رابط الدعوة بمعاينة Open Graph" });
  };

  const activeTemplate = INVITATION_TEMPLATES.find((t) => t.id === templateId) || INVITATION_TEMPLATES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <AtharBadge tone="gold">
            <Send className="w-3.5 h-3.5" /> ATHAR INVITATIONS — دعوات ومعاينات Open Graph
          </AtharBadge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">نظام الدعوات</h1>
          <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
            أنشئ بطاقات دعوة للقرآن والختمات والأذكار والخير بمعاينة فورية وروابط قابلة للمشاركة على واتساب وفيسبوك وتيليجرام وإكس.
          </p>
        </div>

        {quota && (
          <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-[var(--athar-border)] text-xs space-y-0.5">
            <p>
              رصيد الدعوات ({quota.plan}):{" "}
              <strong className="text-[var(--athar-gold-soft)]">
                {quota.used} / {quota.limit === -1 ? "غير محدود" : quota.limit}
              </strong>
            </p>
            <p className="text-[11px] text-[var(--athar-text-muted)]">
              صور OG المخصصة: {quota.ogImageUsed} / {quota.ogImageLimit} رابط للحساب
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "public", label: "الدعوات العامة" },
            { id: "editor", label: "إنشاء دعوة جديدة" },
            { id: "mine", label: `دعواتي (${myList.length})` },
            { id: "og", label: "مكتبة روابط صور OG" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              tab === t.id
                ? "athar-gold-gradient text-[#06120D] border-transparent"
                : "bg-white/[0.03] border-[var(--athar-border-subtle)] text-[var(--athar-text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* EDITOR TAB */}
      {tab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <AtharCard>
              <form onSubmit={createInvitation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">نوع الدعوة</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                    >
                      {INVITATION_TYPES.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">القالب البصري</label>
                    <select
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                    >
                      {INVITATION_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name} ({tpl.minPlan}+)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <AtharInput
                  label="عنوان الدعوة"
                  required
                  placeholder="مثال: دعوة للمشاركة في ختمة سورة الكهف يوم الجمعة"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <AtharTextarea
                  label="نص وتفاصيل الدعوة"
                  required
                  placeholder="اكتب رسالة مؤثرة واضحة تدعو إلى الخير..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">لون اللمسة</label>
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-full h-11 p-1 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">الخط</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as "amiri" | "cairo" | "tajawal")}
                      className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                    >
                      <option value="amiri">أميري (كلاسيكي فاخر)</option>
                      <option value="cairo">القاهرة (عصري)</option>
                      <option value="tajawal">تجوال (هادئ)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">الحالة</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                      className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                    >
                      <option value="published">نشر فوري</option>
                      <option value="draft">حفظ كمسودة</option>
                    </select>
                  </div>
                </div>

                <AtharInput
                  label="رابط إضافي (اختياري — HTTPS فقط)"
                  type="url"
                  dir="ltr"
                  placeholder="https://..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />

                {ogImages.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">صورة Open Graph من مكتبة حسابك</label>
                    <select
                      value={selectedOgId}
                      onChange={(e) => setSelectedOgId(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                    >
                      <option value="">صورة ATHAR الافتراضية (1200×630)</option>
                      {ogImages.map((img) => (
                        <option key={img.id} value={img.id}>
                          {img.altText} — {img.imageUrl.slice(0, 45)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <AtharButton type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
                  <Plus className="w-4 h-4" /> حفظ ونشر الدعوة
                </AtharButton>
              </form>
            </AtharCard>
          </div>

          {/* LIVE PREVIEW */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-bold text-[var(--athar-gold-soft)]">معاينة بطاقة الدعوة الفورية</p>
            <div
              className="rounded-3xl p-7 min-h-[320px] flex flex-col justify-between text-center shadow-2xl border-2"
              style={{
                background: activeTemplate.bg,
                borderColor: themeColor,
                color: activeTemplate.id === "ivory-mosque" ? "#16261E" : "#F5F3EC",
              }}
            >
              <p className="text-[11px] tracking-[0.22em] opacity-80" style={{ color: themeColor }}>
                ATHAR | أَثَر — دعوة إلى الخير
              </p>
              <div className="space-y-3 my-6">
                <h2
                  className={`text-2xl sm:text-3xl font-bold leading-snug ${
                    fontFamily === "amiri" ? "font-quran" : ""
                  }`}
                  style={{ color: themeColor }}
                >
                  {title || "عنوان دعوتك سيظهر هنا"}
                </h2>
                <p className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
                  {description || "اكتب تفاصيل الدعوة لتظهر هنا بمعاينة فورية راقية جاهزة للنشر والمشاركة."}
                </p>
              </div>
              <p className="text-[11px] opacity-75">«اترك أثرًا يبقى بعدك»</p>
            </div>
          </div>
        </div>
      )}

      {/* MY INVITATIONS TAB */}
      {tab === "mine" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!user ? (
            <AtharCard className="col-span-full">
              <p className="text-sm text-[var(--athar-text-muted)]">يرجى تسجيل الدخول لإدارة دعواتك.</p>
            </AtharCard>
          ) : myList.length === 0 ? (
            <AtharCard className="col-span-full text-center py-8 space-y-3">
              <p className="text-sm text-[var(--athar-text-muted)]">لم تنشئ أي دعوة بعد.</p>
              <AtharButton variant="primary" size="sm" onClick={() => setTab("editor")}>
                إنشاء أول دعوة
              </AtharButton>
            </AtharCard>
          ) : (
            myList.map((inv) => (
              <AtharCard key={inv.id} className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <AtharBadge tone={inv.status === "published" ? "emerald" : "neutral"}>
                      {inv.status === "published" ? "منشورة" : inv.status === "draft" ? "مسودة" : "متوقفة"}
                    </AtharBadge>
                    <span className="text-[11px] text-[var(--athar-text-muted)]">
                      {inv.viewsCount} مشاهدة • {inv.sharesCount} مشاركة
                    </span>
                  </div>
                  <h3 className="font-bold text-base">{inv.title}</h3>
                  <p className="text-xs text-[var(--athar-text-muted)] line-clamp-3">{inv.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--athar-border-subtle)]">
                  <Link href={`/invitations/${inv.slug}`}>
                    <AtharButton variant="outline" size="sm">
                      <ExternalLink className="w-3.5 h-3.5" /> فتح
                    </AtharButton>
                  </Link>
                  <AtharButton variant="ghost" size="sm" onClick={() => copyShareUrl(inv.slug)}>
                    <Copy className="w-3.5 h-3.5" /> نسخ
                  </AtharButton>
                  <AtharButton variant="ghost" size="sm" onClick={() => toggleStatus(inv)}>
                    {inv.status === "published" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </AtharButton>
                  <AtharButton variant="ghost" size="sm" onClick={() => deleteInvitation(inv.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </AtharButton>
                </div>
              </AtharCard>
            ))
          )}
        </div>
      )}

      {/* PUBLIC INVITATIONS TAB */}
      {tab === "public" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicList.length === 0 ? (
            <AtharCard className="col-span-full text-center py-10 space-y-3">
              <p className="text-sm text-[var(--athar-text-muted)]">لا توجد دعوات عامة منشورة حاليًا. كن أول من ينشر دعوة خير!</p>
              <AtharButton variant="primary" size="sm" onClick={() => setTab("editor")}>
                إنشاء دعوة الآن
              </AtharButton>
            </AtharCard>
          ) : (
            publicList.map((inv) => (
              <AtharCard key={inv.id} className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <AtharBadge tone="gold">
                      {INVITATION_TYPES.find((t) => t.id === inv.type)?.label || inv.type}
                    </AtharBadge>
                    <button
                      type="button"
                      onClick={() => setReportTargetId(inv.id)}
                      title="الإبلاغ عن محتوى مخالف"
                      className="text-[var(--athar-text-muted)] hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-base">{inv.title}</h3>
                  <p className="text-xs text-[var(--athar-text-muted)] line-clamp-3">{inv.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--athar-border-subtle)]">
                  <div className="flex items-center justify-between text-[11px] text-[var(--athar-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      {inv.creatorName}
                      <VerificationSeal badge={inv.creatorBadge} />
                    </span>
                    <span>{inv.viewsCount} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/invitations/${inv.slug}`} className="flex-1">
                      <AtharButton variant="secondary" size="sm" className="w-full">
                        عرض الدعوة
                      </AtharButton>
                    </Link>
                    <AtharButton variant="outline" size="sm" onClick={() => copyShareUrl(inv.slug)}>
                      <Copy className="w-3.5 h-3.5" />
                    </AtharButton>
                  </div>
                </div>
              </AtharCard>
            ))
          )}
        </div>
      )}

      {/* OG IMAGES LIBRARY TAB (PRO VERIFIED: 5, VIP VERIFIED: 50, HTTPS SSRF PROTECTED) */}
      {tab === "og" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <AtharCard className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--athar-gold-soft)]">
                <ImageIcon className="w-4 h-4" /> إضافة رابط صورة Open Graph مباشرة
              </div>
              <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">
                متاح حصريًا لحسابات <strong>PRO VERIFIED</strong> (5 روابط للحساب) و<strong>VIP VERIFIED</strong> (50 رابطًا للحساب). يُعاد استخدام الصور عبر عدة دعوات دون رفع ملفات، ويتم فحص كل رابط ضد SSRF والتأكد من كونه PNG/JPG/WebP عبر HTTPS.
              </p>
              <form onSubmit={addOgImageUrl} className="space-y-3">
                <AtharInput
                  label="رابط الصورة المباشر (HTTPS)"
                  required
                  type="url"
                  dir="ltr"
                  placeholder="https://example.com/banner-1200x630.png"
                  value={newOgUrl}
                  onChange={(e) => setNewOgUrl(e.target.value)}
                />
                <AtharInput
                  label="الوصف البديل (Alt Text)"
                  required
                  placeholder="وصف مختصر للصورة"
                  value={newOgAlt}
                  onChange={(e) => setNewOgAlt(e.target.value)}
                />
                <AtharButton type="submit" variant="primary" loading={addingOg} className="w-full">
                  <ShieldCheck className="w-4 h-4" /> فحص وإضافة الرابط
                </AtharButton>
              </form>
            </AtharCard>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {ogImages.length === 0 ? (
              <AtharCard>
                <p className="text-sm text-[var(--athar-text-muted)]">
                  لا توجد روابط صور OG مخصصة حاليًا. تستخدم جميع الدعوات صورة ATHAR الافتراضية (1200×630 PNG) المتوافقة مع واتساب وفيسبوك وتيليجرام وإكس.
                </p>
              </AtharCard>
            ) : (
              ogImages.map((img) => (
                <AtharCard key={img.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{img.altText}</p>
                    <p className="text-xs text-[var(--athar-text-muted)] font-mono truncate">{img.imageUrl}</p>
                  </div>
                  <AtharButton variant="danger" size="sm" onClick={() => deleteOgImage(img.id)}>
                    حذف
                  </AtharButton>
                </AtharCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* Report Dialog */}
      <AtharDialog
        open={Boolean(reportTargetId)}
        onClose={() => setReportTargetId(null)}
        title="الإبلاغ عن محتوى مخالف"
        tone="warning"
        footer={
          <>
            <AtharButton variant="ghost" size="sm" onClick={() => setReportTargetId(null)}>
              إلغاء
            </AtharButton>
            <AtharButton variant="danger" size="sm" onClick={submitReport}>
              إرسال البلاغ
            </AtharButton>
          </>
        }
      >
        <AtharInput
          label="سبب البلاغ"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
      </AtharDialog>
    </div>
  );
}
