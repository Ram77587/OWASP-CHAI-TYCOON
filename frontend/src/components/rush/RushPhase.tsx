import { FC, useEffect } from 'react';
import { Clock, Coffee, Sparkles, User, Users } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { canFulfillOrder, getMissingIngredients } from '../../engine/inventoryEngine';
import { Button } from '../common/Button';
import { sound } from '../../engine/audioSynth';

export const RushPhase: FC = () => {
  const {
    dayNumber,
    daySecondsRemaining,
    dayTotalSeconds,
    customers,
    recipes,
    inventory,
    upgrades,
    dayStats,
    kettleState,
    tickRush,
    serveCustomer,
  } = useGameStore();

  // Tick timer effect (1 second = 1 game tick)
  useEffect(() => {
    const interval = setInterval(() => {
      tickRush();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickRush]);

  // Keyboard shortcut listener (1-4 keys to serve queue slots, Space for brew)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        sound.playBoil();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const slot = parseInt(e.key, 10) - 1;
        if (customers[slot]) {
          serveCustomer(customers[slot].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customers, serveCustomer]);

  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((dayTotalSeconds - daySecondsRemaining) / dayTotalSeconds) * 100))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Day Timer & Progress Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-2xl">
              <Clock size={22} />
            </div>
            <div>
              <div className="font-extrabold text-stone-100 text-lg flex items-center gap-2">
                Day {dayNumber} Rush Hour
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {daySecondsRemaining}s left
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Hotkeys: Press <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-300 font-mono">1</kbd> to <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-300 font-mono">4</kbd> to serve queue • <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-300 font-mono">Space</kbd> to boil
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-stone-400">Cups Sold: </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {dayStats.cupsSold}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-stone-800" />
            <div className="text-right">
              <span className="text-stone-400">Revenue: </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ₹{dayStats.grossRevenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-stone-950 rounded-full h-2.5 overflow-hidden border border-stone-800">
          <div
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 h-2.5 rounded-full transition-all duration-1000 ease-linear shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Rush Layout: Animated Stall & Customer Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stall & Brewing Station Canvas (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-amber-950/40 border border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden">
          {/* Assistant Chotu status banner if unlocked */}
          {upgrades.chotuAssistant && (
            <div className="w-full bg-amber-950/80 border border-amber-600/40 rounded-2xl px-3 py-1.5 flex items-center justify-between text-xs text-amber-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <span>🧑‍🍳</span> Assistant Chotu Active
              </span>
              <span className="text-[10px] text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-full">
                Auto-Serving
              </span>
            </div>
          )}

          {/* Animated Boiling Kettle Visual */}
          <div className="my-auto flex flex-col items-center justify-center relative py-6">
            {/* Steam animation particles */}
            <div className="flex gap-2 mb-1">
              <div
                className={`w-2 h-6 bg-white/30 rounded-full blur-[2px] transition duration-700 ${
                  kettleState !== 'IDLE' ? 'animate-steam' : 'opacity-0'
                }`}
              />
              <div
                className={`w-2.5 h-8 bg-white/40 rounded-full blur-[2px] delay-150 transition duration-700 ${
                  kettleState !== 'IDLE' ? 'animate-steam' : 'opacity-0'
                }`}
              />
              <div
                className={`w-2 h-6 bg-white/30 rounded-full blur-[2px] delay-300 transition duration-700 ${
                  kettleState !== 'IDLE' ? 'animate-steam' : 'opacity-0'
                }`}
              />
            </div>

            {/* Kettle Urn */}
            <div
              className={`w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl relative transition duration-300 ${
                upgrades.brassSamovar
                  ? 'bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-700 border-2 border-amber-300'
                  : 'bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 border-2 border-stone-600'
              } ${kettleState === 'BOILING' ? 'scale-105 animate-bubble' : ''} ${
                kettleState === 'POURING' ? 'rotate-12 translate-x-2' : ''
              }`}
            >
              <Coffee
                size={54}
                className={upgrades.brassSamovar ? 'text-amber-100' : 'text-stone-300'}
              />
              <div className="absolute -right-3 top-6 w-5 h-8 border-4 border-amber-500/60 rounded-r-xl" />
            </div>

            {/* Stove Flame */}
            <div className="flex gap-1.5 mt-3">
              <div className="w-3 h-4 bg-orange-500 rounded-full blur-[1px] animate-pulse" />
              <div className="w-3 h-5 bg-amber-400 rounded-full blur-[1px] animate-pulse delay-75" />
              <div className="w-3 h-4 bg-orange-500 rounded-full blur-[1px] animate-pulse delay-150" />
            </div>
          </div>

          {/* Quick manual brew / sound trigger */}
          <button
            onClick={() => sound.playBoil()}
            className="w-full bg-stone-950/60 hover:bg-stone-950 border border-stone-800 hover:border-amber-700/60 p-2.5 rounded-2xl text-xs font-semibold text-stone-300 flex items-center justify-center gap-2 transition"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Stir Kettle & Simmer Brew (Space)</span>
          </button>
        </div>

        {/* Right: Customer Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="text-amber-500" size={20} />
              <h3 className="text-lg font-bold text-stone-100">Customer Queue</h3>
            </div>
            <span className="text-xs text-stone-400">
              {customers.length} waiting • Max capacity: {upgrades.allWeatherAwning ? 5 : 4}
            </span>
          </div>

          {customers.length === 0 ? (
            <div className="bg-stone-900/50 border border-dashed border-stone-800 rounded-3xl p-12 text-center space-y-2">
              <User className="mx-auto text-stone-600" size={36} />
              <div className="text-stone-400 font-semibold text-sm">Waiting for commuters...</div>
              <div className="text-stone-600 text-xs">Customers will arrive shortly at your stall.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {customers.map((customer, index) => {
                const recipe = recipes[customer.orderRecipeKey];
                const canServe = canFulfillOrder(inventory, recipe);
                const missing = getMissingIngredients(inventory, recipe);

                // Patience percentage
                const patienceRatio = customer.patience / customer.maxPatience;
                const patienceColor =
                  patienceRatio > 0.5
                    ? 'bg-emerald-500'
                    : patienceRatio > 0.25
                    ? 'bg-amber-500'
                    : 'bg-red-500 animate-pulse';

                return (
                  <div
                    key={customer.id}
                    className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-700/40 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  >
                    {/* Left: Customer Info & Order Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-stone-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-bold text-stone-100 text-sm">{customer.name}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                          {customer.archetype.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                          Order: {recipe.name} (₹{recipe.currentPrice})
                        </span>
                      </div>

                      {/* Patience Timer Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-stone-400">
                          <span>Patience</span>
                          <span>{customer.patience}s</span>
                        </div>
                        <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-1000 ${patienceColor}`}
                            style={{ width: `${patienceRatio * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Tactile Serve Button or Out-of-Stock Alert */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <Button
                        size="md"
                        variant={canServe ? 'primary' : 'danger'}
                        disabled={!canServe}
                        onClick={() => serveCustomer(customer.id)}
                        className="w-full sm:w-auto px-5"
                      >
                        {canServe ? (
                          <>
                            <span>Serve Order</span>
                            <kbd className="hidden sm:inline bg-amber-600/40 text-stone-950 px-1 rounded text-xs">
                              {index + 1}
                            </kbd>
                          </>
                        ) : (
                          <span>Out of Stock!</span>
                        )}
                      </Button>

                      {/* Missing stock details */}
                      {!canServe && missing.length > 0 && (
                        <div className="text-[10px] text-red-400 max-w-[170px] text-right font-medium">
                          Missing: {missing.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Customer Reviews Ticker */}
          {dayStats.customerFeedback.length > 0 && (
            <div className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-3 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Live Customer Reactions:
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {dayStats.customerFeedback.map((fb, idx) => (
                  <div key={idx} className="text-stone-300 italic">
                    • {fb}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
