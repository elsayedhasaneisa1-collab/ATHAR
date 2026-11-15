"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Save, Trash2, Sparkles } from "lucide-react";
import { AtharCard, AtharButton, AtharInput, AtharTextarea } from "@/components/ui/DesignSystem";
import { useAthar } from "@/components/providers/AtharProvider";

interface StudioDesign {
  headline: string;
  body: string;
  footer: string;
  bgPrimary: string;
  bgSecondary: string;
  accentColor: string;
  textColor: string;
  ornament: "octagram" | "crescent" | "frame";
  size: "og" | "square";
}

interface SavedProject {
  id: string;
  title: string;
  category: string;
  designJson: StudioDesign;
}

const PRESETS: Array<{ name: string; design: Partial<StudioDesign> }> = [
  {
    name: "زمرد أَثَر الملكي",
    design: { bgPrimary: "#061A14", bgSecondary: "#0B3A2A", accentColor: "#D4AF37", textColor: "#F5F3EC", ornament: "octagram" },
  },
  {
    name: "أسود منتصف الليل والذهب",
    design: { bgPrimary: "#050707", bgSecondary: "#1A1508", accentColor: "#E8C55A", textColor: "#FAF6E9", ornament: "crescent" },
  },
  {
    name: "عاجي فاخر للآيات",
    design: { bgPrimary: "#F8F3E6", bgSecondary: "#E9DEC4", accentColor: "#9A7214", textColor: "#14241D", ornament: "frame" },
  },
  {
    name: "أزرق أندلسي",
    design: { bgPrimary: "#06121F", bgSecondary: "#0D324D", accentColor: "#DFB84B", textColor: "#F0F6FA", ornament: "octagram" },
  },
];

export default function AtharStudioEditor() {
  const { user, toast } = useAthar();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("بطاقة أثر دعوية");
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [saving, setSaving] = useState(false);

  const [design, setDesign] = useState<StudioDesign>({
    headline: "اترك أثرًا يبقى بعدك",
    body: "﴿ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ ﴾",
    footer: "ATHAR | أَثَر — المنظومة الرقمية الإسلامية",
    bgPrimary: "#061A14",
    bgSecondary: "#0B3A2A",
    accentColor: "#D4AF37",
    textColor: "#F5F3EC",
    ornament: "octagram",
    size: "og",
  });

  const loadProjects = () => {
    if (!user) return;
    fetch("/api/studio")
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((d) => setProjects(d.projects || []))
      .catch(() => undefined);
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  // Draw crisp high-res canvas every time design updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = design.size === "og" ? 1200 : 1080;
    const height = design.size === "og" ? 630 : 1080;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, design.bgPrimary);
    grad.addColorStop(1, design.bgSecondary);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle geometric lattice
    ctx.save();
    ctx.strokeStyle = design.accentColor;
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1.5;
    for (let x = 60; x < width; x += 120) {
      for (let y = 60; y < height; y += 120) {
        ctx.beginPath();
        ctx.arc(x, y, 36, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Double Luxury Border Frame
    ctx.strokeStyle = design.accentColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, width - 64, height - 64);
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(46, 46, width - 92, height - 92);
    ctx.globalAlpha = 1;

    // Corner Ornaments
    const corners = [
      [66, 66],
      [width - 66, 66],
      [66, height - 66],
      [width - 66, height - 66],
    ];
    ctx.fillStyle = design.accentColor;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Emblem
    if (design.ornament === "crescent") {
      ctx.save();
      ctx.fillStyle = design.accentColor;
      ctx.beginPath();
      ctx.arc(width / 2, 125, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = design.bgPrimary;
      ctx.beginPath();
      ctx.arc(width / 2 - 12, 120, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (design.ornament === "octagram") {
      ctx.save();
      ctx.translate(width / 2, 125);
      ctx.strokeStyle = design.accentColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-22, -22, 44, 44);
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-22, -22, 44, 44);
      ctx.restore();
    }

    // RTL Arabic Typography
    ctx.direction = "rtl";
    ctx.textAlign = "center";

    // Headline
    ctx.fillStyle = design.accentColor;
    ctx.font = `bold ${design.size === "og" ? 56 : 64}px Amiri, Cairo, serif`;
    ctx.fillText(design.headline, width / 2, design.size === "og" ? 255 : 370, width - 160);

    // Body (word-wrapped cleanly)
    ctx.fillStyle = design.textColor;
    ctx.font = `${design.size === "og" ? 34 : 42}px Amiri, Cairo, serif`;
    const words = design.body.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const w of words) {
      const test = currentLine ? `${currentLine} ${w}` : w;
      if (ctx.measureText(test).width > width - 200 && currentLine) {
        lines.push(currentLine);
        currentLine = w;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);

    const startY = design.size === "og" ? 345 : 495;
    lines.slice(0, 5).forEach((ln, idx) => {
      ctx.fillText(ln, width / 2, startY + idx * (design.size === "og" ? 52 : 64), width - 180);
    });

    // Footer Signature
    ctx.fillStyle = design.accentColor;
    ctx.globalAlpha = 0.85;
    ctx.font = "600 22px Cairo, sans-serif";
    ctx.fillText(design.footer, width / 2, height - 82, width - 160);
    ctx.globalAlpha = 1;
  }, [design]);

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `athar-studio-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ type: "success", title: "تم تصدير البطاقة بجودة عالية PNG" });
  };

  const saveProject = async () => {
    if (!user) {
      toast({ type: "warning", title: "يرجى تسجيل الدخول لحفظ مشاريعك في الاستوديو" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId, title: projectTitle, category: design.size, designJson: design }),
      });
      const d = await res.json();
      if (res.ok) {
        setProjectId(d.project.id);
        loadProjects();
        toast({ type: "success", title: "تم حفظ المشروع في حسابك" });
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/studio?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (projectId === id) setProjectId(null);
    loadProjects();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-4">
        <AtharCard className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setDesign((prev) => ({ ...prev, ...p.design }))}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-[var(--athar-border-subtle)] text-xs hover:border-[var(--athar-gold)]/50 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[var(--athar-gold)]" />
                {p.name}
              </button>
            ))}
          </div>

          <AtharInput label="اسم المشروع" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
          <AtharInput
            label="العنوان الرئيسي"
            value={design.headline}
            onChange={(e) => setDesign((d) => ({ ...d, headline: e.target.value }))}
          />
          <AtharTextarea
            label="النص أو الآية أو الذكر"
            value={design.body}
            onChange={(e) => setDesign((d) => ({ ...d, body: e.target.value }))}
          />
          <AtharInput
            label="التوقيع السفلي"
            value={design.footer}
            onChange={(e) => setDesign((d) => ({ ...d, footer: e.target.value }))}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[11px] block mb-1">خلفية 1</label>
              <input
                type="color"
                value={design.bgPrimary}
                onChange={(e) => setDesign((d) => ({ ...d, bgPrimary: e.target.value }))}
                className="w-full h-9 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] block mb-1">خلفية 2</label>
              <input
                type="color"
                value={design.bgSecondary}
                onChange={(e) => setDesign((d) => ({ ...d, bgSecondary: e.target.value }))}
                className="w-full h-9 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] block mb-1">الزخرفة</label>
              <input
                type="color"
                value={design.accentColor}
                onChange={(e) => setDesign((d) => ({ ...d, accentColor: e.target.value }))}
                className="w-full h-9 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] block mb-1">النص</label>
              <input
                type="color"
                value={design.textColor}
                onChange={(e) => setDesign((d) => ({ ...d, textColor: e.target.value }))}
                className="w-full h-9 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">الزخرفة العلوية</label>
              <select
                value={design.ornament}
                onChange={(e) => setDesign((d) => ({ ...d, ornament: e.target.value as StudioDesign["ornament"] }))}
                className="w-full h-10 px-2.5 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-xs"
              >
                <option value="octagram">نجمة إسلامية ثمانية</option>
                <option value="crescent">هلال ذهبي</option>
                <option value="frame">إطار كلاسيكي فقط</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">المقاس</label>
              <select
                value={design.size}
                onChange={(e) => setDesign((d) => ({ ...d, size: e.target.value as StudioDesign["size"] }))}
                className="w-full h-10 px-2.5 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-xs"
              >
                <option value="og">Open Graph (1200×630)</option>
                <option value="square">منشور مربع (1080×1080)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <AtharButton variant="primary" className="flex-1" onClick={exportPng}>
              <Download className="w-4 h-4" /> تصدير PNG
            </AtharButton>
            <AtharButton variant="secondary" loading={saving} onClick={saveProject}>
              <Save className="w-4 h-4" /> حفظ
            </AtharButton>
          </div>
        </AtharCard>

        {projects.length > 0 && (
          <AtharCard className="space-y-2.5">
            <h3 className="text-sm font-bold text-[var(--athar-gold-soft)]">مشاريعك المحفوظة</h3>
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-[var(--athar-border-subtle)]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setProjectId(p.id);
                    setProjectTitle(p.title);
                    setDesign(p.designJson);
                  }}
                  className="text-xs font-semibold hover:text-[var(--athar-gold-soft)] cursor-pointer"
                >
                  {p.title}
                </button>
                <button
                  type="button"
                  onClick={() => deleteProject(p.id)}
                  className="text-red-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </AtharCard>
        )}
      </div>

      {/* Live Canvas Preview */}
      <div className="lg:col-span-7">
        <AtharCard glow className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--athar-text-muted)]">
            <span>معاينة حية بدقة التصدير</span>
            <span className="font-mono">{design.size === "og" ? "1200 × 630 px" : "1080 × 1080 px"}</span>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-2xl border border-[var(--athar-border)] shadow-2xl"
          />
        </AtharCard>
      </div>
    </div>
  );
}
