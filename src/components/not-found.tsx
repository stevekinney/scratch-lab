interface NotFoundProps {
  heading?: string;
  message?: string;
  onNavigateHome: () => void;
}

export function NotFound({
  heading = 'Page not found',
  message,
  onNavigateHome,
}: NotFoundProps) {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50 p-8">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-300">404</p>
        <p className="mt-2 text-lg font-medium text-gray-500">{heading}</p>
        {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}
        <button
          onClick={onNavigateHome}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Notes
        </button>
      </div>
    </div>
  );
}
