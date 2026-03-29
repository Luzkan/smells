import { atom } from 'nanostores';
import type { SmellFilterData } from '../lib/types';

export const $allSmells = atom<SmellFilterData[]>([]);

export function initializeSmellsData(data: SmellFilterData[]): void {
  $allSmells.set(data);
}
