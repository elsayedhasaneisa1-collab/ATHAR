import React from "react";
import { db } from "@/db";
import { campaigns, communities, invitations, profiles, systemSettings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { fetchPrayerTimes } from "@/lib/islamic-api";
import { getDailyHighlights, getHijriDateFormatted } from "@/lib/islamic-data";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();

  const [prayer, activeCampaigns, publicCommunities, recentInvitations, siteContentRows] =
    await Promise.all([
      fetchPrayerTimes("القاهرة", 5),
      db
        .select({
          id: campaigns.id,
          slug: campaigns.slug,
          title: campaigns.title,
          description: campaigns.description,
          goalTarget: campaigns.goalTarget,
          currentProgress: campaigns.currentProgress,
          unitLabel: campaigns.unitLabel,
          creatorName: profiles.username,
          creatorBadge: profiles.verificationBadge,
        })
        .from(campaigns)
        .innerJoin(profiles, eq(campaigns.creatorId, profiles.id))
        .where(eq(campaigns.visibility, "public"))
        .orderBy(desc(campaigns.isFeatured), desc(campaigns.createdAt))
        .limit(3),
      db
        .select({
          id: communities.id,
          slug: communities.slug,
          name: communities.name,
          description: communities.description,
          category: communities.category,
        })
        .from(communities)
        .where(eq(communities.status, "active"))
        .orderBy(desc(communities.createdAt))
        .limit(3),
      db
        .select({
          id: invitations.id,
          slug: invitations.slug,
          title: invitations.title,
          type: invitations.type,
          creatorName: profiles.username,
          creatorBadge: profiles.verificationBadge,
        })
        .from(invitations)
        .innerJoin(profiles, eq(invitations.userId, profiles.id))
        .where(eq(invitations.status, "published"))
        .orderBy(desc(invitations.createdAt))
        .limit(4),
      db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, "site_content"))
        .limit(1),
    ]);

  const hijri = getHijriDateFormatted();
  const daily = getDailyHighlights();
  const contentVal = (siteContentRows[0]?.value as { heroTitle?: string; heroSubtitle?: string }) || {};

  return (
    <HomeClient
      prayer={prayer}
      hijri={hijri}
      daily={daily}
      campaigns={activeCampaigns}
      communities={publicCommunities}
      latestInvitations={recentInvitations}
      heroContent={{
        heroTitle: contentVal.heroTitle || "اترك أثرًا يبقى بعدك",
        heroSubtitle:
          contentVal.heroSubtitle ||
          "منظومة رقمية إسلامية متكاملة تجمع بين القرآن الكريم، الأذكار الموثقة، المسبحة، مواقيت الصلاة، الدعوات، الحملات الخيرية، المجتمعات الهادفة، واستوديو التصميم الفاخر.",
      }}
    />
  );
}
