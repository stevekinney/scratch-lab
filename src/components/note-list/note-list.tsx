import { useRef } from 'react';
import type { Note } from '../../types/note';
import { NoteListItem } from './note-list-item';

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  searchQuery: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export function NoteList({ notes, selectedId, searchQuery, onSelect, onCreate, onDelete, onSearch }: NoteListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!listRef.current) return;
    const items = Array.from(listRef.current.querySelectorAll<HTMLElement>('[role="option"]'));
    const currentIndex = items.findIndex((el) => el === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[currentIndex + 1];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[currentIndex - 1];
      prev?.focus();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (selectedId) {
        e.preventDefault();
        onDelete(selectedId);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Notes</h1>
        <button
          onClick={onCreate}
          aria-label="Create new note"
          className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New
        </button>
      </header>

      <div className="border-b border-gray-200 px-4 py-2">
        <input
          type="search"
          placeholder="Search notes…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search notes"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-sm text-gray-400">No notes yet</p>
        </div>
      ) : (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Notes"
          className="flex-1 overflow-y-auto"
          onKeyDown={handleKeyDown}
        >
          {notes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              isSelected={note.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
