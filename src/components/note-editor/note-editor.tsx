import { useState, useRef, useEffect } from 'react';
import type { Note } from '../../types/note';
import { useDebounce } from '../../hooks/use-debounce';
import { MarkdownPreview } from './markdown-preview';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, changes: Partial<Pick<Note, 'title' | 'body'>>) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
  isNew?: boolean;
}

export function NoteEditor({ note, onUpdate, onDelete, onBack, isNew }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const debouncedUpdate = useDebounce(
    (changes: Partial<Pick<Note, 'title' | 'body'>>) => onUpdate(note.id, changes),
    300,
  );

  // Focus title on new note
  useEffect(() => {
    if (isNew) {
      titleRef.current?.focus();
    }
  }, [isNew]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    debouncedUpdate({ title: value });
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    debouncedUpdate({ body: value });
  };

  const startEditing = () => {
    setIsEditing(true);
    requestAnimationFrame(() => bodyRef.current?.focus());
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  return (
    <article className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to notes list"
            className="rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          aria-label="Note title"
          className="flex-1 bg-transparent text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none"
        />
        <button
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          className="rounded p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {isEditing ? (
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            onBlur={stopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                stopEditing();
              }
            }}
            aria-label="Note content"
            placeholder="Start writing…"
            className="h-full w-full resize-none bg-transparent font-mono text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        ) : (
          <MarkdownPreview source={body} onEdit={startEditing} />
        )}
      </div>
    </article>
  );
}
