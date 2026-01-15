'use client';

import ErrorMessage from '../components/ui/ErrorMessage';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorMessage
        title="Application Error"
        message={error.message || 'An unexpected error occurred'}
        retry={reset}
      />
    </div>
  );
}