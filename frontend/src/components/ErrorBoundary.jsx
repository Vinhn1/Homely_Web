import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Có thể log lên Sentry / LogRocket ở đây
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-10 max-w-lg w-full text-center border border-slate-100">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
              <AlertTriangle size={36} className="text-red-500" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Oops! Có lỗi xảy ra
            </h1>
            <p className="text-slate-500 text-sm mb-2 font-medium">
              Trang này gặp lỗi không mong muốn. Hãy thử tải lại hoặc quay về trang chủ.
            </p>

            {/* Error detail (collapsed) */}
            {this.state.error && (
              <details className="text-left bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-8 cursor-pointer">
                <summary className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Chi tiết lỗi
                </summary>
                <pre className="text-xs text-red-500 mt-2 whitespace-pre-wrap break-all font-mono">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm"
              >
                <RefreshCcw size={16} /> Thử lại
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all text-sm"
              >
                <Home size={16} /> Về trang chủ
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
