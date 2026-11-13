import { MarketPrices, Recipe, RecipeKey, Upgrades, WeatherInfo, WeatherType } from '../types';

export const INITIAL_CASH = 500.0;
export const DAILY_STALL_RENT = 45.0;
export const MILK_SPOILAGE_RATE = 0.25; // 25% of leftover milk spoils each night if not chilled

export const DEFAULT_MARKET_PRICES: MarketPrices = {
  milkPerLiter: 30.0, // Baseline: ₹30 per 1000ml (will double to ₹60 in supply shock!)
  teaLeavesPerKg: 320.0, // ₹320 per 1000g (₹0.32/g)
  sugarPerKg: 45.0, // ₹45 per 1000g (₹0.045/g)
  gingerPer100g: 25.0, // ₹25 per 100g (₹0.25/g)
  cardamomPer50g: 110.0, // ₹110 per 50 pods (~₹2.20/pod)
  cupsPer50Units: 40.0, // ₹40 per 50 cups (₹0.80/cup)
  bunMaskaPerUnit: 12.0, // ₹12 purchase, sells for ~₹25
  samosaPerUnit: 8.0, // ₹8 purchase, sells for ~₹18
};

export const INITIAL_RECIPES: Record<RecipeKey, Recipe> = {
  CUTTING_CHAI: {
    id: 'CUTTING_CHAI',
    name: 'Cutting Chai',
    hindiName: 'कटिंग चाय',
    description: 'Half-glass brisk kadak chai. The daily fuel for workers & students.',
    category: 'CHAI',
    ingredients: {
      milk: 50,
      teaLeaves: 3,
      sugar: 5,
      ginger: 0,
      cardamom: 0,
      cups: 1,
    },
    baseCost: 3.5,
    defaultPrice: 10.0,
    currentPrice: 10.0,
    minPrice: 5.0,
    maxPrice: 20.0,
    unlocked: true,
  },
  MASALA_CHAI: {
    id: 'MASALA_CHAI',
    name: 'Special Masala Chai',
    hindiName: 'मसाला चाय',
    description: 'Rich slow-boiled brew infused with crushed ginger & aromatic green cardamom.',
    category: 'CHAI',
    ingredients: {
      milk: 80,
      teaLeaves: 5,
      sugar: 7,
      ginger: 1,
      cardamom: 1,
      cups: 1,
    },
    baseCost: 7.2,
    defaultPrice: 18.0,
    currentPrice: 18.0,
    minPrice: 10.0,
    maxPrice: 35.0,
    unlocked: true,
  },
  ADRAK_ELAICHI: {
    id: 'ADRAK_ELAICHI',
    name: 'Adrak Elaichi Kadak Chai',
    hindiName: 'अदरक इलायची कड़क',
    description: 'Double ginger kick with crushed royal cardamom. Best during chilly rains.',
    category: 'CHAI',
    ingredients: {
      milk: 90,
      teaLeaves: 6,
      sugar: 8,
      ginger: 2,
      cardamom: 2,
      cups: 1,
    },
    baseCost: 9.8,
    defaultPrice: 25.0,
    currentPrice: 25.0,
    minPrice: 15.0,
    maxPrice: 45.0,
    unlocked: true,
  },
  SULAIMANI_CHAI: {
    id: 'SULAIMANI_CHAI',
    name: 'Kerala Sulaimani Chai',
    hindiName: 'सुलेमानी चाय',
    description: 'Golden spiced black tea with lemon notes and zero milk. Highly profitable during dairy crises!',
    category: 'CHAI',
    ingredients: {
      milk: 0, // 0 Milk! Crucial pivot for dairy supply shock
      teaLeaves: 5,
      sugar: 6,
      ginger: 1,
      cardamom: 1,
      cups: 1,
    },
    baseCost: 4.8,
    defaultPrice: 15.0,
    currentPrice: 15.0,
    minPrice: 8.0,
    maxPrice: 30.0,
    unlocked: false, // Unlocked or promoted via Supply Shock / Upgrades
  },
  BUN_MASKA: {
    id: 'BUN_MASKA',
    name: 'Irani Bun Maska',
    hindiName: 'बन मस्का',
    description: 'Pillow-soft fresh bun generously smothered with salted whipped butter.',
    category: 'SNACK',
    ingredients: {
      milk: 0,
      teaLeaves: 0,
      sugar: 0,
      ginger: 0,
      cardamom: 0,
      cups: 0,
      bunMaska: 1,
    },
    baseCost: 12.0,
    defaultPrice: 25.0,
    currentPrice: 25.0,
    minPrice: 15.0,
    maxPrice: 40.0,
    unlocked: true,
  },
  SAMOSA: {
    id: 'SAMOSA',
    name: 'Crispy Samosa (2 pcs)',
    hindiName: 'कुरकुरा समोसा',
    description: 'Flaky pastry stuffed with spiced potato, peas and mint chutney.',
    category: 'SNACK',
    ingredients: {
      milk: 0,
      teaLeaves: 0,
      sugar: 0,
      ginger: 0,
      cardamom: 0,
      cups: 0,
      samosa: 1,
    },
    baseCost: 8.0,
    defaultPrice: 18.0,
    currentPrice: 18.0,
    minPrice: 10.0,
    maxPrice: 35.0,
    unlocked: true,
  },
};

export const WEATHER_FORECASTS: Record<WeatherType, WeatherInfo> = {
  SUNNY: {
    type: 'SUNNY',
    name: 'Pleasant Sunshine',
    icon: '☀️',
    description: 'Steady footfall of office-goers and neighborhood regulars.',
    trafficMultiplier: 1.0,
    teaDemandMultiplier: 1.0,
    snackDemandMultiplier: 1.0,
  },
  MONSOON: {
    type: 'MONSOON',
    name: 'Monsoonal Downpour',
    icon: '🌧️',
    description: 'Heavy rains! People rush to the stall for piping hot Adrak Chai & Crispy Samosas!',
    trafficMultiplier: 1.45,
    teaDemandMultiplier: 1.5,
    snackDemandMultiplier: 1.7,
  },
  WINTER_COLD: {
    type: 'WINTER_COLD',
    name: 'Crisp Morning Chill',
    icon: '❄️',
    description: 'Chilly morning fog! Everyone wants extra kadak masala tea with ginger.',
    trafficMultiplier: 1.25,
    teaDemandMultiplier: 1.35,
    snackDemandMultiplier: 1.1,
  },
  HEATWAVE: {
    type: 'HEATWAVE',
    name: 'Scorching Heat',
    icon: '🔥',
    description: 'High afternoon temperatures. Customers favor lighter drinks or evening visits.',
    trafficMultiplier: 0.8,
    teaDemandMultiplier: 0.75,
    snackDemandMultiplier: 0.85,
  },
};

export interface UpgradeItem {
  id: keyof Upgrades;
  name: string;
  cost: number;
  icon: string;
  description: string;
  effect: string;
}

export const UPGRADE_CATALOG: UpgradeItem[] = [
  {
    id: 'brassSamovar',
    name: 'Handcrafted Brass Samovar',
    cost: 320.0,
    icon: '🫖',
    description: 'Traditional solid brass boiling urn with internal chimney pipe.',
    effect: '+30% Faster Brewing speed & aesthetic visual appeal.',
  },
  {
    id: 'earthenKulhad',
    name: 'Authentic Clay Kulhads',
    cost: 180.0,
    icon: '🏺',
    description: 'Serve tea in porous terracotta clay cups giving that earthy *mitti* aroma.',
    effect: 'Customers tolerate +20% higher pricing and leave better ratings.',
  },
  {
    id: 'streetRadio',
    name: 'Vintage Philips Radio',
    cost: 150.0,
    icon: '📻',
    description: 'Plays classic golden-era retro Bollywood hits at the counter.',
    effect: '+30% Customer Patience! Impatient customers wait longer happily.',
  },
  {
    id: 'allWeatherAwning',
    name: 'Heavy-Duty Tarpaulin Awning',
    cost: 220.0,
    icon: '🎪',
    description: 'Protects customers from driving monsoon rains and scorching sun.',
    effect: 'Completely eliminates rain traffic walkouts and expands queue size.',
  },
  {
    id: 'chotuAssistant',
    name: 'Hire Assistant "Chotu"',
    cost: 400.0,
    icon: '🧑‍🍳',
    description: 'An enthusiastic helper boy who pours, cleans glasses, and assists.',
    effect: 'Enables Quick-Serve Auto Assist — automatically serves ready orders!',
  },
];
