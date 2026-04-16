import { useState, useCallback, useEffect } from 'react';
import type { Note } from '../types/note';
import { createStorage } from '../services/create-storage';
import { createId } from '../utilities/identifiers';

const storage = createStorage();

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedNote = selectedId ? notes.find((n) => n.id === selectedId) : undefined;

  const refresh = useCallback(async (options?: { search?: string }) => {
    try {
      const result = await storage.getAll(options);
      setNotes(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notes');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    storage.getAll().then((result) => {
      if (cancelled) return;
      setNotes(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const createNote = useCallback(async (): Promise<Note> => {
    const now = new Date().toISOString();
    const note: Note = {
      id: createId(),
      title: '',
      body: '',
      createdAt: now,
      updatedAt: now,
    };
    const created = await storage.create(note);
    await refresh();
    setSelectedId(created.id);
    return created;
  }, [refresh]);

  const updateNote = useCallback(
    async (id: string, changes: Partial<Pick<Note, 'title' | 'body'>>) => {
      const existing = await storage.getById(id);
      if (!existing) return;
      const updated: Note = {
        ...existing,
        ...changes,
        updatedAt: new Date().toISOString(),
      };
      await storage.update(updated);
      await refresh();
    },
    [refresh],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await storage.remove(id);
      if (selectedId === id) setSelectedId(null);
      await refresh();
    },
    [selectedId, refresh],
  );

  const selectNote = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  return { notes, selectedNote, loading, error, createNote, updateNote, deleteNote, selectNote, refresh };
}
