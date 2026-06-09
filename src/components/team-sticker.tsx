import Image from 'next/image';
import { getStickerPath } from '@/lib/stickers';
import { TEAM_MAP } from '@/lib/world-cup-data';

interface TeamStickerProps {
  teamId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
  tilt?: boolean;
}

const SIZE_MAP = {
  sm: { w: 52,  h: 64  },
  md: { w: 80,  h: 96  },
  lg: { w: 110, h: 132 },
  xl: { w: 130, h: 156 },
};

export function TeamSticker({ teamId, size = 'md', className = '', showName, tilt }: TeamStickerProps) {
  const src = getStickerPath(teamId);
  const team = TEAM_MAP.get(teamId);
  const { w, h } = SIZE_MAP[size];
  const tiltClass = tilt ? 'rotate-[-3deg] hover:rotate-0 transition-transform' : '';

  if (!src) {
    // Fallback: flag emoji in a sticker-shaped box
    return (
      <div
        className={`sticker flex items-center justify-center bg-white ${tiltClass} ${className}`}
        style={{ width: w, height: h, fontSize: w * 0.45 }}
        title={team?.name}
      >
        {team?.flag ?? '🏳️'}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Image
        src={src}
        alt={team?.name ?? teamId}
        width={w}
        height={h}
        className={`sticker ${tiltClass}`}
        title={team?.name}
      />
      {showName && (
        <span className="text-xs text-gray-400 font-medium truncate" style={{ maxWidth: w }}>
          {team?.name ?? teamId}
        </span>
      )}
    </div>
  );
}

// Inline mini sticker for use in tables / lists
export function TeamBadge({ teamId, className = '' }: { teamId: string; className?: string }) {
  const src = getStickerPath(teamId);
  const team = TEAM_MAP.get(teamId);

  if (!src) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-base">{team?.flag ?? '🏳️'}</span>
        <span className="font-semibold">{team?.name ?? teamId}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Image
        src={src}
        alt={team?.name ?? teamId}
        width={24}
        height={29}
        className="rounded-sm border border-white/20 object-cover"
      />
      <span className="font-semibold">{team?.name ?? teamId}</span>
    </span>
  );
}
