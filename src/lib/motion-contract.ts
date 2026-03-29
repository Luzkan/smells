export const MOTION_STORAGE_KEY = 'motion-preference';
export const MOTION_ATTRIBUTE = 'data-motion';
export const MOTION_FULL = 'full';
export const MOTION_REDUCED = 'reduced';

export type MotionPreference = typeof MOTION_FULL | typeof MOTION_REDUCED;

export function isMotionReduced(): boolean {
  return document.documentElement.dataset.motion === MOTION_REDUCED;
}
