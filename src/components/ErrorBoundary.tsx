import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FinTrack₵ UI error:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-gutter py-xl text-center">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center mb-6">
            <span className="text-white font-bold text-lg">₵</span>
          </div>
          <h1 className="text-h2 font-semibold text-on-surface mb-2">Something went wrong</h1>
          <p className="text-body-sm text-outline mb-8 max-w-sm">
            An unexpected error occurred. Reload the app to continue. If it keeps happening, try
            signing in again.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-body-sm font-medium
                       hover:bg-primary-container transition-colors"
          >
            Reload FinTrack₵
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
