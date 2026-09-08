import React from 'react';
import { formatCurrency } from '../utils/calculations';

export const DashboardCard = ({
  title,
  amount,
  count,
  countLabel = 'records',
  icon: Icon,
  variant = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'treasury'
  subtitle,
  badgeText,
  onClick,
}) => {
  const variantStyles = {
    indigo: {
      border: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-100',
      textAccent: 'text-blue-700',
      pill: 'bg-blue-50 text-blue-800 border border-blue-200',
      defaultBadge: 'Recorded',
    },
    emerald: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      textAccent: 'text-emerald-700',
      pill: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      defaultBadge: 'Collected',
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-100',
      textAccent: 'text-amber-700',
      pill: 'bg-amber-50 text-amber-800 border border-amber-200',
      defaultBadge: 'Pending',
    },
    rose: {
      border: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-100',
      textAccent: 'text-rose-700',
      pill: 'bg-rose-50 text-rose-800 border border-rose-200',
      defaultBadge: 'Spent',
    },
    slate: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      textAccent: 'text-slate-700',
      pill: 'bg-slate-100 text-slate-800 border border-slate-200',
      defaultBadge: 'Waived',
    },
    treasury: {
      border: 'border-amber-200/80 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      textAccent: 'text-amber-700',
      pill: 'bg-amber-50 text-amber-800 border border-amber-200',
      defaultBadge: 'In Hand',
    },
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-4 sm:p-4.5 bg-white border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[135px] sm:min-h-[142px] ${style.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate min-w-0">
          {title}
        </p>
        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${style.iconBg} shadow-2xs`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Hero Value */}
      <div className="my-1.5">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-slate-900 truncate">
          {amount !== undefined ? formatCurrency(amount) : count}
        </h3>
      </div>

      {/* Footer Info & Badge */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-1.5">
        <span className="font-medium text-[11px] text-slate-600 truncate min-w-0">
          {subtitle || (
            <>
              <strong className="font-mono font-semibold text-slate-900">
                {count !== undefined ? count : 0}
              </strong>{' '}
              {countLabel}
            </>
          )}
        </span>
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${style.pill}`}>
          {badgeText || style.defaultBadge}
        </span>
      </div>
    </div>
  );
};
