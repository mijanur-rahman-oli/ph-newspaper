import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please try again.',
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
      )}
    </div>
  );
}