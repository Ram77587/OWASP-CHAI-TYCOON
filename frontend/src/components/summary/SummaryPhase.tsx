import { FC, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, DollarSign, Sparkles, Star, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { Button } from '../common/Button';

interface SummaryPhaseProps {
  onOpenUpgrades: () => void;
}

export const SummaryPhase: FC<SummaryPhaseProps> = ({ onOpenUpgrades }) => {
  const {
    activeDaySummary,
    dayNumber,
    cash,
    proceedToNextDay,
  } = useGameStore();

  useEffect(() => {
    if (activeDaySummary && activeDaySummary.netProfit > 0) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981'],
      });
    }
  }, [activeDaySummary]);

  if (!activeDaySummary) return null;

  const isProfitable = activeDaySummary.netProfit >= 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div
        className={`border rounded-3xl p-6 shadow-2xl text-center space-y-2 ${
          isProfitable
            ? 'bg-gradient-to-b from-amber-950/60 to-stone-900 border-amber-600/40'
            : 'bg-gradient-to-b from-red-950/40 to-stone-900 border-red-800/40'
        }`}
      >
        <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
          Day {activeDaySummary.dayNumber} Financial Ledger
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
          {isProfitable ? 'Profitable Day at the Stall!' : 'Tough Day at the Counter'}
        </h2>
        <div className="flex items-center justify-center gap-2 pt-1">
          {isProfitable ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-lg font-bold font-mono">
              <TrendingUp size={22} />
              <span>Net Profit: +₹{activeDaySummary.netProfit.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-400 text-lg font-bold font-mono">
              <TrendingDown size={22} />
              <span>Net Loss: -₹{Math.abs(activeDaySummary.netProfit).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Financial P&L on left, Operations & Ratings on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Financial Statement */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <DollarSign className="text-amber-500" size={20} />
            <h3 className="font-bold text-stone-100 text-base">Profit & Loss Statement (P&L)</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center text-stone-300">
              <span>Gross Sales (Cups + Tips):</span>
              <span className="font-mono font-bold text-emerald-400">
                +₹{activeDaySummary.grossRevenue.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-400 text-xs pl-2">
              <span>- Raw Materials (COGS):</span>
              <span className="font-mono text-red-400">
                -₹{activeDaySummary.cogs.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-400 text-xs pl-2">
              <span>- Stall Municipal Rent:</span>
              <span className="font-mono text-red-400">
                -₹{activeDaySummary.stallRent.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-400 text-xs pl-2">
              <span>- Overnight Milk Spoilage:</span>
              <span className="font-mono text-red-400">
                -₹{activeDaySummary.spoilageCost.toFixed(2)}
              </span>
            </div>

            <div className="h-[1px] bg-stone-800 my-2" />

            <div className="flex justify-between items-center text-base font-extrabold">
              <span className="text-stone-200">Daily Net Margin:</span>
              <span
                className={`font-mono ${
                  isProfitable ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isProfitable ? '+' : ''}₹{activeDaySummary.netProfit.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-stone-400 pt-1 border-t border-stone-800">
              <span>Ending Cash Balance:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                ₹{cash.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Metrics & Customer Reviews */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Users className="text-amber-500" size={20} />
            <h3 className="font-bold text-stone-100 text-base">Service & Satisfaction</h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400">Cups Sold</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono mt-1">
                {activeDaySummary.cupsSold}
              </div>
            </div>

            <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400">Served</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                {activeDaySummary.customersServed}
              </div>
            </div>

            <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400">Lost</div>
              <div className="text-xl font-extrabold text-red-400 font-mono mt-1">
                {activeDaySummary.customersLost}
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div className="text-xs text-stone-300 font-semibold">Reputation Score:</div>
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(activeDaySummary.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-700'
                    }
                  />
                ))}
              </div>
              <span className="font-mono text-sm font-bold text-amber-300">
                {activeDaySummary.averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Feedback Quotes */}
          {activeDaySummary.customerFeedback.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Neighborhood Buzz:
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto text-xs text-stone-300 italic">
                {activeDaySummary.customerFeedback.slice(-3).map((f, i) => (
                  <div key={i}>• {f}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={onOpenUpgrades}
          className="w-full sm:w-auto"
        >
          <Sparkles size={18} className="text-amber-400" />
          <span>Visit Upgrade Market</span>
        </Button>

        <Button
          variant="amber"
          size="lg"
          onClick={proceedToNextDay}
          className="w-full sm:w-auto px-8"
        >
          <span>Proceed to Day {dayNumber + 1} Prep</span>
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};
