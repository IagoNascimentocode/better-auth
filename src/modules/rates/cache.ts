import { FxRates } from "./types";

let cache: { data: FxRates; expiresAt: number } | null = null;

export function getCachedRates(): FxRates | null {
  if (cache && Date.now() < cache.expiresAt) return cache.data;
  return null;
}
export function setCachedRates(data: FxRates): void {
  cache = { data, expiresAt: Date.now() + 60000};
}
