import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import EntryList from "./components/EntryList";
import AddEntryModal from "./components/AddEntryModal";
import ViewEntryModal from "./components/ViewEntryModal";

const STORAGE_KEY = "diaryEntries";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setEntries(Array.isArray(parsed) ? parsed : []);
    } catch {
      setEntries([]);
    }
  }, []);

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
