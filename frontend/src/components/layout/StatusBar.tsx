import { FC } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export const StatusBar: FC = () => {
  const { inventory } = useGameStore();

  const getStatusColor = (val: number, thresholdLow: number) => {
    if (val === 0) return 'text-red-400 bg-red-950/40 border-red-800/50';
    if (val < thresholdLow) return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
    return 'text-emerald-400 bg-emerald-950/20 border-emerald-800/40';
  };

  return (
    <div className="bg-stone-900/60 border-b border-stone-800 px-4 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
          Stock HUD:
        </span>

        <div className="flex items-center gap-2 flex-nowrap">
          {/* Milk */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.milk,
              300
            )}`}
          >
            <span>🥛</span>
            <span className="font-semibold">Milk:</span>
            <span className="font-mono font-bold">{inventory.milk} ml</span>
          </div>

          {/* Tea Leaves */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.teaLeaves,
              40
            )}`}
          >
            <span>🍃</span>
            <span className="font-semibold">Tea:</span>
            <span className="font-mono font-bold">{inventory.teaLeaves} g</span>
          </div>

          {/* Sugar */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.sugar,
              50
            )}`}
          >
            <span>🍬</span>
            <span className="font-semibold">Sugar:</span>
            <span className="font-mono font-bold">{inventory.sugar} g</span>
          </div>

          {/* Ginger */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.ginger,
              5
            )}`}
          >
            <span>🫚</span>
            <span className="font-semibold">Ginger:</span>
            <span className="font-mono font-bold">{inventory.ginger} g</span>
          </div>

          {/* Cardamom */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.cardamom,
              5
            )}`}
          >
            <span>🌿</span>
            <span className="font-semibold">Cardamom:</span>
            <span className="font-mono font-bold">{inventory.cardamom} pods</span>
          </div>

          {/* Cups */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.cups,
              6
            )}`}
          >
            <span>🏺</span>
            <span className="font-semibold">Cups:</span>
            <span className="font-mono font-bold">{inventory.cups}</span>
          </div>

          {/* Samosa */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.samosa,
              2
            )}`}
          >
            <span>🥟</span>
            <span className="font-semibold">Samosa:</span>
            <span className="font-mono font-bold">{inventory.samosa}</span>
          </div>

          {/* Bun Maska */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${getStatusColor(
              inventory.bunMaska,
              2
            )}`}
          >
            <span>🍞</span>
            <span className="font-semibold">Bun Maska:</span>
            <span className="font-mono font-bold">{inventory.bunMaska}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
