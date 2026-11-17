import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BioPage from "@/components/bio/BioPage";

export const dynamic = "force-dynamic";

interface BioPageRouteProps {
  params: Promise<{ username: string }>;
}

export default async function BioRoute({ params }: BioPageRouteProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      storeName: true,
      storeDescription: true,
      avatar_url: true,
      storeTheme: true,
      referralCode: true,
      bioDescription: true,
      bioStoreUrl: true,
      bioReferralUrl: true,
      bioEnabled: true,
      showStoreButton: true,
      showReferralButton: true,
    },
  });

  if (!user || !user.bioEnabled) {
    notFound();
  }

  const theme = (user.storeTheme as Record<string, any>) || {};
  const storeUrl = user.bioStoreUrl || `/${username}`;
  const referralUrl = user.bioReferralUrl || `/pricing?ref=${user.referralCode || ""}`;

  const bioData = {
    id: user.id,
    name: user.name,
    username: user.username,
    storeName: user.storeName,
    storeDescription: user.storeDescription,
    avatarUrl: user.avatar_url,
    storeTheme: theme,
    bioDescription: user.bioDescription,
    showStoreButton: user.showStoreButton,
    showReferralButton: user.showReferralButton,
    referralCode: user.referralCode,
    storeUrl,
    referralUrl,
  };

  return <BioPage bio={bioData} />;
}
