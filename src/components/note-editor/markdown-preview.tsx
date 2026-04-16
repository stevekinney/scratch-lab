import { renderMarkdown } from '../../utilities/markdown';

interface MarkdownPreviewProps {
  source: string;
  onEdit: () => void;
}

export function MarkdownPreview({ source, onEdit }: MarkdownPreviewProps) {
  if (!source.trim()) {
    return (
      <button
        onClick={onEdit}
        className="flex h-full w-full cursor-text items-start p-0 text-left text-sm text-gray-400"
      >
        Start writing…
      </button>
    );
  }

  return (
    <div
      role="document"
      aria-label="Note preview"
      className="prose prose-sm max-w-none cursor-text text-gray-800"
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEdit();
        }
      }}
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }}
    />
  );
}
