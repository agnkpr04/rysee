import { getEliteBadgeGradient, getEliteBadgeShadow, getEliteBadgeBorder } from './badge-colors';

export interface ProfileFrameSettings {
  profileFrameType?: string;
  frameThickness?: number;
  eliteBadgeColor?: string;
  userPlan?: string;
}

/**
 * Get CSS classes for profile frame container
 * @param frameType - Type of frame: 'elite', 'elite-yellow', 'elite-orange', 'elite-pink', 'pro', or 'none'
 * @param thickness - Frame thickness in pixels
 * @param eliteBadgeColor - Elite badge color for elite frames
 * @returns CSS classes string
 */
export function getProfileFrameClasses(
  frameType: string = 'none',
  thickness: number = 2,
  eliteBadgeColor: string = 'crimson'
): string {
  const padding = `${thickness}px`;
  switch (frameType) {
    case 'elite':
    case 'elite-yellow':
    case 'elite-orange':
    case 'elite-pink':
      return `p-[${padding}] rounded-full shadow-lg ${getEliteBadgeShadow(eliteBadgeColor)}`;
    case 'pro':
      return `from-[#8B5CF6] via-[#D946EF] to-[#EC4899] p-[${padding}] rounded-full shadow-lg shadow-purple-500/40`;
    default:
      return '';
  }
}

/**
 * Get CSS classes for glow effect
 * @param frameType - Type of frame: 'elite', 'elite-yellow', 'elite-orange', 'elite-pink', 'pro', or 'none'
 * @param eliteBadgeColor - Elite badge color for elite frames
 * @returns CSS classes string
 */
export function getGlowEffectClasses(
  frameType: string = 'none',
  eliteBadgeColor: string = 'crimson'
): string {
  switch (frameType) {
    case 'elite':
      return `shadow-lg ${getEliteBadgeShadow(eliteBadgeColor)}`;
    case 'elite-yellow':
      return 'shadow-lg';
    case 'elite-orange':
      return 'shadow-lg';
    case 'elite-pink':
      return 'shadow-lg';
    case 'pro':
      return 'shadow-lg shadow-purple-500/40';
    default:
      return '';
  }
}

/**
 * Get inline style for glow effect
 * @param frameType - Type of frame: 'elite', 'elite-yellow', 'elite-orange', 'elite-pink', 'pro', or 'none'
 * @param eliteBadgeColor - Elite badge color for elite frames
 * @returns React CSSProperties object
 */
export function getGlowEffectStyle(
  frameType: string = 'none',
  eliteBadgeColor: string = 'crimson'
): React.CSSProperties {
  switch (frameType) {
    case 'elite':
      const gradient = getEliteBadgeGradient(eliteBadgeColor);
      return {
        boxShadow: `0 0 25px ${gradient.from}66, 0 0 50px ${gradient.from}33, 0 0 75px ${gradient.from}22`,
      };
    case 'elite-yellow':
      return {
        boxShadow: '0 0 25px #F59E0B66, 0 0 50px #F59E0B33, 0 0 75px #F59E0B22',
      };
    case 'elite-orange':
      return {
        boxShadow: '0 0 25px #F9731666, 0 0 50px #F9731633, 0 0 75px #F9731622',
      };
    case 'elite-pink':
      return {
        boxShadow: '0 0 25px #EC489966, 0 0 50px #EC489933, 0 0 75px #EC489922',
      };
    case 'pro':
      return {
        boxShadow: '0 0 25px #8B5CF666, 0 0 50px #D946EF33, 0 0 75px #EC489922',
      };
    default:
      return {};
  }
}

/**
 * Get inline style object for avatar frame
 * @param settings - Profile frame settings
 * @param rank - Optional rank number for rank-based frames (used in leaderboard)
 * @returns React CSSProperties object
 */
export function getAvatarFrameStyle(
  settings: ProfileFrameSettings,
  rank?: number
): React.CSSProperties {
  const { profileFrameType, frameThickness, eliteBadgeColor, userPlan } = settings;

  // Use custom frame if user has set it (Premium/Elite feature)
  if (profileFrameType === 'elite') {
    const gradient = getEliteBadgeGradient(eliteBadgeColor || 'crimson');
    const border = gradient.from;
    return {
      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
      border: `${frameThickness || 2}px solid ${border}`,
      boxShadow: `0 0 20px ${border}66, 0 0 40px ${border}33`,
    };
  }

  if (profileFrameType === 'elite-yellow') {
    return {
      background: 'linear-gradient(135deg, #F59E0B, #FBBF24, #FDE68A)',
      border: `${frameThickness || 2}px solid #F59E0B`,
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)',
    };
  }

  if (profileFrameType === 'elite-orange') {
    return {
      background: 'linear-gradient(135deg, #F97316, #FB923C, #FDBA74)',
      border: `${frameThickness || 2}px solid #F97316`,
      boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(251, 146, 60, 0.2)',
    };
  }

  if (profileFrameType === 'elite-pink') {
    return {
      background: 'linear-gradient(135deg, #EC4899, #F472B6, #FDA4AF)',
      border: `${frameThickness || 2}px solid #EC4899`,
      boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(244, 114, 182, 0.2)',
    };
  }

  if (profileFrameType === 'pro') {
    return {
      background: 'linear-gradient(135deg, #8B5CF6, #D946EF, #EC4899)',
      border: `${frameThickness || 2}px solid #8B5CF6`,
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(217, 70, 239, 0.2)',
    };
  }

  // Premium users get special frame regardless of rank (if no custom frame set)
  if (userPlan === 'premium') {
    return {
      background: 'linear-gradient(135deg, #8B5CF6, #D946EF, #EC4899)',
      border: '3px solid #8B5CF6',
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(217, 70, 239, 0.2)',
    };
  }

  // Default rank-based frames for FREE users (only in leaderboard context)
  if (rank !== undefined) {
    switch (rank) {
      case 1:
        return {
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #8B5CF6)',
          border: '3px solid #FFD700',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        };
      case 2:
        return {
          background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8, #D4D4D4)',
          border: '2px solid #C0C0C0',
          boxShadow: '0 0 10px rgba(192, 192, 192, 0.3)',
        };
      case 3:
        return {
          background: 'linear-gradient(135deg, #CD7F32, #B87333, #D4A574)',
          border: '2px solid #CD7F32',
          boxShadow: '0 0 10px rgba(205, 127, 50, 0.3)',
        };
      default:
        return {
          background: 'white',
          border: '1px solid #E4E4E7',
          boxShadow: 'none',
        };
    }
  }

  // Default no frame
  return {
    background: 'white',
    border: '1px solid #E4E4E7',
    boxShadow: 'none',
  };
}

/**
 * Get inline style for elite frame background gradient
 * @param profileFrameType - Type of frame
 * @param eliteBadgeColor - Elite badge color
 * @returns React CSSProperties object or null
 */
export function getEliteFrameStyle(
  profileFrameType: string = 'none',
  eliteBadgeColor: string = 'crimson'
): React.CSSProperties | null {
  if (profileFrameType === 'elite') {
    const gradient = getEliteBadgeGradient(eliteBadgeColor);
    return {
      background: `linear-gradient(to right, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
    };
  }
  if (profileFrameType === 'elite-yellow') {
    return {
      background: 'linear-gradient(to right, #F59E0B, #FBBF24, #FDE68A)',
    };
  }
  if (profileFrameType === 'elite-orange') {
    return {
      background: 'linear-gradient(to right, #F97316, #FB923C, #FDBA74)',
    };
  }
  if (profileFrameType === 'elite-pink') {
    return {
      background: 'linear-gradient(to right, #EC4899, #F472B6, #FDA4AF)',
    };
  }
  if (profileFrameType === 'premium') {
    return {
      background: 'linear-gradient(to right, #8B5CF6, #D946EF, #EC4899)',
    };
  }
  return null;
}

/**
 * Get inline style for crown badge (PRO/ELITE users)
 * @param profileFrameType - Type of frame
 * @param eliteBadgeColor - Elite badge color
 * @returns React CSSProperties object
 */
export function getCrownBadgeStyle(
  profileFrameType: string = 'none',
  eliteBadgeColor: string = 'crimson'
): React.CSSProperties {
  if (profileFrameType === 'elite') {
    const gradient = getEliteBadgeGradient(eliteBadgeColor);
    const border = getEliteBadgeBorder(eliteBadgeColor);
    return {
      background: `linear-gradient(to right, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
      boxShadow: `0 10px 15px -3px ${border}40`,
    };
  }
  if (profileFrameType === 'elite-yellow') {
    return {
      background: 'linear-gradient(to right, #F59E0B, #FBBF24, #FDE68A)',
      boxShadow: '0 10px 15px -3px #F59E0B40',
    };
  }
  if (profileFrameType === 'elite-orange') {
    return {
      background: 'linear-gradient(to right, #F97316, #FB923C, #FDBA74)',
      boxShadow: '0 10px 15px -3px #F9731640',
    };
  }
  if (profileFrameType === 'elite-pink') {
    return {
      background: 'linear-gradient(to right, #EC4899, #F472B6, #FDA4AF)',
      boxShadow: '0 10px 15px -3px #EC489940',
    };
  }
  return {
    background: 'linear-gradient(to right, #8B5CF6, #D946EF, #EC4899)',
    boxShadow: '0 10px 15px -3px #8B5CF640',
  };
}
