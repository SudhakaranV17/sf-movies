// shared/components/ErrorBoundary/index.tsx
import React, { type ErrorInfo } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

// ─── Type Guard ────────────────────────────────────────────────────────────────
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error occurred";
};

// ─── Fallback UI ───────────────────────────────────────────────────────────────
const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const handleReload = () => window.location.reload();
  const handleGoHome = () => (window.location.href = "/");

  return (
    <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 p-6 text-white">
          <h1 className="font-bold text-2xl">Something went wrong</h1>
          <p className="mt-1 text-red-100 text-sm">
            An unexpected error occurred
          </p>
        </div>

        {/* Error Message */}
        <div className="space-y-4 p-6">
          <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
            <code className="text-red-700 text-sm wrap-break-word">
              {getErrorMessage(error)}
            </code>
          </div>

          {/* Additional Info */}
          <div className="space-y-2 bg-gray-50 p-4 border border-gray-200 rounded-lg text-gray-600 text-sm">
            <div className="flex gap-2">
              <span className="min-w-16 font-medium text-gray-800">URL:</span>
              <span className="break-all">{window.location.href}</span>
            </div>
            <div className="flex gap-2">
              <span className="min-w-16 font-medium text-gray-800">Time:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={resetErrorBoundary}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
            >
              <i className="pi pi-refresh" />
              Try Again
            </button>

            <button
              onClick={handleReload}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
            >
              <i className="pi pi-sync" />
              Reload
            </button>

            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
            >
              <i className="pi pi-home" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Error Boundary Wrapper ────────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  onError,
}) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error("ErrorBoundary caught:", error, errorInfo);
    if (onError) onError(error, errorInfo);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError as any}
      onReset={() => console.log("ErrorBoundary reset")}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
