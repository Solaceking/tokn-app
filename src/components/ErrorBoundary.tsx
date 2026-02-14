'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-[#FF9F1C]">
              <AlertTriangle className="w-8 h-8 text-[#FF9F1C]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-[#737373] mb-6">
              An error occurred while rendering this component. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#FF9F1C] text-black font-bold border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}