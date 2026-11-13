export type GamePhase = 'PREP' | 'RUSH' | 'SUMMARY' | 'SUPPLY_SHOCK';

export type WeatherType = 'SUNNY' | 'MONSOON' | 'WINTER_COLD' | 'HEATWAVE';

export interface WeatherInfo {
  type: WeatherType;
  name: string;
  icon: string;
  description: string;
  trafficMultiplier: number;
  teaDemandMultiplier: number;
  snackDemandMultiplier: number;
}

export interface Inventory {
  milk: number; // in ml
  teaLeaves: number; // in g
  sugar: number; // in g
  ginger: number; // in g
  cardamom: number; // in pods
  cups: number; // in units
  bunMaska: number; // pre-made snacks
  samosa: number; // pre-made snacks
}

export type RecipeKey =
  | 'CUTTING_CHAI'
  | 'MASALA_CHAI'
  | 'ADRAK_ELAICHI'
  | 'SULAIMANI_CHAI'
  | 'BUN_MASKA'
  | 'SAMOSA';

export interface IngredientRequirement {
  milk: number;
  teaLeaves: number;
  sugar: number;
  ginger: number;
  cardamom: number;
  cups: number;
  bunMaska?: number;
  samosa?: number;
}

export interface Recipe {
  id: RecipeKey;
  name: string;
  hindiName: string;
  description: string;
  category: 'CHAI' | 'SNACK';
  ingredients: IngredientRequirement;
  baseCost: number;
  defaultPrice: number;
  currentPrice: number;
  unlocked: boolean;
  minPrice: number;
  maxPrice: number;
}

export type CustomerArchetype =
  | 'COLLEGE_STUDENT'
  | 'IT_TECHIE'
  | 'LOCAL_UNCLE'
  | 'COMMUTER';

export type CustomerStatus =
  | 'WAITING'
  | 'BEING_SERVED'
  | 'SERVED'
  | 'ANGRY_LEAVE'
  | 'OUT_OF_STOCK_LEAVE';

export interface Customer {
  id: string;
  archetype: CustomerArchetype;
  name: string;
  avatarSeed: number;
  orderRecipeKey: RecipeKey;
  orderQuantity: number;
  patience: number; // Current remaining seconds
  maxPatience: number; // Total initial seconds
  priceTolerance: number; // Max price willing to pay without complaining
  status: CustomerStatus;
  dialogue?: string;
}

export interface DaySummary {
  id?: number;
  dayNumber: number;
  weather: WeatherType;
  grossRevenue: number;
  cogs: number;
  stallRent: number;
  spoilageCost: number;
  netProfit: number;
  cupsSold: number;
  customersServed: number;
  customersLost: number;
  ratings: number[];
  averageRating: number;
  customerFeedback: string[];
  timestamp: number;
}

export interface Upgrades {
  brassSamovar: boolean; // +30% faster boiling
  earthenKulhad: boolean; // +15% price tolerance, higher ratings
  chotuAssistant: boolean; // Auto-serves matching orders when stocked
  streetRadio: boolean; // +30% customer patience
  allWeatherAwning: boolean; // Rain traffic boost preserved without umbrella issues
}

export type SupplyShockDecision =
  | 'PENDING'
  | 'RAISE_PRICES'
  | 'ABSORB_MARGIN'
  | 'PIVOT_MENU';

export interface MarketPrices {
  milkPerLiter: number; // ₹ per 1000ml
  teaLeavesPerKg: number; // ₹ per 1000g
  sugarPerKg: number; // ₹ per 1000g
  gingerPer100g: number; // ₹ per 100g
  cardamomPer50g: number; // ₹ per 50g
  cupsPer50Units: number; // ₹ per 50 cups
  bunMaskaPerUnit: number; // ₹ per piece
  samosaPerUnit: number; // ₹ per piece
}

export interface GameSettings {
  audioEnabled: boolean;
  soundVolume: number;
  autoServeUnlocked: boolean;
}
