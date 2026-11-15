"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  Plus,
  CheckCircle2,
  Trash2,
  Star,
  Archive,
  Target,
  Flame,
  Lock,
} from "lucide-react";
import {
  AtharCard,
  AtharBadge,
  AtharButton,
  AtharInput,
  AtharTextarea,
  AtharProgressBar,
} from "@/components/ui/DesignSystem";
import { useAthar } from "@/components/providers/AtharProvider";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
}

interface HabitItem {
  id: string;
  title: string;
  category: string;
  currentStreak: number;
  totalCompletions: number;
  lastCompletedDate: string | null;
}

interface GoalItem {
  id: string;
  title: string;
  description: string | null;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: string;
}

export default function JournalPage() {
  const { user, toast } = useAthar();
  const [tab, setTab] = useState<"notes" | "habits" | "goals">("notes");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [habitLimit, setHabitLimit] = useState<number>(3);
  const [search, setSearch] = useState("");

  // Forms
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("reflection");
  const [habitTitle, setHabitTitle] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState(30);
  const [goalUnit, setGoalUnit] = useState("جزء");

  const load = () => {
    if (!user) return;
    fetch("/api/journal")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setEntries(d.entries || []);
        setHabits(d.habits || []);
        setGoals(d.goals || []);
        setHabitLimit(d.limits?.habitLimit ?? 3);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AtharCard glow className="space-y-4 py-10">
          <Lock className="w-10 h-10 text-[var(--athar-gold)] mx-auto" />
          <h1 className="font-display text-2xl font-bold">مساحة التنظيم والدفتر الخاص</h1>
          <p className="text-sm text-[var(--athar-text-muted)]">
            جميع ملاحظاتك وعاداتك وأهدافك خاصة بك وحدك. سجّل الدخول للبدء.
          </p>
          <Link href="/login">
            <AtharButton variant="primary">تسجيل الدخول</AtharButton>
          </Link>
        </AtharCard>
      </div>
    );
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "entry", title: noteTitle, content: noteContent, category: noteCategory }),
    });
    if (res.ok) {
      setNoteTitle("");
      setNoteContent("");
      load();
      toast({ type: "success", title: "تم حفظ الملاحظة في دفترك الخاص" });
    }
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "habit", title: habitTitle, category: "worship", targetCount: 1 }),
    });
    const d = await res.json();
    if (!res.ok) {
      toast({ type: "error", title: d.error || "تعذر إضافة العادة" });
    } else {
      setHabitTitle("");
      load();
      toast({ type: "success", title: "تمت إضافة العادة اليومية" });
    }
  };

  const completeHabitToday = async (id: string) => {
    const res = await fetch("/api/journal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "habit", id, completeToday: true }),
    });
    const d = await res.json();
    if (res.ok) {
      toast({ type: "success", title: d.alreadyDone ? "تم إنجازها بالفعل اليوم" : "أحسنت! تم تسجيل إنجاز اليوم" });
      load();
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "goal", title: goalTitle, targetValue: goalTarget, unit: goalUnit }),
    });
    if (res.ok) {
      setGoalTitle("");
      load();
      toast({ type: "success", title: "تم إنشاء الهدف بنجاح" });
    }
  };

  const bumpGoal = async (g: GoalItem) => {
    await fetch("/api/journal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "goal", id: g.id, currentValue: g.currentValue + 1 }),
    });
    load();
  };

  const deleteItem = async (kind: "entry" | "habit" | "goal", id: string) => {
    await fetch(`/api/journal?kind=${kind}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    load();
  };

  const todayIso = new Date().toISOString().slice(0, 10);
  const filteredEntries = entries.filter(
    (e) => !e.isArchived && (e.title.includes(search) || e.content.includes(search))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <AtharBadge tone="gold">
            <BookMarked className="w-3.5 h-3.5" /> ATHAR JOURNAL — خاص بك وحدك
          </AtharBadge>
          <h1 className="font-display text-3xl font-bold athar-gold-text">الدفتر الشخصي والعادات والأهداف</h1>
        </div>

        <div className="flex gap-2">
          {(
            [
              { id: "notes", label: `الملاحظات (${entries.length})` },
              { id: "habits", label: `العادات (${habits.length}/${habitLimit === -1 ? "∞" : habitLimit})` },
              { id: "goals", label: `الأهداف (${goals.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                tab === t.id
                  ? "athar-gold-gradient text-[#06120D] border-transparent"
                  : "bg-white/[0.03] border-[var(--athar-border-subtle)] text-[var(--athar-text-muted)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <AtharCard>
              <form onSubmit={addNote} className="space-y-3">
                <AtharInput label="عنوان الملاحظة" required value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                <div className="space-y-1">
                  <label className="block text-sm font-medium">التصنيف</label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-sm"
                  >
                    <option value="reflection">تأملات وخواطر</option>
                    <option value="plan">خطط وأفكار</option>
                    <option value="quran">تدبر قرآني</option>
                    <option value="gratitude">نعم وشكر</option>
                    <option value="reminder">تذكير</option>
                  </select>
                </div>
                <AtharTextarea label="المحتوى" required value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
                <AtharButton type="submit" variant="primary" className="w-full">
                  <Plus className="w-4 h-4" /> حفظ الملاحظة
                </AtharButton>
              </form>
            </AtharCard>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <AtharInput placeholder="ابحث في ملاحظاتك..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {filteredEntries.map((item) => (
              <AtharCard key={item.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch("/api/journal", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ kind: "entry", id: item.id, isFavorite: !item.isFavorite }),
                        });
                        load();
                      }}
                      className={`p-1.5 rounded-lg cursor-pointer ${item.isFavorite ? "text-[var(--athar-gold)]" : "text-[var(--athar-text-muted)]"}`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch("/api/journal", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ kind: "entry", id: item.id, isArchived: true }),
                        });
                        load();
                      }}
                      className="p-1.5 rounded-lg text-[var(--athar-text-muted)] cursor-pointer"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem("entry", item.id)}
                      className="p-1.5 rounded-lg text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--athar-text-muted)] whitespace-pre-line leading-relaxed">{item.content}</p>
              </AtharCard>
            ))}
          </div>
        </div>
      )}

      {tab === "habits" && (
        <div className="space-y-4">
          <AtharCard>
            <form onSubmit={addHabit} className="flex flex-col sm:flex-row gap-3">
              <AtharInput
                placeholder="أضف عادة يومية جديدة (مثال: قراءة ورد القرآن بعد الفجر)"
                required
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
              />
              <AtharButton type="submit" variant="primary" className="shrink-0">
                <Plus className="w-4 h-4" /> إضافة عادة
              </AtharButton>
            </form>
            <p className="text-[11px] text-[var(--athar-text-muted)] mt-2">
              الحد المسموح لباقة {user.membershipPlan}: {habitLimit === -1 ? "غير محدود" : `${habitLimit} عادات`} (المستخدم حاليًا: {habits.length}).
            </p>
          </AtharCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((h) => {
              const doneToday = h.lastCompletedDate === todayIso;
              return (
                <AtharCard key={h.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base">{h.title}</h3>
                    <button
                      type="button"
                      onClick={() => deleteItem("habit", h.id)}
                      className="text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--athar-text-muted)]">
                    <span className="flex items-center gap-1 text-[var(--athar-gold-soft)]">
                      <Flame className="w-4 h-4" /> استمرارية: {h.currentStreak}
                    </span>
                    <span>الإجمالي: {h.totalCompletions}</span>
                  </div>
                  <AtharButton
                    variant={doneToday ? "success" : "primary"}
                    size="sm"
                    className="w-full"
                    onClick={() => completeHabitToday(h.id)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {doneToday ? "أُنجزت اليوم ✓" : "تأكيد إنجاز اليوم"}
                  </AtharButton>
                </AtharCard>
              );
            })}
          </div>
        </div>
      )}

      {tab === "goals" && (
        <div className="space-y-4">
          <AtharCard>
            <form onSubmit={addGoal} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <AtharInput label="الهدف" required value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="مثال: حفظ جزء عم" />
              </div>
              <div className="sm:col-span-2">
                <AtharInput label="العدد المستهدف" type="number" min={1} value={goalTarget} onChange={(e) => setGoalTarget(Number(e.target.value))} />
              </div>
              <div className="sm:col-span-3">
                <AtharInput label="الوحدة" value={goalUnit} onChange={(e) => setGoalUnit(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <AtharButton type="submit" variant="primary" className="w-full">إضافة</AtharButton>
              </div>
            </form>
          </AtharCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => (
              <AtharCard key={g.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Target className="w-4 h-4 text-[var(--athar-gold)]" /> {g.title}
                  </h3>
                  <button type="button" onClick={() => deleteItem("goal", g.id)} className="text-red-400 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <AtharProgressBar value={g.currentValue} max={g.targetValue} />
                <div className="flex items-center justify-between text-xs">
                  <span>
                    {g.currentValue} / {g.targetValue} {g.unit}
                  </span>
                  <AtharButton size="sm" variant="secondary" onClick={() => bumpGoal(g)}>
                    +1 تقدم
                  </AtharButton>
                </div>
              </AtharCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
