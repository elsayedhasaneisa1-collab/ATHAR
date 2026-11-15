"use client";

import React, { useEffect, useState } from "react";
import { Archive, Plus, Eye, EyeOff, Trash2, ExternalLink, Info } from "lucide-react";
import {
  AtharCard,
  AtharBadge,
  AtharButton,
  AtharInput,
  AtharTextarea,
  VerificationSeal,
} from "@/components/ui/DesignSystem";
import { useAthar } from "@/components/providers/AtharProvider";

interface LegacyRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  externalUrl: string | null;
  isPublic?: boolean;
  ownerName?: string;
  ownerBadge?: string | null;
}

export default function LegacyPage() {
  const { user, toast } = useAthar();
  const [tab, setTab] = useState<"mine" | "public">("mine");
  const [myItems, setMyItems] = useState<LegacyRow[]>([]);
  const [publicItems, setPublicItems] = useState<LegacyRow[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("initiative");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/legacy?scope=public")
      .then((r) => r.json())
      .then((d) => setPublicItems(d.items || []))
      .catch(() => undefined);
    if (user) {
      fetch("/api/legacy?scope=mine")
        .then((r) => r.json())
        .then((d) => setMyItems(d.items || []))
        .catch(() => undefined);
    }
  };

  useEffect(() => {
    load();
    if (!user) setTab("public");
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ type: "warning", title: "سجّل الدخول لأرشفة مبادراتك" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/legacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description, externalUrl, isPublic }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast({ type: "error", title: d.error || "تعذر الحفظ" });
      } else {
        setTitle("");
        setDescription("");
        setExternalUrl("");
        load();
        toast({ type: "success", title: "تمت إضافة العمل إلى سجل الأثر الرقمي" });
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublic = async (item: LegacyRow) => {
    await fetch("/api/legacy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isPublic: !item.isPublic }),
    });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/legacy?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    load();
    toast({ type: "success", title: "تم حذف السجل" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1.5">
        <AtharBadge tone="gold">
          <Archive className="w-3.5 h-3.5" /> ATHAR LEGACY — مساحة الأثر الرقمي
        </AtharBadge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">
          أرشيف المبادرات والأثر الرقمي
        </h1>
        <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
          وثّق مبادراتك، مشاريعك الخيرية، مقالاتك، والروابط النافعة مع تحكم كامل في إظهارها للعامة أو إبقائها خاصة.
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[var(--athar-border-subtle)] text-xs text-[var(--athar-text-muted)] flex items-start gap-2">
        <Info className="w-4 h-4 text-[var(--athar-gold)] shrink-0 mt-0.5" />
        <span>
          شفافية التخزين: نحفظ سجلاتك بأمان داخل قاعدة البيانات، ولكن لا نعد ببقاء البيانات إلى الأبد؛ يُرجى الاحتفاظ بنسخ احتياطية شخصية من أعمالك المهمة.
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
            tab === "mine" ? "athar-gold-gradient text-[#06120D] border-transparent" : "bg-white/[0.03] border-[var(--athar-border-subtle)]"
          }`}
        >
          أثري الشخصي ({myItems.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("public")}
          className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
            tab === "public" ? "athar-gold-gradient text-[#06120D] border-transparent" : "bg-white/[0.03] border-[var(--athar-border-subtle)]"
          }`}
        >
          المبادرات المنشورة للعامة ({publicItems.length})
        </button>
      </div>

      {tab === "mine" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <AtharCard>
              <form onSubmit={handleAdd} className="space-y-3">
                <AtharInput label="عنوان المبادرة أو المشروع" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <div className="space-y-1">
                  <label className="block text-sm font-medium">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                  >
                    <option value="initiative">مبادرة</option>
                    <option value="project">مشروع</option>
                    <option value="charity">عمل خيري</option>
                    <option value="article">مقال نافع</option>
                    <option value="resource">مرجع / رابط علمي</option>
                  </select>
                </div>
                <AtharTextarea label="الوصف" required value={description} onChange={(e) => setDescription(e.target.value)} />
                <AtharInput
                  label="رابط خارجي (HTTPS اختياري)"
                  dir="ltr"
                  placeholder="https://..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  عرض هذه الصفحة في الأثر العام (اختياري)
                </label>
                <AtharButton type="submit" variant="primary" loading={saving} className="w-full">
                  <Plus className="w-4 h-4" /> حفظ في الأرشيف
                </AtharButton>
              </form>
            </AtharCard>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {myItems.length === 0 ? (
              <AtharCard>
                <p className="text-sm text-[var(--athar-text-muted)]">لا توجد مبادرات مؤرشفة في حسابك بعد.</p>
              </AtharCard>
            ) : (
              myItems.map((it) => (
                <AtharCard key={it.id} className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base">{it.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <AtharBadge tone={it.isPublic ? "emerald" : "neutral"}>
                        {it.isPublic ? "عام" : "خاص"}
                      </AtharBadge>
                      <button
                        type="button"
                        onClick={() => togglePublic(it)}
                        title={it.isPublic ? "إخفاء الصفحة" : "نشر للعامة"}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        {it.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">{it.description}</p>
                  {it.externalUrl && (
                    <a
                      href={it.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--athar-gold-soft)] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> فتح الرابط
                    </a>
                  )}
                </AtharCard>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicItems.length === 0 ? (
            <AtharCard className="col-span-full">
              <p className="text-sm text-[var(--athar-text-muted)]">لا توجد مبادرات عامة منشورة حاليًا.</p>
            </AtharCard>
          ) : (
            publicItems.map((it) => (
              <AtharCard key={it.id} className="space-y-3">
                <h3 className="font-bold text-base text-[var(--athar-gold-soft)]">{it.title}</h3>
                <p className="text-xs text-[var(--athar-text-muted)] leading-relaxed">{it.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--athar-border-subtle)] text-xs">
                  <span className="flex items-center gap-1.5">
                    {it.ownerName}
                    <VerificationSeal badge={it.ownerBadge} />
                  </span>
                  {it.externalUrl && (
                    <a href={it.externalUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--athar-gold)]">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </AtharCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}
