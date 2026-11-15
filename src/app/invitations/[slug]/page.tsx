import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { invitations, invitationImages, profiles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { APP_SITE_URL, INVITATION_TEMPLATES, INVITATION_TYPES } from "@/lib/constants";
import { AtharButton, VerificationSeal } from "@/components/ui/DesignSystem";

export const dynamic = "force-dynamic";

async function loadInvitation(rawSlug: string) {
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }
  const rows = await db
    .select({
      invitation: invitations,
      creatorName: profiles.username,
      creatorBadge: profiles.verificationBadge,
      creatorPlan: profiles.membershipPlan,
      creatorVerified: profiles.verificationStatus,
      ogImageUrl: invitationImages.imageUrl,
      ogImageAlt: invitationImages.altText,
      ogImageActive: invitationImages.isActive,
    })
    .from(invitations)
    .innerJoin(profiles, eq(invitations.userId, profiles.id))
    .leftJoin(invitationImages, eq(invitations.ogImageId, invitationImages.id))
    .where(eq(invitations.slug, slug))
    .limit(1);

  return rows[0] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await loadInvitation(slug);

  if (!row || row.invitation.status !== "published") {
    return { title: "دعوة غير متاحة", robots: { index: false, follow: false } };
  }

  const canShowCustomOg =
    row.ogImageUrl &&
    row.ogImageActive &&
    (row.creatorPlan === "PRO" || row.creatorPlan === "VIP") &&
    row.creatorVerified === "approved";

  const imageUrl = canShowCustomOg
    ? row.ogImageUrl!
    : `${APP_SITE_URL}/images/athar-og-default.png`;

  const canonical = `${APP_SITE_URL}/invitations/${row.invitation.slug}`;

  // Security rule: NEVER expose private user info (phone, gender, governorate) in OG Metadata!
  return {
    title: row.invitation.title,
    description: row.invitation.description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${row.invitation.title} | ATHAR أَثَر`,
      description: row.invitation.description.slice(0, 160),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: row.ogImageAlt || row.invitation.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.invitation.title} | ATHAR أَثَر`,
      description: row.invitation.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function InvitationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await loadInvitation(slug);

  if (!row || row.invitation.status !== "published") {
    notFound();
  }

  await db
    .update(invitations)
    .set({ viewsCount: sql`${invitations.viewsCount} + 1` })
    .where(eq(invitations.id, row.invitation.id));

  const tpl =
    INVITATION_TEMPLATES.find((t) => t.id === row.invitation.templateId) || INVITATION_TEMPLATES[0];
  const typeLabel = INVITATION_TYPES.find((t) => t.id === row.invitation.type)?.label || "دعوة";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div
        className="rounded-3xl p-8 sm:p-12 text-center shadow-2xl border-2 space-y-6"
        style={{
          background: tpl.bg,
          borderColor: row.invitation.themeColor,
          color: tpl.id === "ivory-mosque" ? "#16261E" : "#F5F3EC",
        }}
      >
        <p className="text-xs tracking-[0.22em] font-semibold" style={{ color: row.invitation.themeColor }}>
          ATHAR | أَثَر • {typeLabel}
        </p>

        <h1
          className={`text-3xl sm:text-4xl font-bold leading-snug ${
            row.invitation.fontFamily === "amiri" ? "font-quran" : ""
          }`}
          style={{ color: row.invitation.themeColor }}
        >
          {row.invitation.title}
        </h1>

        <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line max-w-xl mx-auto opacity-95">
          {row.invitation.description}
        </p>

        {row.invitation.targetUrl && (
          <div className="pt-2">
            <a
              href={row.invitation.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 h-11 rounded-xl athar-gold-gradient text-[#06120D] font-bold text-sm"
            >
              فتح الرابط المرفق
            </a>
          </div>
        )}

        <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-2 text-xs opacity-85">
          <span>دعوة من: {row.creatorName}</span>
          <VerificationSeal badge={row.creatorBadge} />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Link href="/invitations">
          <AtharButton variant="outline">تصفح المزيد من الدعوات</AtharButton>
        </Link>
        <Link href="/register">
          <AtharButton variant="primary">أنشئ دعوتك الخاصة على ATHAR</AtharButton>
        </Link>
      </div>
    </div>
  );
}
