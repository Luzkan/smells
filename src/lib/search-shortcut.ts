export type Platform = 'mac' | 'other';

const INPUT_LIKE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== 'object') return false;
  if ('isContentEditable' in target && target.isContentEditable === true) return true;
  if (!('tagName' in target) || typeof target.tagName !== 'string') return false;
  return INPUT_LIKE_TAGS.has(target.tagName.toUpperCase());
}

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const legacyPlatform = Reflect.get(navigator, 'platform');
  const platform =
    (navigator as NavigatorWithUserAgentData).userAgentData?.platform ??
    (typeof legacyPlatform === 'string' ? legacyPlatform : undefined) ??
    navigator.userAgent ??
    '';
  return /mac/i.test(platform) ? 'mac' : 'other';
}

export function isSearchShortcut(e: KeyboardEvent, platform: Platform): boolean {
  const key = e.key.toLowerCase();
  if (key === 'k' && !e.shiftKey && !e.altKey) {
    const matchesPlatformModifier =
      platform === 'mac' ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
    if (matchesPlatformModifier) return true;
  }
  if (isEditableTarget(e.target)) return false;
  return e.key === '/';
}
