export interface EliteBadgeGradient {
  from: string;
  via?: string;
  to: string;
}

export function getEliteBadgeGradient(color: string): EliteBadgeGradient {
  switch (color) {
    case 'crimson':
      return {
        from: '#DC143C',
        via: '#FF0000',
        to: '#FF4444'
      };
    case 'yellow':
      return {
        from: '#F59E0B',
        via: '#FBBF24',
        to: '#FDE68A'
      };
    case 'pink':
      return {
        from: '#EC4899',
        via: '#F472B6',
        to: '#FDA4AF'
      };
    default:
      return {
        from: '#EC4899',
        via: '#F97316',
        to: '#EAB308'
      };
  }
}

export function getEliteBadgeShadow(color: string): string {
  switch (color) {
    case 'crimson':
      return 'shadow-red-500/40';
    case 'yellow':
      return 'shadow-yellow-500/40';
    case 'pink':
      return 'shadow-pink-500/40';
    default:
      return 'shadow-red-500/40';
  }
}

export function getEliteBadgeBorder(color: string): string {
  switch (color) {
    case 'crimson':
      return '#F97316';
    case 'yellow':
      return '#F59E0B';
    case 'pink':
      return '#EC4899';
    default:
      return '#F97316';
  }
}
