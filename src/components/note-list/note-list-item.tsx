import type { Note } from '../../types/note';
import { formatRelativeDate } from '../../utilities/dates';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function getPreview(body: string): string {
  const firstLine = body.split('\n').find((line) => line.trim() !== '') || '';
  return firstLine.slice(0, 80) || 'No content';
}

export function NoteListItem({ note, isSelected, onSelect }: NoteListItemProps) {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      className={`cursor-pointer border-b border-gray-100 px-4 py-3 outline-none transition-colors ${
        isSelected
          ? 'bg-blue-50 border-l-2 border-l-blue-500'
          : 'hover:bg-gray-100 focus:bg-gray-100'
      }`}
      onClick={() => onSelect(note.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(note.id);
        }
      }}
    >
      <p className="truncate font-medium text-gray-900 text-sm">
        {note.title || 'Untitled'}
      </p>
      <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
        <time dateTime={note.updatedAt}>{formatRelativeDate(note.updatedAt)}</time>
        <span className="truncate">{getPreview(note.body)}</span>
      </p>
    </li>
  );
}
