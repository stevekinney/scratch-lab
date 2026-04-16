import type { NoteStorage } from './storage';
import { LocalNoteStorage } from './storage';
import { ApiNoteStorage } from './api-storage';

export function createStorage(): NoteStorage {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return new ApiNoteStorage(apiUrl);
  }
  return new LocalNoteStorage();
}
