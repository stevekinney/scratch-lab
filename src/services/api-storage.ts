import type { Note } from '../types/note';
import type { NoteStorage } from './storage';
import { getUserId } from './user';

export class ApiNoteStorage implements NoteStorage {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private headers(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-notepad-user-id': getUserId(),
    };
  }

  async getAll(options?: { search?: string }): Promise<Note[]> {
    const url = new URL(`${this.baseUrl}/notes`);
    if (options?.search) {
      url.searchParams.set('search', options.search);
    }
    const response = await fetch(url, { headers: this.headers() });
    if (!response.ok) throw new Error(`Failed to fetch notes: ${response.status}`);
    return response.json();
  }

  async getById(id: string): Promise<Note | undefined> {
    const response = await fetch(`${this.baseUrl}/notes/${id}`, { headers: this.headers() });
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`Failed to fetch note: ${response.status}`);
    return response.json();
  }

  async create(note: Note): Promise<Note> {
    const response = await fetch(`${this.baseUrl}/notes`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(note),
    });
    if (!response.ok) throw new Error(`Failed to create note: ${response.status}`);
    return response.json();
  }

  async update(note: Note): Promise<Note> {
    const response = await fetch(`${this.baseUrl}/notes/${note.id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(note),
    });
    if (!response.ok) throw new Error(`Failed to update note: ${response.status}`);
    return response.json();
  }

  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/notes/${id}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    if (!response.ok) throw new Error(`Failed to delete note: ${response.status}`);
  }
}
