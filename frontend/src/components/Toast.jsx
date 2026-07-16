import { CheckCircle, XCircle, X } from 'lucide-react';

export const ToastItem = ({ id, message, type, onDismiss }) => (
  <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`}>
    {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
    <span>{message}</span>
    <button onClick={() => onDismiss(id)} className="ml-2 hover:opacity-75">
      <X size={16} />
    </button>
  </div>
);

export const ToastContainer = ({ toasts, onDismiss }) => (
  <>
    {toasts.map((t) => (
      <ToastItem key={t.id} {...t} onDismiss={onDismiss} />
    ))}
  </>
);
