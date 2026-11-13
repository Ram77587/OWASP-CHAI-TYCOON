import { create } from 'zustand';
import {
  Customer,
  DaySummary,
  GamePhase,
  Inventory,
  MarketPrices,
  Recipe,
  RecipeKey,
  SupplyShockDecision,
  Upgrades,
  WeatherInfo,
} from '../types';
import {
  DAILY_STALL_RENT,
  DEFAULT_MARKET_PRICES,
  INITIAL_CASH,
  INITIAL_RECIPES,
  MILK_SPOILAGE_RATE,
  UPGRADE_CATALOG,
  WEATHER_FORECASTS,
} from '../engine/gameRules';
import {
  canFulfillOrder,
  calculateSpoilage,
  deductIngredients,
} from '../engine/inventoryEngine';
import {
  calculateCustomerRating,
  calculateRecipeUnitCost,
} from '../engine/economyEngine';
import { spawnCustomer } from '../engine/customerEngine';
import { sound } from '../engine/audioSynth';
import {
  fetchAllSummaries,
  persistGameState,
  recordDaySummary,
  retrieveGameState,
  wipeAllData,
} from '../db/database';

export interface DayStats {
  grossRevenue: number;
  cogs: number;
  cupsSold: number;
  customersServed: number;
  customersLost: number;
  ratings: number[];
  customerFeedback: string[];
}

export interface GameState {
  isInitialized: boolean;
  dayNumber: number;
  phase: GamePhase;
  cash: number;
  inventory: Inventory;
  recipes: Record<RecipeKey, Recipe>;
  upgrades: Upgrades;
  marketPrices: MarketPrices;
  currentWeather: WeatherInfo;
  supplyShockDecision: SupplyShockDecision;
  supplyShockTriggered: boolean;

  // Daytime Rush State
  daySecondsRemaining: number;
  dayTotalSeconds: number;
  isRushActive: boolean;
  customers: Customer[];
  dayStats: DayStats;
  activeDaySummary: DaySummary | null;
  historicalSummaries: DaySummary[];
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  kettleState: 'IDLE' | 'BOILING' | 'POURING';

  // Actions
  initializeGame: () => Promise<void>;
  buyInventory: (key: keyof Inventory, amount: number, cost: number) => boolean;
  updateRecipePrice: (key: RecipeKey, price: number) => void;
  startDayRush: () => void;
  tickRush: () => void;
  serveCustomer: (customerId: string) => boolean;
  endDayRush: () => Promise<void>;
  applySupplyShockStrategy: (decision: SupplyShockDecision) => Promise<void>;
  proceedToNextDay: () => Promise<void>;
  buyUpgrade: (id: keyof Upgrades) => boolean;
  dismissNotification: () => void;
  resetGame: () => Promise<void>;
}

const INITIAL_INVENTORY: Inventory = {
  milk: 1200, // 1.2 Liters
  teaLeaves: 150, // 150g
  sugar: 200, // 200g
  ginger: 20, // 20g
  cardamom: 15, // 15 pods
  cups: 25, // 25 cups
  bunMaska: 4, // 4 buns
  samosa: 6, // 6 samosas
};

const INITIAL_UPGRADES: Upgrades = {
  brassSamovar: false,
  earthenKulhad: false,
  chotuAssistant: false,
  streetRadio: false,
  allWeatherAwning: false,
};

export const useGameStore = create<GameState>((set, get) => ({
  isInitialized: false,
  dayNumber: 1,
  phase: 'PREP',
  cash: INITIAL_CASH,
  inventory: { ...INITIAL_INVENTORY },
  recipes: { ...INITIAL_RECIPES },
  upgrades: { ...INITIAL_UPGRADES },
  marketPrices: { ...DEFAULT_MARKET_PRICES },
  currentWeather: WEATHER_FORECASTS.SUNNY,
  supplyShockDecision: 'PENDING',
  supplyShockTriggered: false,

  daySecondsRemaining: 45,
  dayTotalSeconds: 45,
  isRushActive: false,
  customers: [],
  dayStats: {
    grossRevenue: 0,
    cogs: 0,
    cupsSold: 0,
    customersServed: 0,
    customersLost: 0,
    ratings: [],
    customerFeedback: [],
  },
  activeDaySummary: null,
  historicalSummaries: [],
  notification: null,
  kettleState: 'IDLE',

  initializeGame: async () => {
    try {
      const saved = await retrieveGameState();
      const summaries = await fetchAllSummaries();

      if (saved) {
        set({
          isInitialized: true,
          dayNumber: saved.dayNumber,
          cash: saved.cash,
          inventory: saved.inventory,
          recipes: saved.recipes,
          upgrades: saved.upgrades,
          marketPrices: saved.marketPrices,
          currentWeather: WEATHER_FORECASTS[saved.currentWeather] || WEATHER_FORECASTS.SUNNY,
          supplyShockDecision: saved.supplyShockDecision,
          supplyShockTriggered: saved.supplyShockDecision !== 'PENDING',
          historicalSummaries: summaries,
          phase: 'PREP',
        });
      } else {
        set({
          isInitialized: true,
          historicalSummaries: summaries,
          phase: 'PREP',
        });
        // Initial persist
        const state = get();
        await persistGameState({
          id: 'CURRENT_GAME',
          dayNumber: state.dayNumber,
          cash: state.cash,
          inventory: state.inventory,
          recipes: state.recipes,
          upgrades: state.upgrades,
          marketPrices: state.marketPrices,
          currentWeather: state.currentWeather.type,
          supplyShockDecision: state.supplyShockDecision,
          lastUpdated: Date.now(),
        });
      }
    } catch (e) {
      console.error('Failed to initialize game state:', e);
      set({ isInitialized: true, phase: 'PREP' });
    }
  },

  buyInventory: (key, amount, cost) => {
    const { cash, inventory } = get();
    if (cash < cost) {
      sound.playBuzzer();
      set({ notification: { message: 'Not enough cash to buy ingredients!', type: 'error' } });
      return false;
    }

    sound.playCoin();
    const updatedInventory = {
      ...inventory,
      [key]: inventory[key] + amount,
    };

    set({
      cash: Math.round((cash - cost) * 100) / 100,
      inventory: updatedInventory,
      notification: { message: `Purchased stock (+${amount})`, type: 'success' },
    });

    // Auto-save
    const state = get();
    persistGameState({
      id: 'CURRENT_GAME',
      dayNumber: state.dayNumber,
      cash: state.cash,
      inventory: state.inventory,
      recipes: state.recipes,
      upgrades: state.upgrades,
      marketPrices: state.marketPrices,
      currentWeather: state.currentWeather.type,
      supplyShockDecision: state.supplyShockDecision,
      lastUpdated: Date.now(),
    });

    return true;
  },

  updateRecipePrice: (key, price) => {
    const { recipes } = get();
    const recipe = recipes[key];
    if (!recipe) return;

    const clampedPrice = Math.max(recipe.minPrice, Math.min(recipe.maxPrice, price));
    set({
      recipes: {
        ...recipes,
        [key]: {
          ...recipe,
          currentPrice: clampedPrice,
        },
      },
    });
  },

  startDayRush: () => {
    sound.playBoil();
    set({
      phase: 'RUSH',
      isRushActive: true,
      daySecondsRemaining: 40,
      dayTotalSeconds: 40,
      customers: [],
      dayStats: {
        grossRevenue: 0,
        cogs: 0,
        cupsSold: 0,
        customersServed: 0,
        customersLost: 0,
        ratings: [],
        customerFeedback: [],
      },
      kettleState: 'BOILING',
      notification: { message: 'Stall Open! The Morning Rush has started!', type: 'info' },
    });
  },

  tickRush: () => {
    const {
      isRushActive,
      daySecondsRemaining,
      customers,
      currentWeather,
      dayNumber,
      recipes,
      upgrades,
      inventory,
      dayStats,
    } = get();

    if (!isRushActive) return;

    // Check if day finished
    if (daySecondsRemaining <= 1) {
      get().endDayRush();
      return;
    }

    // 1. Update customer patience & remove walked-out customers
    const updatedCustomers: Customer[] = [];
    let lostCount = 0;
    const newFeedback = [...dayStats.customerFeedback];

    for (const cust of customers) {
      const nextPatience = cust.patience - 1;

      if (nextPatience <= 0) {
        lostCount++;
        sound.playBuzzer();
        newFeedback.push(`${cust.name} (${cust.archetype}): "Waited too long, walking away!"`);
      } else {
        updatedCustomers.push({
          ...cust,
          patience: nextPatience,
        });
      }
    }

    // 2. Chotu Assistant Auto-Serve logic (if upgrade active)
    if (upgrades.chotuAssistant && updatedCustomers.length > 0) {
      const firstCustomer = updatedCustomers[0];
      const targetRecipe = recipes[firstCustomer.orderRecipeKey];
      if (canFulfillOrder(inventory, targetRecipe)) {
        // Chotu auto-serves!
        get().serveCustomer(firstCustomer.id);
        return;
      }
    }

    // 3. Spawning new customers
    // Max queue size: 4 (or 5 if awning upgrade)
    const maxQueue = upgrades.allWeatherAwning ? 5 : 4;
    const spawnChance = 0.55 * currentWeather.trafficMultiplier;

    if (updatedCustomers.length < maxQueue && Math.random() < spawnChance) {
      const newCust = spawnCustomer(
        dayNumber,
        currentWeather,
        recipes,
        upgrades.streetRadio,
        upgrades.earthenKulhad
      );
      updatedCustomers.push(newCust);
    }

    set({
      daySecondsRemaining: daySecondsRemaining - 1,
      customers: updatedCustomers,
      dayStats: {
        ...dayStats,
        customersLost: dayStats.customersLost + lostCount,
        customerFeedback: newFeedback.slice(-6),
      },
    });
  },

  serveCustomer: (customerId: string) => {
    const {
      customers,
      recipes,
      inventory,
      marketPrices,
      cash,
      dayStats,
      upgrades,
    } = get();

    const customerIndex = customers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) return false;

    const customer = customers[customerIndex];
    const recipe = recipes[customer.orderRecipeKey];

    // ZERO NEGATIVE INVENTORY GUARD
    if (!canFulfillOrder(inventory, recipe)) {
      sound.playBuzzer();
      set({
        notification: {
          message: `Out of Stock: Cannot brew ${recipe.name}! Missing raw materials.`,
          type: 'error',
        },
      });
      return false;
    }

    // Deduct ingredients safely
    const nextInventory = deductIngredients(inventory, recipe);

    // Audio & visuals
    sound.playPour();
    setTimeout(() => sound.playCoin(), 120);

    // Calculate economics
    const unitCost = calculateRecipeUnitCost(recipe, marketPrices);
    const { stars, tip, feedback } = calculateCustomerRating(
      recipe.currentPrice,
      customer.priceTolerance,
      customer.patience,
      customer.maxPatience,
      upgrades.earthenKulhad
    );

    const revenueFromCup = recipe.currentPrice + tip;
    const updatedCash = Math.round((cash + revenueFromCup) * 100) / 100;

    // Remove customer from queue
    const remainingCustomers = customers.filter((c) => c.id !== customerId);

    const updatedFeedback = [...dayStats.customerFeedback, `${customer.name}: "${feedback}"`].slice(-6);

    set({
      cash: updatedCash,
      inventory: nextInventory,
      customers: remainingCustomers,
      kettleState: 'POURING',
      dayStats: {
        grossRevenue: Math.round((dayStats.grossRevenue + revenueFromCup) * 100) / 100,
        cogs: Math.round((dayStats.cogs + unitCost) * 100) / 100,
        cupsSold: dayStats.cupsSold + 1,
        customersServed: dayStats.customersServed + 1,
        customersLost: dayStats.customersLost,
        ratings: [...dayStats.ratings, stars],
        customerFeedback: updatedFeedback,
      },
    });

    setTimeout(() => {
      set({ kettleState: 'BOILING' });
    }, 400);

    return true;
  },

  endDayRush: async () => {
    sound.playFanfare();
    const {
      dayNumber,
      cash,
      inventory,
      dayStats,
      marketPrices,
      currentWeather,
      supplyShockTriggered,
      historicalSummaries,
    } = get();

    // Spoilage calculation (unboiled milk)
    const { spoiledMilkMl, remainingInventory } = calculateSpoilage(inventory, MILK_SPOILAGE_RATE);
    const spoilageCost = Math.round(((spoiledMilkMl / 1000) * marketPrices.milkPerLiter) * 100) / 100;

    // Rent
    const stallRent = DAILY_STALL_RENT;

    // Net Profit
    const netProfit = Math.round((dayStats.grossRevenue - dayStats.cogs - stallRent - spoilageCost) * 100) / 100;
    const finalCash = Math.max(0, Math.round((cash - stallRent) * 100) / 100);

    // Calculate Average Rating
    const avgRating =
      dayStats.ratings.length > 0
        ? Math.round(
            (dayStats.ratings.reduce((sum, r) => sum + r, 0) / dayStats.ratings.length) * 10
          ) / 10
        : 4.0;

    const summary: DaySummary = {
      dayNumber,
      weather: currentWeather.type,
      grossRevenue: dayStats.grossRevenue,
      cogs: dayStats.cogs,
      stallRent,
      spoilageCost,
      netProfit,
      cupsSold: dayStats.cupsSold,
      customersServed: dayStats.customersServed,
      customersLost: dayStats.customersLost,
      ratings: dayStats.ratings,
      averageRating: avgRating,
      customerFeedback: dayStats.customerFeedback,
      timestamp: Date.now(),
    };

    await recordDaySummary(summary);

    // Determine next phase: Supply shock triggers immediately after Day 1
    const nextPhase: GamePhase =
      dayNumber === 1 && !supplyShockTriggered ? 'SUPPLY_SHOCK' : 'SUMMARY';

    set({
      phase: nextPhase,
      isRushActive: false,
      cash: finalCash,
      inventory: remainingInventory,
      activeDaySummary: summary,
      historicalSummaries: [...historicalSummaries, summary],
      kettleState: 'IDLE',
      notification: {
        message: `Day ${dayNumber} concluded! Net Profit: ₹${netProfit}`,
        type: netProfit >= 0 ? 'success' : 'error',
      },
    });

    // Auto-save snapshot
    const state = get();
    persistGameState({
      id: 'CURRENT_GAME',
      dayNumber: state.dayNumber,
      cash: state.cash,
      inventory: state.inventory,
      recipes: state.recipes,
      upgrades: state.upgrades,
      marketPrices: state.marketPrices,
      currentWeather: state.currentWeather.type,
      supplyShockDecision: state.supplyShockDecision,
      lastUpdated: Date.now(),
    });
  },

  applySupplyShockStrategy: async (decision: SupplyShockDecision) => {
    sound.playDing();
    const { marketPrices, recipes } = get();

    // The Minute 40 Supply Shock: Milk price DOUBLES!
    const doubledMilkPrice = marketPrices.milkPerLiter * 2;
    const updatedMarket: MarketPrices = {
      ...marketPrices,
      milkPerLiter: doubledMilkPrice,
    };

    const updatedRecipes = { ...recipes };

    if (decision === 'RAISE_PRICES') {
      // +50% price on all milky chai items
      for (const key of Object.keys(updatedRecipes) as RecipeKey[]) {
        if (updatedRecipes[key].category === 'CHAI') {
          updatedRecipes[key].currentPrice = Math.round(updatedRecipes[key].currentPrice * 1.5);
        }
      }
    } else if (decision === 'PIVOT_MENU') {
      // Unlock Sulaimani Chai and promote snacks
      updatedRecipes.SULAIMANI_CHAI.unlocked = true;
      updatedRecipes.SULAIMANI_CHAI.currentPrice = 14.0;
    }
    // If 'ABSORB_MARGIN', prices remain unchanged, absorbs cost

    set({
      marketPrices: updatedMarket,
      recipes: updatedRecipes,
      supplyShockDecision: decision,
      supplyShockTriggered: true,
      phase: 'SUMMARY',
      notification: {
        message: 'Strategy adopted! Milk procurement costs doubled across market.',
        type: 'info',
      },
    });

    // Persist
    const state = get();
    await persistGameState({
      id: 'CURRENT_GAME',
      dayNumber: state.dayNumber,
      cash: state.cash,
      inventory: state.inventory,
      recipes: state.recipes,
      upgrades: state.upgrades,
      marketPrices: state.marketPrices,
      currentWeather: state.currentWeather.type,
      supplyShockDecision: state.supplyShockDecision,
      lastUpdated: Date.now(),
    });
  },

  proceedToNextDay: async () => {
    const { dayNumber } = get();
    const nextDay = dayNumber + 1;

    // Roll next weather
    const weathers = Object.values(WEATHER_FORECASTS);
    const nextWeather = weathers[Math.floor(Math.random() * weathers.length)];

    set({
      dayNumber: nextDay,
      currentWeather: nextWeather,
      phase: 'PREP',
      activeDaySummary: null,
      notification: { message: `Welcome to Day ${nextDay}! Check the forecast & procure stock.`, type: 'info' },
    });

    const state = get();
    await persistGameState({
      id: 'CURRENT_GAME',
      dayNumber: state.dayNumber,
      cash: state.cash,
      inventory: state.inventory,
      recipes: state.recipes,
      upgrades: state.upgrades,
      marketPrices: state.marketPrices,
      currentWeather: state.currentWeather.type,
      supplyShockDecision: state.supplyShockDecision,
      lastUpdated: Date.now(),
    });
  },

  buyUpgrade: (id: keyof Upgrades) => {
    const { cash, upgrades } = get();
    const item = UPGRADE_CATALOG.find((u) => u.id === id);
    if (!item) return false;

    if (upgrades[id]) {
      set({ notification: { message: 'Upgrade already installed!', type: 'info' } });
      return false;
    }

    if (cash < item.cost) {
      sound.playBuzzer();
      set({ notification: { message: 'Insufficient cash for this upgrade!', type: 'error' } });
      return false;
    }

    sound.playFanfare();
    const nextUpgrades = {
      ...upgrades,
      [id]: true,
    };

    set({
      cash: Math.round((cash - item.cost) * 100) / 100,
      upgrades: nextUpgrades,
      notification: { message: `Unlocked: ${item.name}!`, type: 'success' },
    });

    const state = get();
    persistGameState({
      id: 'CURRENT_GAME',
      dayNumber: state.dayNumber,
      cash: state.cash,
      inventory: state.inventory,
      recipes: state.recipes,
      upgrades: state.upgrades,
      marketPrices: state.marketPrices,
      currentWeather: state.currentWeather.type,
      supplyShockDecision: state.supplyShockDecision,
      lastUpdated: Date.now(),
    });

    return true;
  },

  dismissNotification: () => set({ notification: null }),

  resetGame: async () => {
    await wipeAllData();
    set({
      dayNumber: 1,
      phase: 'PREP',
      cash: INITIAL_CASH,
      inventory: { ...INITIAL_INVENTORY },
      recipes: { ...INITIAL_RECIPES },
      upgrades: { ...INITIAL_UPGRADES },
      marketPrices: { ...DEFAULT_MARKET_PRICES },
      currentWeather: WEATHER_FORECASTS.SUNNY,
      supplyShockDecision: 'PENDING',
      supplyShockTriggered: false,
      customers: [],
      dayStats: {
        grossRevenue: 0,
        cogs: 0,
        cupsSold: 0,
        customersServed: 0,
        customersLost: 0,
        ratings: [],
        customerFeedback: [],
      },
      activeDaySummary: null,
      historicalSummaries: [],
      notification: { message: 'Game reset to Day 1 fresh state.', type: 'info' },
    });
  },
}));
