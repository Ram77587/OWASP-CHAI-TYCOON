import { FC, useEffect, useState } from 'react';
import { useGameStore } from './stores/useGameStore';
import { Header } from './components/layout/Header';
import { StatusBar } from './components/layout/StatusBar';
import { PrepPhase } from './components/prep/PrepPhase';
import { RushPhase } from './components/rush/RushPhase';
import { SummaryPhase } from './components/summary/SummaryPhase';
import { SupplyShockModal } from './components/twist/SupplyShockModal';
import { UpgradeMarketModal } from './components/upgrades/UpgradeMarketModal';
import { Toast } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const AppContent: FC = () => {
  const {
    isInitialized,
    phase,
    notification,
    initializeGame,
    dismissNotification,
  } = useGameStore();

  const [isUpgradesOpen, setIsUpgradesOpen] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <div className="font-semibold text-sm">Brewing Chai Tycoon...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18110b] text-stone-100 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <Header onOpenUpgrades={() => setIsUpgradesOpen(true)} />

      {/* Live Inventory Status Bar */}
      <StatusBar />

      {/* Main Game Phase Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {phase === 'PREP' && <PrepPhase />}
        {phase === 'RUSH' && <RushPhase />}
        {(phase === 'SUMMARY' || phase === 'SUPPLY_SHOCK') && (
          <SummaryPhase onOpenUpgrades={() => setIsUpgradesOpen(true)} />
        )}
      </main>

      {/* Supply Shock Interactive Twist Gate (Round 1 Modal) */}
      <SupplyShockModal />

      {/* Upgrade Market Modal */}
      <UpgradeMarketModal
        isOpen={isUpgradesOpen}
        onClose={() => setIsUpgradesOpen(false)}
      />

      {/* Floating Notifications */}
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onDismiss={dismissNotification}
        />
      )}

      {/* Accessible Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/80 py-4 text-center text-xs text-stone-500">
        <p>Chai Tycoon ☕ • Built for OWASP NIE VibeSprint 1.0 • 100% Offline Client-Side Architecture</p>
      </footer>
    </div>
  );
};

export const App: FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
