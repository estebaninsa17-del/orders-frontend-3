import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  colorClass?: string;
  isLoading?: boolean;
}

export default function KpiCard({ title, value, icon: Icon, trend, colorClass = "text-accent-blue", isLoading }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="premium-card h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-24 h-4 bg-navy-700/50 rounded skeleton-pulse"></div>
          <div className="w-8 h-8 bg-navy-700/50 rounded-lg skeleton-pulse"></div>
        </div>
        <div className="w-32 h-8 bg-navy-700/50 rounded mt-4 skeleton-pulse"></div>
      </div>
    );
  }

  return (
    <div className="premium-card flex flex-col justify-between group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <div className={`p-2 rounded-lg bg-navy-900/50 shadow-inner group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-text-primary tracking-tight">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </p>
        )}
      </div>
    </div>
  );
}
