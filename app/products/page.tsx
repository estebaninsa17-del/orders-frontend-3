"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  GridComponent, ColumnsDirective, ColumnDirective, Page, Filter, Sort, Inject as GridInject 
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api";
import { Search, LayoutGrid, List, Plus, Edit3, Trash2, Tag, Image as ImageIcon, AlertCircle, PackageOpen } from "lucide-react";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const load = () => {
    setIsLoading(true);
    getProducts().then((d) => {
      setProducts(d || []);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    // Para simplificar, deshabilitamos la acción en UI y usamos el mock del api.ts
    if (confirm("Acción inhabilitada. Endpoints no implementados aún.")) {
       // Mock
    }
  };

  const filteredProducts = products.filter(p => 
    (p.productName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (p.package?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStockColor = (stock: any) => {
    if (stock === null || stock === undefined) return "bg-navy-700/50 text-text-secondary border-navy-600";
    if (stock > 10) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (stock > 0 && stock <= 10) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const actionTemplate = (row: any) => (
    <div className="flex gap-3 justify-center">
      <button 
        onClick={() => { setSelectedProduct(row); setIsModalOpen(true); }}
        className="text-text-secondary hover:text-accent-blue transition"
      >
        <Edit3 size={18} />
      </button>
      <button 
        onClick={() => { setSelectedProduct(row); setIsModalOpen(true); }}
        className="text-text-secondary hover:text-red-400 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  const formatCurrency = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(num);
  };

  const getAvatarColor = (name: string) => {
    if (!name) return 'hsl(0, 0%, 50%)';
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return `hsl(${Math.abs(hash) % 360}, 65%, 35%)`;
  };

  const getInitials = (name: string) => {
    if (!name) return 'PD';
    return name.substring(0, 2).toUpperCase();
  };

  const stockTemplate = (row: any) => {
    if (row.stock === null || row.stock === undefined) return null;
    return (
      <span className={`px-2 py-1 rounded border text-xs font-semibold ${getStockColor(row.stock)}`}>
        {row.stock > 0 ? `${row.stock} en stock` : 'Agotado'}
      </span>
    );
  };

  const imageTemplate = (row: any) => (
    <div className="w-10 h-10 rounded mx-auto flex items-center justify-center overflow-hidden">
      {row.imageUrl ? (
        <img src={row.imageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div style={{ backgroundColor: getAvatarColor(row.productName) }} className="w-full h-full flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-inner">
          {getInitials(row.productName)}
        </div>
      )}
    </div>
  );

  return (
    <div className="page-container flex flex-col gap-6 w-full h-full pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-text-secondary mt-1">Gestiona tu inventario, stock y precios</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-navy-900 border border-navy-700 rounded-lg py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue w-64"
            />
          </div>
          
          <div className="flex bg-navy-900 border border-navy-700 rounded-lg p-0.5">
            <button 
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md transition ${viewMode === 'card' ? 'bg-navy-700 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              title="Vista de Tarjetas"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-navy-700 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              title="Vista de Tabla"
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-accent-blue/20"
          >
            <Plus size={18} /> Agregar Producto
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
           <div className="h-64 bg-navy-700/50 rounded-xl skeleton-pulse w-full"></div>
           <div className="h-64 bg-navy-700/50 rounded-xl skeleton-pulse w-full"></div>
           <div className="h-64 bg-navy-700/50 rounded-xl skeleton-pulse w-full"></div>
           <div className="h-64 bg-navy-700/50 rounded-xl skeleton-pulse w-full"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
         <div className="w-full flex-1 flex flex-col items-center justify-center p-10 bg-navy-800/30 rounded-xl border border-navy-700 border-dashed">
            <div className="w-20 h-20 bg-navy-900 rounded-full flex items-center justify-center text-navy-600 mb-4">
              <PackageOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No hay productos en inventario</h3>
            <p className="text-text-secondary text-center max-w-sm mb-6">No pudimos encontrar productos que coincidan con tu búsqueda o tu base de datos está vacía.</p>
            <button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="bg-accent-blue hover:bg-accent-blue-hover text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Crea tu primer producto
            </button>
         </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="premium-card p-0 overflow-hidden group flex flex-col">
              <div className="h-48 bg-navy-900 relative flex items-center justify-center p-6 group-hover:bg-navy-800 transition">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.productName} className="h-full object-contain drop-shadow-2xl" />
                ) : (
                  <div style={{ backgroundColor: getAvatarColor(product.productName) }} className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-3xl shadow-lg border-4 border-navy-800">
                    {getInitials(product.productName)}
                  </div>
                )}
                
                {product.stock !== null && product.stock !== undefined && (
                  <div className="absolute top-3 right-3">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${getStockColor(product.stock)}`}>
                       {product.stock > 0 ? `${product.stock} disp.` : 'Agotado'}
                     </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary mb-2 font-medium">
                    <Tag size={12} /> {product.package || 'General'}
                  </div>
                  <h3 className="font-semibold text-text-primary text-lg leading-tight mb-1">{product.productName}</h3>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple mt-2">
                    {formatCurrency(product.unitPrice)}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-navy-700/50">
                  <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="flex-1 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 text-sm font-medium transition">Editar</button>
                  <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="w-10 flex items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-card p-0 overflow-hidden">
          <GridComponent dataSource={filteredProducts} allowPaging={true} pageSettings={{ pageSize: 12 }} allowSorting={true} className="border-none">
            <ColumnsDirective>
              <ColumnDirective headerText="Imagen" width="80" template={imageTemplate} textAlign="Center" />
              <ColumnDirective field="productName" headerText="Nombre de Producto" width="200" />
              <ColumnDirective field="package" headerText="Categoría/Paquete" width="130" />
              <ColumnDirective field="unitPrice" headerText="Precio" width="100" format="C2" textAlign="Right" />
              <ColumnDirective field="stock" headerText="Inventario" template={stockTemplate} width="120" textAlign="Center" />
              <ColumnDirective headerText="Acciones" width="100" template={actionTemplate} textAlign="Center" />
            </ColumnsDirective>
            <GridInject services={[Page, Sort, Filter]} />
          </GridComponent>
        </div>
      )}

      {/* product detail/create modal container */}
      <DialogComponent
        width="500px"
        isModal={true}
        visible={isModalOpen}
        close={() => setIsModalOpen(false)}
        header="Ver Producto (Solo lectura)"
        showCloseIcon={true}
        animationSettings={{ effect: 'Zoom' }}
        className="dark-dialog"
      >
        <div className="p-4 text-text-primary">
          <div className="flex mb-4 items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
             <AlertCircle size={20} className="shrink-0" />
             <p className="text-xs font-medium">Próximamente - El backend actual no dispone de endpoint POST/PUT para productos en el Swagger. Operación inhabilitada.</p>
          </div>
          
          <div className="flex flex-col gap-3 opacity-60">
             <div>
               <label className="text-sm font-medium mb-1 block">Nombre</label>
               <input readOnly className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-text-primary cursor-not-allowed" defaultValue={selectedProduct?.productName || ''} />
             </div>
             <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="text-sm font-medium mb-1 block">Precio</label>
                 <input readOnly className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-text-primary cursor-not-allowed" defaultValue={selectedProduct?.unitPrice || ''} />
               </div>
               <div>
                 <label className="text-sm font-medium mb-1 block">Stock</label>
                 <input readOnly className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-text-primary cursor-not-allowed" defaultValue={selectedProduct?.stock || ''} />
               </div>
             </div>
             <div>
               <label className="text-sm font-medium mb-1 block">Empaque</label>
               <input readOnly className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-text-primary cursor-not-allowed" defaultValue={selectedProduct?.package || ''} />
             </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-navy-700 rounded text-sm transition">Cerrar</button>
          </div>
        </div>
      </DialogComponent>
    </div>
  );
}