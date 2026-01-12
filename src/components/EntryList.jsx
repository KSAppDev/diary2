import EntryCard from "./EntryCard";

export default function EntryList({ entries, onSelect }) {
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
