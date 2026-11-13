import { FC, useState } from 'react';
import { Coffee, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { sound } from '../../engine/audioSynth';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface HeaderProps {
  onOpenUpgrades: () => void;
}

export const Header: FC<HeaderProps> = ({ onOpenUpgrades }) => {
  const {
    dayNumber,
    cash,
    currentWeather,
    phase,
    resetGame,
  } = useGameStore();

  const [audioMuted, setAudioMuted] = useState(!sound.enabled);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setAudioMuted(!sound.enabled);
    if (sound.enabled) {
      sound.playCoin();
    }
  };

  return (
    <>
      <header className="bg-stone-900/90 backdrop-blur-md border-b border-amber-950/80 sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Day Counter */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 shadow-md shadow-amber-950/40">
              <Coffee size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-100 flex items-center gap-1.5">
                  Chai Tycoon <span className="text-amber-500 font-mono text-xs uppercase px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">v1.0</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="font-semibold text-amber-400">Day {dayNumber}</span>
                <span>•</span>
                <span className="capitalize">{phase.toLowerCase()} Phase</span>
              </div>
            </div>
          </div>

          {/* Center Weather & Cash display */}
          <div className="flex items-center gap-3">
            {/* Weather Pill */}
            <div
              className="hidden sm:flex items-center gap-2 bg-stone-800/90 border border-stone-700/60 px-3 py-1.5 rounded-2xl text-xs"
              title={currentWeather.description}
            >
              <span className="text-base">{currentWeather.icon}</span>
              <div>
                <div className="font-semibold text-stone-200">{currentWeather.name}</div>
                <div className="text-[10px] text-stone-400">{Math.round((currentWeather.teaDemandMultiplier - 1) * 100)}% Chai Demand</div>
              </div>
            </div>

            {/* Cash Balance */}
            <div className="bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-600/40 px-4 py-1.5 rounded-2xl flex items-center gap-2 shadow-inner">
              <span className="text-amber-400 font-bold text-sm">₹</span>
              <span className="font-mono font-extrabold text-base sm:text-lg text-amber-300">
                {cash.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUpgrades}
              className="flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 px-3 py-2 rounded-xl text-xs font-semibold transition"
              title="Open Upgrade Market"
            >
              <Sparkles size={16} />
              <span className="hidden md:inline">Upgrades</span>
            </button>

            <button
              onClick={toggleSound}
              aria-label={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {audioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              onClick={() => setIsResetModalOpen(true)}
              aria-label="Reset Game Data"
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-red-950/60 hover:text-red-400 text-stone-400 transition"
              title="Reset Game"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Game Progress?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-stone-300">
            Are you sure you want to reset Chai Tycoon? This will clear all historical days, upgrades, and return you to Day 1 with ₹500 starting capital.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await resetGame();
                setIsResetModalOpen(false);
              }}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
