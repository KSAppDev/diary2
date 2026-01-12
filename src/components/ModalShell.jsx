export default function ModalShell({ children, onClose }) {
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
