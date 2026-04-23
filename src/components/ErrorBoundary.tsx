import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
          <div className="glass-card p-8 sm:p-12 rounded-[2.5rem] border-luxury-gold/20 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
              Something Went Wrong
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
              We apologize for the inconvenience. The Atelier has encountered an unexpected issue.
            </p>
            {this.state.error && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-8 text-left overflow-auto">
                <code className="text-xs text-red-400 font-mono">{this.state.error.message}</code>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-luxury-gold text-black rounded-2xl font-black text-lg hover:bg-luxury-pink hover:text-white transition-all shadow-2xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Return to Atelier
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
