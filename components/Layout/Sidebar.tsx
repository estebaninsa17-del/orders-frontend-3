"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, PackageOpen, LayoutTemplate, Menu, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Panel Base", href: "/", icon: LayoutDashboard },
  { name: "Pedidos", href: "/orders", icon: ShoppingCart },
  { name: "Inventario", href: "/products", icon: PackageOpen },
  { name: "Reportes", href: "/reports", icon: LayoutTemplate },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? "80px" : "280px" }}
      className="bg-navy-800 border-r border-navy-700 h-screen sticky top-0 flex flex-col transition-all duration-300 z-50 shrink-0"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-navy-700">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 text-text-primary px-2">
            <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center font-bold">O</div>
            <span className="font-bold text-lg tracking-tight">OrderHQ</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
             <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center font-bold text-text-primary">O</div>
          </div>
        )}
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-accent-blue/10 text-accent-blue" 
                  : "text-text-secondary hover:bg-navy-700 hover:text-text-primary"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.name : ""}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-navy-700 flex justify-center">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-text-secondary hover:bg-navy-700 hover:text-text-primary transition-colors flex justify-center items-center w-full"
        >
          {collapsed ? <Menu size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20}/><span className="text-sm font-medium text-center">Colapsar</span></div>}
        </button>
      </div>
    </motion.aside>
  );
}
