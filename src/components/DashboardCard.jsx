import React from 'react';
import { formatCurrency } from '../utils/calculations';

export const DashboardCard = ({
  title,
  amount,
  count,
  countLabel = 'records',
  icon: Icon,
  variant = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate'
  subtitle,
  onClick,
}) => {
  const variantStyles = {
    indigo: {
      border: 'border-red-100 hover:border-red-300',
      iconBg: 'bg-red-50 text-red-700 border border-red-100',
      textAccent: 'text-red-700',
      pill: 'bg-red-50 text-red-800',
    },
    emerald: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      textAccent: 'text-emerald-700',
      pill: 'bg-emerald-50 text-emerald-800',
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-100',
      textAccent: 'text-amber-700',
      pill: 'bg-amber-50 text-amber-800',
    },
    rose: {
      border: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-100',
      textAccent: 'text-rose-700',
      pill: 'bg-rose-50 text-rose-800',
    },
    slate: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      textAccent: 'text-slate-700',
      pill: 'bg-slate-100 text-slate-800',
    },
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 bg-white border ${style.border} shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-mono">
            {amount !== undefined ? formatCurrency(amount) : count}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl shrink-0 ${style.iconBg} shadow-2xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {subtitle || (
            <>
              <strong className="text-slate-900 font-mono font-bold">{count !== undefined ? count : 0}</strong>{' '}
              {countLabel}
            </>
          )}
        </span>
        {amount !== undefined && (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${style.pill}`}>
            {variant === 'emerald' ? 'Collected' : variant === 'amber' ? 'Pending' : variant === 'rose' ? 'Waived' : 'Recorded'}
          </span>
        )}
      </div>
    </div>
  );
};
