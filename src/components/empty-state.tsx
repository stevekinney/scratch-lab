export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-400">No note selected</p>
        <p className="mt-1 text-sm text-gray-400">
          Select a note from the list or create a new one
        </p>
      </div>
    </div>
  );
}
