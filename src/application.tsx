import { useEffect, useCallback, useState } from 'react';
import { useRouter } from './hooks/use-router';
import { useNotes } from './hooks/use-notes';
import { useMediaQuery } from './hooks/use-media-query';
import { useDebounce } from './hooks/use-debounce';
import { MasterDetailLayout } from './components/layout/master-detail-layout';
import { NoteList } from './components/note-list/note-list';
import { NoteEditor } from './components/note-editor/note-editor';
import { EmptyState } from './components/empty-state';
import { NotFound } from './components/not-found';
import { PromoBanner } from './components/promo-banner';

export default function Application() {
  const { path, noteId, navigate } = useRouter();
  const { notes, selectedNote, loading, createNote, updateNote, deleteNote, selectNote, refresh } =
    useNotes();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isNewNote, setIsNewNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedRefresh = useDebounce(
    (query: string) => refresh({ search: query || undefined }),
    300,
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedRefresh(query);
    },
    [debouncedRefresh],
  );

  // Sync router → state
  useEffect(() => {
    selectNote(noteId);
  }, [noteId, selectNote]);

  const handleSelect = useCallback(
    (id: string) => {
      setIsNewNote(false);
      navigate(`/notes/${id}`);
    },
    [navigate],
  );

  const handleCreate = useCallback(async () => {
    const note = await createNote();
    setIsNewNote(true);
    navigate(`/notes/${note.id}`);
  }, [createNote, navigate]);

  const handleDelete = useCallback(
    async (id: string) => {
      const index = notes.findIndex((n) => n.id === id);
      const remaining = notes.filter((n) => n.id !== id);
      await deleteNote(id);
      if (remaining.length > 0) {
        const nextIndex = Math.min(index, remaining.length - 1);
        navigate(`/notes/${remaining[nextIndex].id}`);
      } else {
        navigate('/');
      }
    },
    [notes, deleteNote, navigate],
  );

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Keyboard shortcut: Cmd+N to create a new note
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleCreate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleCreate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  const sidebar = (
    <NoteList
      notes={notes}
      selectedId={noteId}
      searchQuery={searchQuery}
      onSelect={handleSelect}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onSearch={handleSearch}
    />
  );

  const noteNotFound = noteId !== null && !selectedNote && !searchQuery;

  const detail = selectedNote ? (
    <NoteEditor
      key={selectedNote.id}
      note={selectedNote}
      onUpdate={updateNote}
      onDelete={handleDelete}
      onBack={isDesktop ? undefined : handleBack}
      isNew={isNewNote}
    />
  ) : noteNotFound ? (
    <NotFound
      heading="Note not found"
      message="This note may have been deleted."
      onNavigateHome={() => navigate('/')}
    />
  ) : (
    <EmptyState />
  );

  if (path === '/not-found') {
    return (
      <div className="h-screen">
        <NotFound onNavigateHome={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <PromoBanner />
      <div className="min-h-0 flex-1">
        <MasterDetailLayout
          sidebar={sidebar}
          detail={detail}
          showDetail={noteId !== null}
          isDesktop={isDesktop}
        />
      </div>
    </div>
  );
}
