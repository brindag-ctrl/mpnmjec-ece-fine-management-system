import React from 'react';
import { AlertTriangle, Trash2, XCircle, CheckCircle } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'success'
  loading = false,
}) => {
  if (!isOpen) return null;

  const styles = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    },
  };

  const currentStyle = styles[type] || styles.danger;
  const Icon = currentStyle.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border shrink-0 ${currentStyle.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 ${currentStyle.btn}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
