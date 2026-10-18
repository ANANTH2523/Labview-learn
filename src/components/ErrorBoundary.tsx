import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Changing this value clears a previous error (e.g. the active tab). */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

/** Keeps one broken view from blanking the whole app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('View crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="max-w-2xl mx-auto mt-12 p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-slate-200">
        <div className="flex items-center gap-2 font-bold text-red-300">
          <AlertTriangle className="w-5 h-5" />
          Something went wrong in this view
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Your progress is saved. Try another tab, or reload the page.
        </p>
        <button
          onClick={() => this.setState({ error: null })}
          className="mt-4 px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-800 hover:bg-slate-700 cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }
}
