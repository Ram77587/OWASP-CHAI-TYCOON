import { FC } from 'react';
import { ArrowRight, Flame, ShoppingCart, Sliders, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { calculateProfitMarginPercent, calculateRecipeUnitCost } from '../../engine/economyEngine';
import { calculateMaxPossibleServings } from '../../engine/inventoryEngine';
import { Button } from '../common/Button';
import { RecipeKey } from '../../types';

export const PrepPhase: FC = () => {
  const {
    dayNumber,
    cash,
    inventory,
    recipes,
    marketPrices,
    currentWeather,
    supplyShockDecision,
    buyInventory,
    updateRecipePrice,
    startDayRush,
  } = useGameStore();

  const handlePriceChange = (key: RecipeKey, delta: number) => {
    const current = recipes[key].currentPrice;
    updateRecipePrice(key, current + delta);
  };

  // Procurement items configuration
  const marketItems = [
    {
      label: 'Fresh Dairy Milk',
      icon: '🥛',
      pack: '1000 ml (1L)',
      amount: 1000,
      cost: marketPrices.milkPerLiter,
      invKey: 'milk' as const,
      current: `${inventory.milk} ml`,
      shockNotice: marketPrices.milkPerLiter > 30 ? 'SURGE PRICE' : null,
    },
    {
      label: 'Assam Tea Leaves',
      icon: '🍃',
      pack: '250 g pack',
      amount: 250,
      cost: Math.round((marketPrices.teaLeavesPerKg * 0.25) * 100) / 100,
      invKey: 'teaLeaves' as const,
      current: `${inventory.teaLeaves} g`,
    },
    {
      label: 'Fine Sugar',
      icon: '🍬',
      pack: '500 g pack',
      amount: 500,
      cost: Math.round((marketPrices.sugarPerKg * 0.5) * 100) / 100,
      invKey: 'sugar' as const,
      current: `${inventory.sugar} g`,
    },
    {
      label: 'Fresh Ginger (Adrak)',
      icon: '🫚',
      pack: '50 g pack',
      amount: 50,
      cost: Math.round((marketPrices.gingerPer100g * 0.5) * 100) / 100,
      invKey: 'ginger' as const,
      current: `${inventory.ginger} g`,
    },
    {
      label: 'Green Cardamom (Elaichi)',
      icon: '🌿',
      pack: '25 pods',
      amount: 25,
      cost: Math.round((marketPrices.cardamomPer50g * 0.5) * 100) / 100,
      invKey: 'cardamom' as const,
      current: `${inventory.cardamom} pods`,
    },
    {
      label: 'Terracotta / Paper Cups',
      icon: '🏺',
      pack: '25 cups',
      amount: 25,
      cost: Math.round((marketPrices.cupsPer50Units * 0.5) * 100) / 100,
      invKey: 'cups' as const,
      current: `${inventory.cups} pcs`,
    },
    {
      label: 'Bun Maska (Fresh)',
      icon: '🍞',
      pack: '4 pcs wholesale',
      amount: 4,
      cost: marketPrices.bunMaskaPerUnit * 4,
      invKey: 'bunMaska' as const,
      current: `${inventory.bunMaska} pcs`,
    },
    {
      label: 'Spiced Samosas',
      icon: '🥟',
      pack: '6 pcs batch',
      amount: 6,
      cost: marketPrices.samosaPerUnit * 6,
      invKey: 'samosa' as const,
      current: `${inventory.samosa} pcs`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Weather Forecast Card */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-900/50 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl p-3 bg-stone-900/80 rounded-2xl border border-stone-800 shadow-inner">
              {currentWeather.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Day {dayNumber} Forecast
                </span>
                {supplyShockDecision !== 'PENDING' && (
                  <span className="text-[10px] bg-red-950 border border-red-800 text-red-300 font-semibold px-2 py-0.5 rounded-full">
                    Supply Shock Active
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-100">{currentWeather.name}</h2>
              <p className="text-stone-300 text-sm mt-1">{currentWeather.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/90 border border-stone-800 p-3 rounded-2xl">
            <div className="text-center px-2">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Footfall</div>
              <div className="text-base font-extrabold text-amber-400">
                {currentWeather.trafficMultiplier}x
              </div>
            </div>
            <div className="h-8 w-[1px] bg-stone-800" />
            <div className="text-center px-2">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Chai Craving</div>
              <div className="text-base font-extrabold text-amber-300">
                {currentWeather.teaDemandMultiplier}x
              </div>
            </div>
            <div className="h-8 w-[1px] bg-stone-800" />
            <div className="text-center px-2">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Snack Craving</div>
              <div className="text-base font-extrabold text-amber-400">
                {currentWeather.snackDemandMultiplier}x
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Procurement on left, Pricing & Menu on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Market Procurement (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-amber-500" size={20} />
              <h3 className="text-lg font-bold text-stone-100">Wholesale Raw Material Market</h3>
            </div>
            <span className="text-xs text-stone-400">
              Cash: <span className="font-mono text-amber-300 font-bold">₹{cash.toFixed(2)}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketItems.map((item) => {
              const canAfford = cash >= item.cost;
              return (
                <div
                  key={item.label}
                  className="bg-stone-900/80 border border-stone-800/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-amber-700/50 transition shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-200 text-sm">{item.label}</div>
                        <div className="text-xs text-stone-400">{item.pack}</div>
                      </div>
                    </div>
                    {item.shockNotice && (
                      <span className="text-[9px] bg-red-900/80 text-red-200 font-bold px-1.5 py-0.5 rounded border border-red-700">
                        {item.shockNotice}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">In Stock: {item.current}</div>
                      <div className="text-sm font-extrabold text-amber-400 font-mono">
                        ₹{item.cost.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={canAfford ? 'primary' : 'secondary'}
                      disabled={!canAfford}
                      onClick={() => buyInventory(item.invKey, item.amount, item.cost)}
                    >
                      Buy Stock
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recipe Pricing & Elasticity (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="text-amber-500" size={20} />
              <h3 className="text-lg font-bold text-stone-100">Menu & Dynamic Pricing</h3>
            </div>
            <span className="text-xs text-stone-400">Tune margins per cup</span>
          </div>

          <div className="space-y-3">
            {(Object.keys(recipes) as RecipeKey[])
              .filter((key) => recipes[key].unlocked)
              .map((key) => {
                const recipe = recipes[key];
                const unitCost = calculateRecipeUnitCost(recipe, marketPrices);
                const margin = calculateProfitMarginPercent(recipe.currentPrice, unitCost);
                const maxServings = calculateMaxPossibleServings(inventory, recipe);

                return (
                  <div
                    key={key}
                    className="bg-stone-900/90 border border-stone-800/80 rounded-2xl p-4 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-stone-100 text-sm flex items-center gap-1.5">
                          {recipe.name}
                          <span className="text-xs font-normal text-amber-500/80">({recipe.hindiName})</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">{recipe.description}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            maxServings > 0
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-red-950 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {maxServings} cups ready
                        </span>
                      </div>
                    </div>

                    {/* Cost, Margin & Price Slider Controls */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/50">
                      <div>
                        <span className="text-stone-400">Unit COGS: </span>
                        <span className="font-mono text-stone-200 font-semibold">₹{unitCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={13} className={margin >= 40 ? 'text-emerald-400' : 'text-amber-400'} />
                        <span className="text-stone-400">Margin: </span>
                        <span
                          className={`font-bold font-mono ${
                            margin >= 40 ? 'text-emerald-400' : margin > 15 ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {margin}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-stone-950/60 p-2 rounded-xl border border-stone-800/60">
                      <span className="text-xs text-stone-300 font-medium pl-1">Selling Price:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePriceChange(key, -1)}
                          disabled={recipe.currentPrice <= recipe.minPrice}
                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-100 font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="font-mono font-extrabold text-amber-300 text-base min-w-[50px] text-center">
                          ₹{recipe.currentPrice}
                        </span>
                        <button
                          onClick={() => handlePriceChange(key, 1)}
                          disabled={recipe.currentPrice >= recipe.maxPrice}
                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-100 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Launch Rush Action Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 p-5 rounded-3xl border border-amber-600/40 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl">
            <Flame size={24} />
          </div>
          <div>
            <div className="font-bold text-stone-100 text-base">Ready for the Morning Commute?</div>
            <div className="text-xs text-stone-300">
              Ensure you have sufficient milk, tea, and cups. Orders cannot be served once stock empties!
            </div>
          </div>
        </div>

        <Button
          size="lg"
          variant="amber"
          onClick={startDayRush}
          className="w-full sm:w-auto px-8"
        >
          <span>Open Stall for Day {dayNumber}</span>
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};
