import { atom } from 'nanostores';

export const $searchQuery = atom<string>('');

export function setSearchQuery(value: string): void {
  $searchQuery.set(value);
}

export function clearSearch(): void {
  $searchQuery.set('');
}
