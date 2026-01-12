export default function EntryCard({ entry, onClick }) {
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
