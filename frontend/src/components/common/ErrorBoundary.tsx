import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Chai Tycoon] Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleWipeReset = () => {
    indexedDB.deleteDatabase('ChaiTycoonDB');
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-stone-900 border border-amber-900/50 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-amber-500">Stall Encountered a Hiccup</h1>
            <p className="text-stone-400 text-sm">
              An unexpected client runtime error occurred. Your local save is secure.
            </p>
            <div className="bg-stone-950 p-3 rounded-lg text-xs font-mono text-red-400 text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown render error'}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold py-2.5 px-4 rounded-xl transition"
              >
                Reload Game
              </button>
              <button
                onClick={this.handleWipeReset}
                className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium py-2.5 px-4 rounded-xl text-xs transition"
              >
                Wipe & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
