import ModalShell from "./ModalShell";

export default function ViewEntryModal({ entry, onClose }) {
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
