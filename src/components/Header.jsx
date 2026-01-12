export default function Header({ onAdd }) {
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
