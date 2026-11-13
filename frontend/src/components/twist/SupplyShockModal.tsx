import { FC } from 'react';
import { AlertTriangle, Award, Check, DollarSign, Milk, Zap } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { SupplyShockDecision } from '../../types';

export const SupplyShockModal: FC = () => {
  const { phase, applySupplyShockStrategy } = useGameStore();

  if (phase !== 'SUPPLY_SHOCK') return null;

  const handleSelect = (decision: SupplyShockDecision) => {
    applySupplyShockStrategy(decision);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supply-shock-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="max-w-3xl w-full bg-stone-900 border-2 border-red-600/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100 my-8">
        {/* Breaking News Alert Banner */}
        <div className="bg-red-950/80 border border-red-600/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-red-600 text-stone-950 rounded-xl animate-pulse">
            <AlertTriangle size={28} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest font-mono font-black text-red-400">
              Breaking News • Market Supply Shock
            </div>
            <h2 id="supply-shock-title" className="text-xl sm:text-2xl font-black text-red-200">
              Dairy Strike Freeze: Milk Costs Double!
            </h2>
          </div>
        </div>

        {/* Narrative Context */}
        <p className="text-sm text-stone-300 leading-relaxed">
          Overnight transportation strikes and state border dairy checkpoints have paralyzed supply chains.
          Wholesale milk procurement prices have spiked instantly from <span className="font-bold text-amber-400">₹30/L</span> to{' '}
          <span className="font-bold text-red-400">₹60/L</span>! As the stall owner, you must choose an immediate strategic response before opening Day 2:
        </p>

        {/* 3 Strategic Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Raise Prices */}
          <div className="bg-stone-950/80 border border-stone-800 hover:border-amber-500/60 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition shadow-lg group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <DollarSign size={22} />
              </div>
              <h3 className="font-bold text-base text-stone-100 group-hover:text-amber-400 transition">
                1. Raise Prices (+50%)
              </h3>
              <p className="text-xs text-stone-400">
                Hike Chai selling prices to ₹15 - ₹35 to protect your unit profit margin.
              </p>
              <div className="space-y-1 text-[11px] pt-2 border-t border-stone-800">
                <div className="text-emerald-400 flex items-center gap-1">
                  <Check size={12} /> Safe margin per cup
                </div>
                <div className="text-red-400 flex items-center gap-1">
                  <span>✕</span> Price-sensitive students walk away
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('RAISE_PRICES')}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition active:scale-95 shadow-md"
            >
              Raise Prices
            </button>
          </div>

          {/* Option 2: Absorb Margin */}
          <div className="bg-stone-950/80 border border-stone-800 hover:border-emerald-500/60 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition shadow-lg group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Award size={22} />
              </div>
              <h3 className="font-bold text-base text-stone-100 group-hover:text-emerald-400 transition">
                2. Absorb Margin
              </h3>
              <p className="text-xs text-stone-400">
                Keep prices strictly flat. Take the financial hit to win customer loyalty & tips.
              </p>
              <div className="space-y-1 text-[11px] pt-2 border-t border-stone-800">
                <div className="text-emerald-400 flex items-center gap-1">
                  <Check size={12} /> +25% Tips & 5-Star Reviews
                </div>
                <div className="text-red-400 flex items-center gap-1">
                  <span>✕</span> Razor-thin ₹1 profit per cup
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('ABSORB_MARGIN')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition active:scale-95 shadow-md"
            >
              Absorb the Cost
            </button>
          </div>

          {/* Option 3: Pivot Menu */}
          <div className="bg-stone-950/80 border border-stone-800 hover:border-blue-500/60 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition shadow-lg group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Zap size={22} />
              </div>
              <h3 className="font-bold text-base text-stone-100 group-hover:text-blue-400 transition">
                3. Pivot Menu
              </h3>
              <p className="text-xs text-stone-400">
                Unlock Kerala Sulaimani Chai (0% milk, black spiced tea) & push high-margin snacks.
              </p>
              <div className="space-y-1 text-[11px] pt-2 border-t border-stone-800">
                <div className="text-emerald-400 flex items-center gap-1">
                  <Check size={12} /> Zero milk reliance
                </div>
                <div className="text-amber-400 flex items-center gap-1">
                  <span>~</span> Must satisfy traditionalists
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelect('PIVOT_MENU')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 shadow-md"
            >
              Pivot to Sulaimani
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
          <span className="flex items-center gap-1.5">
            <Milk size={14} className="text-red-400" />
            Spot market milk rate: ₹60/L across all wholesalers
          </span>
          <span className="text-amber-400 font-medium">Select a strategy to unlock Day 2</span>
        </div>
      </div>
    </div>
  );
};
