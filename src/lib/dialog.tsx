import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DialogRequest {
  id: number;
  kind: 'confirm' | 'alert';
  message: string;
  danger: boolean;
  resolve: (ok: boolean) => void;
}

let enqueue: ((req: DialogRequest) => void) | null = null;
let nextId = 1;

/** Site-styled replacement for window.confirm(). Resolves to true when the user confirms. */
export function confirmDialog(message: string, opts: { danger?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (!enqueue) return resolve(window.confirm(message));
    enqueue({ id: nextId++, kind: 'confirm', message, danger: opts.danger ?? true, resolve });
  });
}

/** Site-styled replacement for window.alert(). */
export function alertDialog(message: string): Promise<void> {
  return new Promise((resolve) => {
    if (!enqueue) {
      window.alert(message);
      return resolve();
    }
    enqueue({ id: nextId++, kind: 'alert', message, danger: false, resolve: () => resolve() });
  });
}

const LABELS = {
  ar: { confirm: 'تأكيد', cancel: 'إلغاء', ok: 'حسناً', confirmTitle: 'تأكيد الإجراء', alertTitle: 'تنبيه' },
  tr: { confirm: 'Onayla', cancel: 'Vazgeç', ok: 'Tamam', confirmTitle: 'İşlemi onayla', alertTitle: 'Bilgi' },
  en: { confirm: 'Confirm', cancel: 'Cancel', ok: 'OK', confirmTitle: 'Confirm action', alertTitle: 'Notice' },
} as const;

/** Mount once near the root of the app. */
export function DialogHost() {
  const [queue, setQueue] = useState<DialogRequest[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const okRef = useRef<HTMLButtonElement>(null);
  const current = queue[0];

  useEffect(() => {
    enqueue = (req) => setQueue((q) => [...q, req]);
    return () => {
      enqueue = null;
    };
  }, []);

  const close = (ok: boolean) => {
    if (!current) return;
    current.resolve(ok);
    setQueue((q) => q.slice(1));
  };

  useEffect(() => {
    if (!current) return;
    // Destructive actions start on "Cancel" so a stray Enter cannot delete anything.
    (current.kind === 'confirm' && current.danger ? cancelRef : okRef).current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current?.id]);

  if (!current) return null;

  const lang = (document.documentElement.lang as keyof typeof LABELS) in LABELS
    ? (document.documentElement.lang as keyof typeof LABELS)
    : 'ar';
  const t = LABELS[lang];
  const isConfirm = current.kind === 'confirm';
  const danger = isConfirm && current.danger;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      onMouseDown={(e) => e.target === e.currentTarget && close(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#C8B273]/40 overflow-hidden animate-fade-in">
        <div className="bg-[#163A4A] px-5 py-3 border-b-2 border-[#C8B273] flex items-center gap-3">
          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${danger ? 'bg-red-500/20 text-red-300' : 'bg-[#C8B273]/20 text-[#C8B273]'}`}>
            {danger ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          </span>
          <h2 className="text-sm font-bold text-white">{isConfirm ? t.confirmTitle : t.alertTitle}</h2>
        </div>
        <p className="px-5 py-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line">{current.message}</p>
        <div className="px-5 pb-5 flex gap-2 justify-end">
          {isConfirm && (
            <button
              ref={cancelRef}
              type="button"
              onClick={() => close(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8B273]"
            >
              {t.cancel}
            </button>
          )}
          <button
            ref={okRef}
            type="button"
            onClick={() => close(true)}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8B273] ${
              danger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#163A4A] text-[#C8B273] hover:bg-[#24495D]'
            }`}
          >
            {isConfirm ? t.confirm : t.ok}
          </button>
        </div>
      </div>
    </div>
  );
}
