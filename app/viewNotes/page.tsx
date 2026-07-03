"use client";

import { useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "planner-notes";

const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "Weekly reflection",
    content: "Capture wins, blockers, and what should be improved next week.",
    createdAt: "2026-07-01",
  },
  {
    id: "note-2",
    title: "Meeting summary",
    content: "Write down decisions, action items, and owners after each meeting.",
    createdAt: "2026-07-02",
  },
];

export default function ViewNotesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setNotes(data as Note[]);
      })
      .catch(() => {
        // keep initial notes on error
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const noteCount = useMemo(() => notes.length, [notes]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) return;

    setLoading(true);
    fetch("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: trimmedTitle, content: trimmedContent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) setNotes((current) => [data as Note, ...current]);
      })
      .catch(() => {
        // noop
      })
      .finally(() => {
        setLoading(false);
        setTitle("");
        setContent("");
      });
  };

  return (
    <main className="notes-page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Notebook</p>
          <h1>Capture ideas and keep your notes organized.</h1>
          <p className="hero-copy">
            Create quick notes for meetings, plans, or inspiration and keep them nearby while you work.
          </p>
        </div>
        <div className="hero-stats" aria-label="notes summary">
          <div>
            <strong>{noteCount}</strong>
            <span>Total notes</span>
          </div>
          <div>
            <strong>{loading ? "…" : "Ready"}</strong>
            <span>Sync status</span>
          </div>
        </div>
      </section>

      <section className="note-grid">
        <form className="panel note-form" onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">New note</p>
              <h2>Add a note</h2>
            </div>
          </div>

          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Project idea"
              required
            />
          </label>

          <label>
            Content
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={6}
              placeholder="Write your note here"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save note"}
          </button>
        </form>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Recent notes</p>
              <h2>Your notes</h2>
            </div>
          </div>

          <div className="note-list">
            {notes.length === 0 ? (
              <div className="empty-state">No notes yet. Add the first one to get started.</div>
            ) : (
              notes.map((note) => (
                <article key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="due-date">Created {note.createdAt}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
