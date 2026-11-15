"use client";

import React, { useEffect, useState } from "react";
import { Users, Plus, Send, MessageSquare, Shield, Flag } from "lucide-react";
import {
  AtharCard,
  AtharBadge,
  AtharButton,
  AtharInput,
  AtharTextarea,
  AtharDialog,
  VerificationSeal,
} from "@/components/ui/DesignSystem";
import { useAthar } from "@/components/providers/AtharProvider";

interface CommunityRow {
  id: string;
  name: string;
  description: string;
  rules: string;
  category: string;
  privacy: string;
  membersCount: number;
  isMember: boolean;
  creatorName: string;
}

interface PostRow {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorBadge: string | null;
  comments: Array<{
    id: string;
    content: string;
    authorName: string;
    authorBadge: string | null;
    createdAt: string;
  }>;
}

export default function CommunityPage() {
  const { user, toast } = useAthar();
  const [communities, setCommunities] = useState<CommunityRow[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<CommunityRow | null>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [newPost, setNewPost] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCommunities = () => {
    fetch("/api/communities")
      .then((r) => r.json())
      .then((d) => {
        const list = d.communities || [];
        setCommunities(list);
        if (!activeCommunity && list.length > 0) {
          setActiveCommunity(list[0]);
        }
      })
      .catch(() => undefined);
  };

  const loadPosts = (commId: string) => {
    fetch(`/api/communities?communityId=${encodeURIComponent(commId)}`)
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => undefined);
  };

  useEffect(() => {
    loadCommunities();
  }, [user]);

  useEffect(() => {
    if (activeCommunity) loadPosts(activeCommunity.id);
  }, [activeCommunity]);

  const createCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_community", name, description, rules }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast({ type: "error", title: d.error || "تعذر إنشاء المجتمع" });
      } else {
        toast({ type: "success", title: "تم إنشاء المجتمع بنجاح" });
        setCreateOpen(false);
        setName("");
        setDescription("");
        setRules("");
        loadCommunities();
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleJoin = async (c: CommunityRow) => {
    if (!user) {
      toast({ type: "warning", title: "يرجى تسجيل الدخول للانضمام" });
      return;
    }
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: c.isMember ? "leave" : "join", communityId: c.id }),
    });
    if (res.ok) {
      toast({ type: "success", title: c.isMember ? "تمت المغادرة" : "أهلًا بك في المجتمع" });
      loadCommunities();
    }
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommunity || !newPost.trim()) return;
    if (!user) {
      toast({ type: "warning", title: "سجّل الدخول للنشر في المجتمع" });
      return;
    }
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "post", communityId: activeCommunity.id, content: newPost }),
    });
    const d = await res.json();
    if (!res.ok) {
      toast({ type: "error", title: d.error || "تعذر النشر" });
    } else {
      setNewPost("");
      loadPosts(activeCommunity.id);
    }
  };

  const submitComment = async (postId: string) => {
    const content = (commentDrafts[postId] || "").trim();
    if (!content || !activeCommunity) return;
    if (!user) {
      toast({ type: "warning", title: "سجّل الدخول للتعليق" });
      return;
    }
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comment", postId, content }),
    });
    if (res.ok) {
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      loadPosts(activeCommunity.id);
    }
  };

  const reportPost = async (postId: string) => {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "post", targetId: postId, reason: "بلاغ منشور مجتمع" }),
    });
    const d = await res.json();
    toast({ type: res.ok ? "success" : "error", title: d.message || d.error });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <AtharBadge tone="info">
            <Users className="w-3.5 h-3.5" /> ATHAR COMMUNITY — مجتمعات رقمية راقية
          </AtharBadge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold athar-gold-text">المجتمعات</h1>
          <p className="text-xs sm:text-sm text-[var(--athar-text-muted)]">
            بيئة تواصل هادئة ومضبوطة بالآداب الإسلامية، تحمي الخصوصية وتمنع نشر البيانات الشخصية.
          </p>
        </div>

        <AtharButton
          variant="primary"
          onClick={() => {
            if (!user) {
              toast({ type: "warning", title: "سجّل الدخول لإنشاء مجتمع" });
              return;
            }
            setCreateOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> إنشاء مجتمع جديد
        </AtharButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Communities List */}
        <div className="lg:col-span-4 space-y-3">
          {communities.map((c) => {
            const active = activeCommunity?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveCommunity(c)}
                className={`athar-card rounded-2xl p-4 cursor-pointer transition-all space-y-2 ${
                  active ? "border-[var(--athar-gold)] ring-1 ring-[var(--athar-gold)]/30" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bold text-sm">{c.name}</h2>
                  <AtharBadge tone="emerald">{c.membersCount} عضو</AtharBadge>
                </div>
                <p className="text-xs text-[var(--athar-text-muted)] line-clamp-2">{c.description}</p>
                <div className="pt-1 flex justify-end">
                  <AtharButton
                    variant={c.isMember ? "outline" : "secondary"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleJoin(c);
                    }}
                  >
                    {c.isMember ? "مغادرة" : "انضمام"}
                  </AtharButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Community Feed */}
        <div className="lg:col-span-8 space-y-4">
          {activeCommunity && (
            <>
              <AtharCard className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold athar-gold-text">{activeCommunity.name}</h2>
                  <AtharBadge tone="gold">{activeCommunity.privacy === "public" ? "عام" : "خاص"}</AtharBadge>
                </div>
                <p className="text-xs text-[var(--athar-text-muted)]">{activeCommunity.description}</p>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-[var(--athar-border-subtle)] text-xs space-y-1">
                  <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> قواعد المجتمع
                  </p>
                  <p className="text-[var(--athar-text-muted)] whitespace-pre-line">{activeCommunity.rules}</p>
                </div>
              </AtharCard>

              <AtharCard>
                <form onSubmit={submitPost} className="space-y-3">
                  <AtharTextarea
                    label="شارك فائدة أو مبادرة نافعة"
                    placeholder="تذكر: يمنع نشر أي أرقام شخصية أو بيانات خاصة دون إذن..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <AtharButton type="submit" variant="primary" size="sm">
                      <Send className="w-3.5 h-3.5" /> نشر المشاركة
                    </AtharButton>
                  </div>
                </form>
              </AtharCard>

              <div className="space-y-3">
                {posts.length === 0 ? (
                  <AtharCard>
                    <p className="text-sm text-[var(--athar-text-muted)] text-center py-6">
                      لا توجد منشورات بعد في هذا المجتمع. ابدأ بأول مشاركة نافعة!
                    </p>
                  </AtharCard>
                ) : (
                  posts.map((post) => (
                    <AtharCard key={post.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{post.authorName}</span>
                          <VerificationSeal badge={post.authorBadge} />
                        </div>
                        <button
                          type="button"
                          onClick={() => reportPost(post.id)}
                          className="text-[var(--athar-text-muted)] hover:text-red-400 cursor-pointer"
                          title="إبلاغ عن المنشور"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>

                      {/* Comments */}
                      <div className="pt-3 border-t border-[var(--athar-border-subtle)] space-y-2">
                        <p className="text-[11px] text-[var(--athar-text-muted)] flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> التعليقات ({post.comments.length})
                        </p>
                        {post.comments.map((cm) => (
                          <div
                            key={cm.id}
                            className="p-2.5 rounded-xl bg-white/[0.03] text-xs space-y-0.5"
                          >
                            <div className="flex items-center gap-1.5 font-bold text-[var(--athar-gold-soft)]">
                              <span>{cm.authorName}</span>
                              <VerificationSeal badge={cm.authorBadge} />
                            </div>
                            <p className="text-[var(--athar-text)]">{cm.content}</p>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            value={commentDrafts[post.id] || ""}
                            onChange={(e) =>
                              setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            placeholder="أضف تعليقًا بنّاءً..."
                            className="flex-1 h-9 px-3 rounded-xl bg-[var(--athar-bg-elevated)] border border-[var(--athar-border-subtle)] text-xs outline-none focus:border-[var(--athar-gold)]"
                          />
                          <AtharButton size="sm" variant="outline" onClick={() => submitComment(post.id)}>
                            تعليق
                          </AtharButton>
                        </div>
                      </div>
                    </AtharCard>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <AtharDialog open={createOpen} onClose={() => setCreateOpen(false)} title="إنشاء مجتمع جديد">
        <form onSubmit={createCommunity} className="space-y-4">
          <AtharInput label="اسم المجتمع" required value={name} onChange={(e) => setName(e.target.value)} />
          <AtharTextarea label="الوصف" required value={description} onChange={(e) => setDescription(e.target.value)} />
          <AtharTextarea
            label="قواعد المجتمع"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="احترام الخصوصية والالتزام بالآداب الإسلامية..."
          />
          <div className="flex justify-end gap-2">
            <AtharButton type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              إلغاء
            </AtharButton>
            <AtharButton type="submit" variant="primary" loading={saving}>
              إنشاء المجتمع
            </AtharButton>
          </div>
        </form>
      </AtharDialog>
    </div>
  );
}
