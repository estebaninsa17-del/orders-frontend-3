import React from "react";
import { Search, Bell } from "lucide-react";

interface TopbarProps {
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export default function Topbar({ onOpenNotifications, unreadCount = 3 }: TopbarProps) {
  return (
    <header className="h-16 border-b border-navy-700 bg-navy-800/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Buscar pedidos, productos..." 
            className="w-full bg-navy-900 border border-navy-700 rounded-full py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-navy-700 rounded-full transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-navy-800"></span>
          )}
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-blue p-[2px]">
          <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center">
            <span className="text-xs font-bold text-text-primary">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
