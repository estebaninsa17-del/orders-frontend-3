import React from "react";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { X, PackageOpen, Info, CheckCircle2 } from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  { id: 1, title: "Nuevo pedido recibido", desc: "Pedido #1042 desde Colombia", time: "Hace 10 min", unread: true, type: "info" },
  { id: 2, title: "Producto sin stock", desc: "Wireless Headphones agostado", time: "Hace 1 hora", unread: true, type: "warning" },
  { id: 3, title: "Pago verificado", desc: "Pago exitoso del pedido #1039", time: "Hace 2 horas", unread: false, type: "success" },
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  return (
    <SidebarComponent
      id="notification-sidebar"
      position="Right"
      type="Over"
      isOpen={isOpen}
      showBackdrop={true}
      closeOnDocumentClick={true}
      width="340px"
      className="bg-navy-800 border-l border-navy-700 p-0 shadow-2xl! z-[100]!"
    >
      <div className="flex flex-col h-full bg-navy-800 text-text-primary">
        <div className="flex items-center justify-between p-4 border-b border-navy-700">
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-navy-700 transition"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2">
          {mockNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-3 mb-2 rounded-lg border border-transparent hover:border-navy-600 hover:bg-navy-700/50 cursor-pointer transition-all flex gap-3 ${notif.unread ? "bg-navy-700/30" : ""}`}
            >
              <div className="mt-1">
                {notif.type === "info" && <Info size={16} className="text-accent-blue" />}
                {notif.type === "warning" && <PackageOpen size={16} className="text-orange-400" />}
                {notif.type === "success" && <CheckCircle2 size={16} className="text-emerald-400" />}
              </div>
              <div>
                <p className={`text-sm ${notif.unread ? "font-semibold text-white" : "text-text-primary"}`}>{notif.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{notif.desc}</p>
                <p className="text-[10px] text-navy-500 mt-2 font-medium">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-navy-700">
          <button className="w-full py-2 text-sm text-accent-blue hover:bg-accent-blue/10 font-medium rounded-lg transition">
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </SidebarComponent>
  );
}
