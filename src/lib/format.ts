import { API_BASE_URL } from './api';

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function imageUrl(path?: string): string {
  if (!path) return '';
  return `${API_BASE_URL}/${path}`;
}

export function progressPercentage(current: number, goal: number): number {
  if (!goal) return 0;
  return (current / goal) * 100;
}
