import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Point to Flask backend (Vite proxy handles /notes in dev)
const API = "";

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Toast({ message, type }) {
  const icon = type === "success" ? "✓" : "✕";
  return (
    <div className={`toast ${type}`} role="alert">
      <span>{icon}</span>
      {message}
    </div>
  );
}

function NoteCard({ note, onDelete, deleting }) {
  return (
    <div className="note-card" role="listitem">
      <div className="note-icon">📝</div>
      <div className="note-content">
        <p className="note-text">{note.text}</p>
        <p className="note-time">{formatDate(note.created_at)}</p>
      </div>
      <button
        id={`delete-note-${note.id}`}
        className="delete-btn"
        onClick={() => onDelete(note.id)}
        disabled={deleting === note.id}
        aria-label={`Delete note: ${note.text}`}
        title="Delete note"
      >
        {deleting === note.id ? <span className="spinner" /> : "✕"}
      </button>
    </div>
  );
}

export default function App() {
  const [notes, setNotes]       = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [deleting, setDeleting] = useState(null); // note id being deleted
  const [error, setError]       = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
      setError(null);
    } catch {
      setError("⚠️  Can't reach the backend. Is Flask running on port 5000?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async () => {
    if (!text.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(`${API}/notes`, { text: text.trim() });
      setNotes((prev) => [res.data, ...prev]);
      setText("");
      showToast("Note added successfully ✨");
    } catch {
      showToast("Failed to add note. Try again.", "error");
    } finally {
      setAdding(false);
    }
  };

  const deleteNote = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`${API}/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      showToast("Note deleted.");
    } catch {
      showToast("Failed to delete note.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-badge">✦ Powered by React + Flask</div>
        <h1>NotesAI</h1>
        <p>Capture your thoughts — fast, clean, and beautiful.</p>
      </header>

      <main className="main-container" role="main">
        {/* Input Card */}
        <div className="input-card">
          <label htmlFor="note-input">New Note</label>
          <div className="input-row">
            <input
              id="note-input"
              className="note-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write something brilliant… (Enter to save)"
              autoComplete="off"
              aria-label="Note text input"
              maxLength={500}
            />
            <button
              id="add-note-btn"
              className="add-btn"
              onClick={addNote}
              disabled={!text.trim() || adding}
              aria-label="Add note"
            >
              {adding ? <span className="spinner" /> : "+"}
              {adding ? "Adding…" : "Add Note"}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {!loading && !error && (
          <div className="stats-bar">
            <p className="stats-count">
              <span>{notes.length}</span> {notes.length === 1 ? "note" : "notes"} saved
            </p>
            {notes.length > 0 && (
              <button
                id="clear-all-btn"
                className="clear-btn"
                onClick={() => {
                  if (window.confirm("Delete all notes?")) {
                    Promise.all(notes.map((n) => axios.delete(`${API}/notes/${n.id}`)))
                      .then(() => { setNotes([]); showToast("All notes cleared."); })
                      .catch(() => showToast("Failed to clear all.", "error"));
                  }
                }}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Content area */}
        {loading && (
          <p className="status-message loading">Loading your notes…</p>
        )}

        {error && (
          <div className="status-message error">{error}</div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🗒️</span>
            <h3>No notes yet</h3>
            <p>Type something above and press Enter or click Add Note.</p>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <div className="notes-list" role="list" aria-label="Notes list">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                deleting={deleting}
              />
            ))}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
