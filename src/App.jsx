import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "diaryEntries";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Load entries on startup
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setEntries(Array.isArray(parsed) ? parsed : []);
    } catch {
      setEntries([]);
    }
  }, []);

  // Persist entries
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.date.localeCompare(a.date));
  }, [entries]);

  function openView(entry) {
    setSelectedEntry(entry);
    setIsViewOpen(true);
  }

  function closeView() {
    setIsViewOpen(false);
    setSelectedEntry(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header onAdd={() => setIsAddOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <EntryList entries={sortedEntries} onSelect={openView} />
      </main>

      {isAddOpen && (
        <AddEntryModal
          onClose={() => setIsAddOpen(false)}
          entries={entries}
          setEntries={setEntries}
        />
      )}

      {isViewOpen && selectedEntry && (
        <ViewEntryModal entry={selectedEntry} onClose={closeView} />
      )}
    </div>
  );
}

function Header({ onAdd }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="font-semibold tracking-tight">Personal Diary</div>
        <button
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
        >
          Add Entry
        </button>
      </div>
    </header>
  );
}

function EntryList({ entries, onSelect }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center">
        <p className="text-lg font-semibold">No entries yet</p>
        <p className="mt-2 text-slate-400">
          Click “Add Entry” to create your first diary entry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onClick={() => onSelect(entry)}
        />
      ))}
    </div>
  );
}

function EntryCard({ entry, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 text-left hover:border-slate-700"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={entry.imageUrl}
          alt={entry.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="text-xs text-slate-400">{entry.date}</div>
        <div className="mt-1 line-clamp-1 text-base font-semibold">
          {entry.title}
        </div>
      </div>
    </button>
  );
}

// Placeholder: implemented in PR4/PR5
function ViewEntryModal({ entry, onClose }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="space-y-3">
        <div className="text-xs text-slate-400">{entry.date}</div>
        <h2 className="text-xl font-semibold">{entry.title}</h2>
        <img
          src={entry.imageUrl}
          alt={entry.title}
          className="w-full rounded-lg object-cover"
        />
        <p className="whitespace-pre-wrap text-slate-200">{entry.content}</p>
      </div>
    </ModalShell>
  );
}

function AddEntryModal({ onClose, entries, setEntries }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD from input[type="date"]
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setTitle("");
    setDate("");
    setImageUrl("");
    setContent("");
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // FR010: all fields required
    if (!title.trim() || !date.trim() || !imageUrl.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // FR009: one-entry-per-day check
    const existsForDay = entries.some((en) => en.date === date);
    if (existsForDay) {
      setError(
        "An entry for this day already exists. Please come back tomorrow."
      );
      return;
    }

    const newEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: title.trim(),
      date, // already YYYY-MM-DD
      imageUrl: imageUrl.trim(),
      content: content.trim(),
      createdAt: Date.now(),
    };

    setEntries((prev) => [...prev, newEntry]);

    resetForm();
    onClose();
  }

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-xl font-semibold">Add New Entry</h2>
      <p className="mt-1 text-sm text-slate-400">
        Title, date, image URL, and content are required.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-700/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-slate-600"
            placeholder="e.g., A productive day"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-slate-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-slate-600"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-slate-600"
            placeholder="Write your diary entry..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
          >
            Save Entry
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="button"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-slate-300 hover:bg-slate-900"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
