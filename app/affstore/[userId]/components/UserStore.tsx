import UserStoreServer from './UserStoreServer';

interface UserStoreProps {
  userId: string;
  userName: string;
  userPlan?: string;
  eliteBadgeColor?: string;
  initialProducts?: any[];
  initialAvatarUrl?: string;
  initialStoreData?: {
    storeName?: string;
    storeDescription?: string;
    themeColor?: string;
    textColor?: string;
    accentColor?: string;
    iconColor?: string;
    gradientFrame?: string;
    fontName?: string;
    fontDescription?: string;
    fontBody?: string;
    profileFrameType?: string;
    frameThickness?: number;
  };
  isOwner?: boolean;
}

export default function UserStore({ 
  userId, 
  userName, 
  userPlan, 
  eliteBadgeColor = 'crimson',
  initialProducts,
  initialAvatarUrl,
  initialStoreData,
  isOwner = false
}: UserStoreProps) {
  return (
    <UserStoreServer
      userId={userId}
      userName={userName}
      userPlan={userPlan}
      eliteBadgeColor={eliteBadgeColor}
      initialProducts={initialProducts}
      initialAvatarUrl={initialAvatarUrl}
      initialStoreData={initialStoreData}
      isOwner={isOwner}
    />
  );
}