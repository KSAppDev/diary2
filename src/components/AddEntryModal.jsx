import { useState } from "react";
import ModalShell from "./ModalShell";

export default function AddEntryModal({ onClose, entries, setEntries }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
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

    if (!title.trim() || !date.trim() || !imageUrl.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

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
      date,
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
