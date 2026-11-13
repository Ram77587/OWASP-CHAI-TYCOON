import { FC } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { UPGRADE_CATALOG } from '../../engine/gameRules';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface UpgradeMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeMarketModal: FC<UpgradeMarketModalProps> = ({ isOpen, onClose }) => {
  const { cash, upgrades, buyUpgrade } = useGameStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stall Equipment & Upgrade Bazaar"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <span className="text-xs text-stone-300 font-medium">Available Investment Capital:</span>
          </div>
          <span className="font-mono font-extrabold text-amber-300 text-base">₹{cash.toFixed(2)}</span>
        </div>

        <div className="space-y-3">
          {UPGRADE_CATALOG.map((item) => {
            const isInstalled = upgrades[item.id];
            const canAfford = cash >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-700/50 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="text-3xl p-2.5 bg-stone-900 rounded-2xl border border-stone-800 shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-100 text-sm">{item.name}</h4>
                      {isInstalled && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-800/50 flex items-center gap-1">
                          <Check size={10} /> Installed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">{item.description}</p>
                    <div className="text-xs text-amber-300 font-medium">⚡ {item.effect}</div>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                  <div className="font-mono font-extrabold text-amber-400 text-base">
                    ₹{item.cost.toFixed(2)}
                  </div>
                  <Button
                    size="sm"
                    variant={isInstalled ? 'secondary' : canAfford ? 'primary' : 'secondary'}
                    disabled={isInstalled || !canAfford}
                    onClick={() => buyUpgrade(item.id)}
                  >
                    {isInstalled ? 'Installed' : canAfford ? 'Invest & Buy' : 'Need More ₹'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
