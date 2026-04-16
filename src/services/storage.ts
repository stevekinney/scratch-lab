import type { Note } from '../types/note';

export interface NoteStorage {
  getAll(options?: { search?: string }): Promise<Note[]>;
  getById(id: string): Promise<Note | undefined>;
  create(note: Note): Promise<Note>;
  update(note: Note): Promise<Note>;
  remove(id: string): Promise<void>;
}

export class LocalNoteStorage implements NoteStorage {
  private readonly key = 'notepad:notes';

  private readAll(): Note[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  private writeAll(notes: Note[]): void {
    localStorage.setItem(this.key, JSON.stringify(notes));
  }

  async getAll(options?: { search?: string }): Promise<Note[]> {
    const notes = this.readAll();
    const query = options?.search?.toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query),
    );
  }

  async getById(id: string): Promise<Note | undefined> {
    return this.readAll().find((n) => n.id === id);
  }

  async create(note: Note): Promise<Note> {
    const notes = this.readAll();
    notes.unshift(note);
    this.writeAll(notes);
    return note;
  }

  async update(note: Note): Promise<Note> {
    const notes = this.readAll();
    const index = notes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
      this.writeAll(notes);
    }
    return note;
  }

  async remove(id: string): Promise<void> {
    const notes = this.readAll().filter((n) => n.id !== id);
    this.writeAll(notes);
  }
}
