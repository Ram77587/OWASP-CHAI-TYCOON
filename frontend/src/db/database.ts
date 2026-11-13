import Dexie, { type Table } from 'dexie';
import { DaySummary, Inventory, MarketPrices, Recipe, RecipeKey, SupplyShockDecision, Upgrades, WeatherType } from '../types';

export interface PersistentGameState {
  id: string; // Singleton key: 'CURRENT_GAME'
  dayNumber: number;
  cash: number;
  inventory: Inventory;
  recipes: Record<RecipeKey, Recipe>;
  upgrades: Upgrades;
  marketPrices: MarketPrices;
  currentWeather: WeatherType;
  supplyShockDecision: SupplyShockDecision;
  lastUpdated: number;
}

export class ChaiTycoonDatabase extends Dexie {
  gameState!: Table<PersistentGameState, string>;
  daySummaries!: Table<DaySummary, number>;

  constructor() {
    super('ChaiTycoonDB');
    this.version(1).stores({
      gameState: 'id',
      daySummaries: '++id, dayNumber, timestamp',
    });
  }
}

export const db = new ChaiTycoonDatabase();

/**
 * Saves current game snapshot to IndexedDB.
 */
export async function persistGameState(state: PersistentGameState): Promise<void> {
  try {
    await db.gameState.put({
      ...state,
      id: 'CURRENT_GAME',
      lastUpdated: Date.now(),
    });
  } catch (err) {
    console.warn('[Chai Tycoon DB] IndexedDB save failed, falling back gracefully:', err);
  }
}

/**
 * Loads current game snapshot from IndexedDB.
 */
export async function retrieveGameState(): Promise<PersistentGameState | undefined> {
  try {
    return await db.gameState.get('CURRENT_GAME');
  } catch (err) {
    console.warn('[Chai Tycoon DB] IndexedDB read failed:', err);
    return undefined;
  }
}

/**
 * Appends a completed day summary to historical ledger.
 */
export async function recordDaySummary(summary: DaySummary): Promise<void> {
  try {
    await db.daySummaries.add(summary);
  } catch (err) {
    console.warn('[Chai Tycoon DB] Failed to save day summary:', err);
  }
}

/**
 * Retrieves all past day summaries for analytics.
 */
export async function fetchAllSummaries(): Promise<DaySummary[]> {
  try {
    return await db.daySummaries.orderBy('dayNumber').toArray();
  } catch (err) {
    console.warn('[Chai Tycoon DB] Failed to fetch summaries:', err);
    return [];
  }
}

/**
 * Resets all IndexedDB data for fresh start.
 */
export async function wipeAllData(): Promise<void> {
  try {
    await db.gameState.clear();
    await db.daySummaries.clear();
  } catch (err) {
    console.warn('[Chai Tycoon DB] Wipe failed:', err);
  }
}
