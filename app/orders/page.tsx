"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  GridComponent, ColumnsDirective, ColumnDirective, Page, Filter, Sort, Inject, Toolbar, 
  PdfExport, ExcelExport
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { getOrders, deleteOrder, patchOrderState, createOrder } from "../../services/api";
import { Plus, Eye, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const gridRef = useRef<GridComponent | null>(null);
  const toastRef = useRef<ToastComponent | null>(null);

  const statusOptions = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

  const load = () => {
    setIsLoading(true);
    getOrders().then((d) => {
      setOrders(d || []);
      setIsLoading(false);
    }).catch(e => {
       setIsLoading(false);
       showToast("Error", "No se pudieron cargar los pedidos.", "e-toast-danger");
    });
  };

  useEffect(() => { load(); }, []);

  const showToast = (title: string, content: string, cssClass = "e-toast-success") => {
    if (toastRef.current) {
      toastRef.current.show({ title, content, cssClass, position: { X: 'Right', Y: 'Top' } });
    }
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      await deleteOrder(selectedOrder.id || selectedOrder.orderNumber); // id from order
      showToast("Éxito", "El pedido fue eliminado correctamente.");
      setIsDeleteModalOpen(false);
      load();
    } catch(e) {
      showToast("Error", "No se pudo eliminar el pedido.", "e-toast-danger");
    }
  };

  const toolbarClick = (args: any) => {
    if (gridRef.current) {
        if (args.item.id === 'orders_grid_pdfexport') gridRef.current.pdfExport();
        else if (args.item.id === 'orders_grid_excelexport') gridRef.current.excelExport();
    }
  };

  const handleStatusChange = async (orderId: any, newStatus: string) => {
    try {
      await patchOrderState(orderId, newStatus);
      showToast("Estado Actualizado", `Pedido ${orderId} cambiado a ${newStatus}`);
      // Actualizamos el estado local sin recargar completo
      setOrders(prev => prev.map(o => o.orderNumber === orderId || o.id === orderId ? { ...o, status: newStatus } : o));
    } catch(e) {
      showToast("Error", `No se pudo actualizar el estado del pedido ${orderId}`, "e-toast-danger");
      load(); // Recargamos para revertir el estado visual
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);
  };

  const statusTemplate = (props: any) => {
    // Para simplificar la edición inline, usamos el dropdown
    // Syncfusion drop down with inline change
    return (
      <div className="status-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
        <DropDownListComponent 
           dataSource={statusOptions} 
           value={props.status} 
           change={(e) => {
             if (e.isInteracted && e.value !== props.status) {
               handleStatusChange(props.id || props.orderNumber, e.value as string);
             }
           }}
           cssClass="e-custom-dark"
           popupHeight="200px"
        />
      </div>
    );
  };

  const customerTemplate = (props: any) => (
    <div className="flex flex-col">
      <span className="font-medium text-text-primary">{props.customer?.firstName} {props.customer?.lastName}</span>
      <span className="text-xs text-text-secondary">{props.customer?.email}</span>
    </div>
  );

  const actionTemplate = (row: any) => (
    <div className="flex gap-3 justify-center">
      <button 
        onClick={() => { setSelectedOrder(row); setIsViewModalOpen(true); }}
        className="text-text-secondary hover:text-accent-blue transition" title="Ver Detalles"
      >
        <Eye size={18} />
      </button>
      <button 
        onClick={() => { setSelectedOrder(row); setIsDeleteModalOpen(true); }}
        className="text-text-secondary hover:text-red-400 transition" title="Eliminar Pedido"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer: "", country: "",  status: "Pending" });
  const [newItems, setNewItems] = useState([{ product: "", quantity: 1, price: 0 }]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => { 
    load(); 
    // Bug 3: Fetch real products
    fetch('https://orders-api-1-j4jm.onrender.com/api/v1/products')
      .then(r => r.json())
      .then(d => setAvailableProducts(Array.isArray(d) ? d : []))
      .catch(e => console.error(e));
  }, []);

  const handleCreateOrder = async () => {
    try {
      if (!newOrder.customer) return showToast("Atención", "El cliente es requerido", "e-toast-warning");
      if (!newItems[0]?.product) return showToast("Atención", "Agrega al menos un producto", "e-toast-warning");
      
      const payload = {
        customer: newOrder.customer,
        country: newOrder.country,
        status: newOrder.status,
        items: newItems
      };
      
      console.log("=== ENVIANDO AL POST /api/v1/orders ===");
      console.log(JSON.stringify(payload, null, 2));
      
      await createOrder(payload);
      showToast("Éxito", "Pedido creado satisfactoriamente", "e-toast-success");
      setIsCreateModalOpen(false);
      load();
    } catch(e: any) {
      showToast("Error al crear la orden", e.message || "Ocurrió un error en el servidor", "e-toast-danger");
    }
  };

  const addOrderItem = () => setNewItems([...newItems, { product: "", quantity: 1, price: 0 }]);
  
  const updateOrderItem = (index: number, field: string, value: any) => {
      const updated = [...newItems];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'product') {
          // Autocomplete price
          const prod = availableProducts.find(p => p.productName === value);
          if (prod) updated[index].price = prod.unitPrice || 0;
      }
      setNewItems(updated);
  };
  
  const removeOrderItem = (index: number) => setNewItems(newItems.filter((_, i) => i !== index));
  
  const newOrderTotal = newItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  // Dentro del return, reemplazamos el boton existente con esto
  // Y luego agregamos el DialogComponent
  return (
    <div className="page-container flex flex-col gap-6 w-full h-full pb-10">
      <ToastComponent ref={toastRef} timeOut={3000} animation={{ show: { effect: "SlideRightIn" }, hide: { effect: "SlideRightOut" } }} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            Panel de Pedidos
          </h1>
          <p className="text-sm text-text-secondary mt-1">Gerecia y rastrea todos tus pedidos globales</p>
        </div>
        
        <button 
           onClick={() => setIsCreateModalOpen(true)}
           className="bg-accent-blue hover:bg-accent-blue-hover text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-accent-blue/20"
        >
          <Plus size={18} /> Nuevo Pedido
        </button>
      </div>

      <div className="premium-card p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
             <div className="h-10 bg-navy-700/50 rounded skeleton-pulse w-full"></div>
             <div className="h-10 bg-navy-700/50 rounded skeleton-pulse w-full"></div>
             <div className="h-10 bg-navy-700/50 rounded skeleton-pulse w-full"></div>
          </div>
        ) : (
          <GridComponent 
            id="orders_grid"
            ref={gridRef}
            dataSource={orders} 
            allowPaging={true} 
            pageSettings={{ pageSize: 12 }}
            allowFiltering={true} 
            filterSettings={{ type: 'Menu' }} // <-- This removes the empty filter row at the top!
            allowSorting={true} 
            allowPdfExport={true}
            allowExcelExport={true}
            toolbar={['Search', 'PdfExport', 'ExcelExport']}
            toolbarClick={toolbarClick}
            className="border-none"
          >
            <ColumnsDirective>
              <ColumnDirective field="orderNumber" headerText="Id Pedido" width="130" isPrimaryKey={true} />
              <ColumnDirective field="orderDate" headerText="Fecha" width="120" format="yMd" textAlign="Left" />
              <ColumnDirective headerText="Cliente" template={customerTemplate} width="180" />
              <ColumnDirective field="customer.country" headerText="País" width="130" />
              <ColumnDirective field="totalAmount" headerText="Total" width="130" format="C2" textAlign="Right" />
              <ColumnDirective field="status" headerText="Estado" template={statusTemplate} width="160" textAlign="Center" />
              <ColumnDirective headerText="Acciones" width="120" template={actionTemplate} textAlign="Center" />
            </ColumnsDirective>
            <Inject services={[Page, Filter, Sort, Toolbar, PdfExport, ExcelExport]} />
          </GridComponent>
        )}
      </div>

      {/* order detail modal container */}
      <DialogComponent
        width="600px"
        isModal={true}
        visible={isViewModalOpen}
        close={() => setIsViewModalOpen(false)}
        header={selectedOrder ? `Detalles del Pedido: ${selectedOrder.orderNumber}` : ""}
        showCloseIcon={true}
        animationSettings={{ effect: 'Zoom' }}
        className="dark-dialog"
      >
        <div className="p-4 text-text-primary">
           {selectedOrder && (
             <div className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Cliente</p>
                   <p className="font-medium">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                   <p className="text-sm text-text-secondary">{selectedOrder.customer?.email}</p>
                   <p className="text-sm text-text-secondary">{selectedOrder.customer?.phone}</p>
                 </div>
                 <div>
                   <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Envío</p>
                   <p className="text-sm">{selectedOrder.customer?.address}</p>
                   <p className="text-sm">{selectedOrder.customer?.city}, {selectedOrder.customer?.country}</p>
                 </div>
               </div>
               
               <div className="mt-4">
                 <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Ítems del Pedido</p>
                 <div className="border border-navy-700 rounded-lg overflow-hidden">
                   <table className="w-full text-sm">
                     <thead className="bg-navy-800 border-b border-navy-700 text-left">
                       <tr>
                         <th className="px-4 py-2 font-medium">Producto</th>
                         <th className="px-4 py-2 font-medium text-center">Cant</th>
                         <th className="px-4 py-2 font-medium text-right">Precio</th>
                         <th className="px-4 py-2 font-medium text-right">Total</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-navy-700 bg-navy-900/50">
                       {selectedOrder.orderItems?.map((item: any) => (
                         <tr key={item.id}>
                           <td className="px-4 py-3">{item.productName || `Producto #${item.productId}`}</td>
                           <td className="px-4 py-3 text-center">{item.quantity}</td>
                           <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                           <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                         </tr>
                       ))}
                     </tbody>
                     <tfoot className="bg-navy-800 border-t border-navy-700">
                       <tr>
                         <td colSpan={3} className="px-4 py-3 text-right font-medium text-text-secondary">Monto Total:</td>
                         <td className="px-4 py-3 text-right font-bold text-accent-blue">{formatCurrency(selectedOrder.totalAmount)}</td>
                       </tr>
                     </tfoot>
                   </table>
                 </div>
               </div>
             </div>
           )}
        </div>
      </DialogComponent>

      {/* modal de eliminación de Syncfusion */}
      <DialogComponent
          width="400px"
          isModal={true}
          visible={isDeleteModalOpen}
          close={() => setIsDeleteModalOpen(false)}
          header="Confirmar Eliminación"
          showCloseIcon={true}
          animationSettings={{ effect: 'Zoom' }}
          className="dark-dialog"
          buttons={[
            {
              click: () => setIsDeleteModalOpen(false),
              buttonModel: { content: 'Cancelar', cssClass: 'e-flat e-primary text-text-primary' }
            },
            {
              click: confirmDelete,
              buttonModel: { content: 'Sí, eliminar', isPrimary: true, cssClass: 'e-danger' }
            }
          ]}
        >
          <div className="p-4 text-text-primary">
            ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
          </div>
        </DialogComponent>

      {/* modal de creación de Syncfusion */}
      <DialogComponent
          width="600px"
          isModal={true}
          visible={isCreateModalOpen}
          close={() => setIsCreateModalOpen(false)}
          header="Crear Nuevo Pedido"
          showCloseIcon={true}
          animationSettings={{ effect: 'Zoom' }}
          className="dark-dialog"
          buttons={[
            {
              click: () => setIsCreateModalOpen(false),
              buttonModel: { content: 'Cancelar', cssClass: 'e-flat e-primary text-text-primary' }
            },
            {
              click: handleCreateOrder,
              buttonModel: { content: 'Guardar Pedido', isPrimary: true, cssClass: 'e-success bg-accent-blue text-white' }
            }
          ]}
        >
          <div className="p-4 text-text-primary flex flex-col gap-4">
             <div>
               <label className="text-sm font-medium mb-1 block">Cliente</label>
               <input className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm focus:border-accent-blue outline-none" value={newOrder.customer} onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})} placeholder="Nombre completo" />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium mb-1 block">País</label>
                 <input className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm focus:border-accent-blue outline-none" value={newOrder.country} onChange={(e) => setNewOrder({...newOrder, country: e.target.value})} placeholder="Ej. Colombia" />
               </div>
               <div>
                 <label className="text-sm font-medium mb-1 block">Estado Inicial</label>
                 <select className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm focus:border-accent-blue outline-none text-white" value={newOrder.status} onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}>
                   <option value="Pending">Pendiente</option>
                   <option value="Processing">Procesando</option>
                   <option value="Shipped">Enviado</option>
                   <option value="Completed">Completado</option>
                 </select>
               </div>
             </div>
             
             <div className="border border-navy-700 rounded p-4 bg-navy-800 flex flex-col gap-3 max-h-[250px] overflow-y-auto overflow-x-hidden">
               <div className="flex justify-between items-center mb-1">
                 <label className="text-sm font-medium">Ítems de la orden</label>
                 <button type="button" onClick={addOrderItem} className="text-xs text-accent-blue font-medium hover:underline flex items-center gap-1">+ Agregar ítem</button>
               </div>
               
               {newItems.map((item, index) => (
                 <div key={index} className="grid grid-cols-12 gap-2 items-center bg-navy-900 p-2 rounded border border-navy-700">
                   <div className="col-span-5" onClick={(e) => e.stopPropagation()}>
                     <DropDownListComponent 
                        dataSource={availableProducts}
                        fields={{ text: 'productName', value: 'productName' }}
                        value={item.product}
                        placeholder="Elegir producto"
                        change={(e) => { if(e.isInteracted) updateOrderItem(index, 'product', e.value) }}
                        cssClass="e-custom-dark border-none"
                     />
                   </div>
                   <input type="number" min="1" className="col-span-2 bg-navy-800 border border-navy-600 rounded px-2 py-1.5 text-xs focus:border-accent-blue outline-none" placeholder="Cant" value={item.quantity} onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 0)} />
                   <input type="number" readOnly className="col-span-2 bg-navy-800/50 border border-navy-600/50 rounded px-2 py-1.5 text-xs text-text-secondary outline-none cursor-not-allowed" placeholder="Precio" value={item.price} />
                   <div className="col-span-2 text-right text-xs font-semibold">{formatCurrency(item.quantity * item.price)}</div>
                   <button type="button" onClick={() => removeOrderItem(index)} className="col-span-1 flex justify-center text-red-400 hover:bg-red-500/20 p-1.5 rounded"><Trash2 size={14}/></button>
                 </div>
               ))}
               
               {newItems.length === 0 && <p className="text-xs text-text-secondary text-center py-2">No hay ítems en la orden.</p>}
               
               <div className="flex justify-between items-center mt-2 pt-2 border-t border-navy-700">
                 <span className="text-sm font-medium">Total Estimado:</span>
                 <span className="text-base font-bold text-accent-blue">{formatCurrency(newOrderTotal)}</span>
               </div>
             </div>
          </div>
        </DialogComponent>
    </div>
  );
}