import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      let displayDetail = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage) as { error?: string; path?: string };
        if (parsed.error) {
          displayDetail = `${parsed.error}${parsed.path ? ` (${parsed.path})` : ''}`;
        }
      } catch {
        // Not JSON, keep raw message
      }

      return (
        <div className="min-h-screen bg-[#EAE4DA] text-[#30312E] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#F4F0E9] border border-[#D2CCC1] p-8 space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#99958D]">
              Atelier Notice
            </p>
            <h1 className="font-serif text-3xl font-medium">
              Unable to load this lookbook view.
            </h1>
            <p className="text-sm text-[#30312E]/80 leading-relaxed break-words">
              {displayDetail}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.16em] hover:bg-[#414642] transition-colors"
            >
              Reload Showroom
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
