"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject as ChartInject, 
  AreaSeries, BarSeries, Category, Tooltip as ChartTooltip, DataLabel, SplineAreaSeries, Legend
} from "@syncfusion/ej2-react-charts";
import { 
  GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Inject as GridInject,
  PdfExport, ExcelExport
} from "@syncfusion/ej2-react-grids";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import { getOrders } from "../../services/api";
import { DownloadCloud, FileText, ArrowUpRight, ArrowDownRight, Trophy, MapPin, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const detailGridRef = useRef<GridComponent | null>(null);

  useEffect(() => {
    getOrders().then(d => {
      setOrders(d || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  // --- DERIVADOS Y ESTADÍSTICAS ---
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const ticketAverage = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Agrupar por País
  const countryCount: Record<string, number> = {};
  orders.forEach(o => {
    const c = o.customer?.country || 'Desconocido';
    countryCount[c] = (countryCount[c] || 0) + 1;
  });
  const sortedCountries = Object.entries(countryCount).sort((a,b) => b[1] - a[1]);
  const leadingCountry = sortedCountries.length > 0 ? sortedCountries[0][0] : 'N/A';

  const countryChartData = sortedCountries.slice(0, 5).map(c => ({ x: c[0], y: c[1] }));

  // Agrupar por Producto
  const productSales: Record<string, { units: number, revenue: number }> = {};
  orders.forEach(o => {
    o.orderItems?.forEach((item: any) => {
      const pName = item.productName || `Prod #${item.productId}`;
      if(!productSales[pName]) productSales[pName] = { units: 0, revenue: 0 };
      productSales[pName].units += item.quantity;
      productSales[pName].revenue += (item.quantity * item.unitPrice);
    });
  });
  const sortedProducts = Object.entries(productSales).sort((a,b) => b[1].units - a[1].units);
  const leadingProduct = sortedProducts.length > 0 ? sortedProducts[0][0] : 'N/A';
  
  // Serie temporal (Mockeada por fecha o index para el area chart)
  const timelineData = orders.slice(-14).map((o, idx) => ({
    x: new Date(o.orderDate || new Date(Date.now() - (14-idx)*86400000)).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
    y: o.totalAmount
  }));

  // Resumen mini tabla
  const summaryData = [
    { period: 'Esta Semana', orders: 42, revenue: 125000, trend: 12.5 },
    { period: 'Semana Pasada', orders: 38, revenue: 110000, trend: -5.2 },
    { period: 'Hace 2 Semanas', orders: 40, revenue: 116000, trend: 8.1 },
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const exportPdf = () => { if(detailGridRef.current) detailGridRef.current.pdfExport(); };
  const exportExcel = () => { if(detailGridRef.current) detailGridRef.current.excelExport(); };

  if (isLoading) {
    return <div className="p-10 text-center text-text-secondary flex flex-col items-center"><div className="w-10 h-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>Preparando Analíticas...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full h-full pb-10">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-navy-800 to-navy-900 border-b-4 border-accent-blue p-8 -mx-8 -mt-8 mb-4 shadow-xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
           <Trophy size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Centro de Reportes</h1>
            <p className="text-navy-300 text-lg">Análisis detallado y rendimiento global de tu negocio</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="bg-navy-900/80 p-1 rounded-lg backdrop-blur-sm border border-navy-700">
               <DateRangePickerComponent 
                  placeholder="Selecciona el período..." 
                  cssClass="e-custom-dark border-none bg-transparent"
                  width="280px"
                  format="dd MMM yyyy"
               />
            </div>
            <div className="flex gap-2">
              <button onClick={exportPdf} className="bg-navy-700 hover:bg-navy-600 border border-navy-600 text-white px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2">
                <FileText size={18} /> Exportar PDF
              </button>
              <button onClick={exportExcel} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                <DownloadCloud size={18} /> Exportar Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 px-4 sm:px-8">
        
        {/* 2. STAT BLOCKS (Inline) */}
        <div className="flex flex-wrap divide-y md:divide-y-0 md:divide-x divide-navy-700 bg-navy-800/40 rounded-xl border border-navy-700 backdrop-blur-md overflow-hidden">
          <div className="px-6 py-5 flex-1 min-w-[200px]">
             <p className="text-4xl font-bold text-white mb-1 shadow-sm">{totalOrders}</p>
             <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2"><TrendingUp size={14}/> Pedidos en Período</p>
          </div>
          <div className="px-6 py-5 flex-1 min-w-[200px]">
             <p className="text-4xl font-bold text-emerald-400 mb-1">{formatCurrency(totalRevenue)}</p>
             <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2"><TrendingUp size={14}/> Ingresos Totales</p>
          </div>
          <div className="px-6 py-5 flex-1 min-w-[200px]">
             <p className="text-4xl font-bold text-accent-blue mb-1">{formatCurrency(ticketAverage)}</p>
             <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Ticket Promedio</p>
          </div>
          <div className="px-6 py-5 flex-1 min-w-[200px]">
             <p className="text-2xl font-bold text-white mb-2 leading-tight truncate">{leadingCountry}</p>
             <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2"><MapPin size={14}/> País Líder</p>
          </div>
          <div className="px-6 py-5 flex-1 min-w-[200px]">
             <p className="text-2xl font-bold text-white mb-2 leading-tight truncate" title={leadingProduct}>{leadingProduct}</p>
             <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2"><Trophy size={14}/> Producto Líder</p>
          </div>
        </div>

        {/* 3. TENDENCIA DE VENTAS (60/40) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
           <div className="lg:col-span-3 premium-card p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4">Tendencia de Ingresos</h3>
              <div className="flex-1 min-h-[300px]">
                <ChartComponent 
                  id="revenue-trend" 
                  primaryXAxis={{ valueType: 'Category', labelStyle: { color: "#94a3b8" }, majorGridLines: { width: 0 } }}
                  primaryYAxis={{ labelStyle: { color: "#94a3b8" }, majorGridLines: { width: 1, color: "#334155" }, title: "INGRESOS" }}
                  chartArea={{ border: { width: 0 } }}
                  tooltip={{ enable: true, fill: '#1e293b', textStyle: { color: '#fff' } }}
                  background="transparent"
                  height="100%"
                >
                  <ChartInject services={[SplineAreaSeries, Category, ChartTooltip, Legend]} />
                  <SeriesCollectionDirective>
                    <SeriesDirective 
                      dataSource={timelineData} 
                      xName="x" yName="y" 
                      name="Ingresos"
                      type="SplineArea" 
                      fill="url(#gradient-chart)"
                      border={{ width: 2, color: "#3b82f6" }}
                      opacity={0.5}
                    />
                  </SeriesCollectionDirective>
                </ChartComponent>
                <svg style={{ height: 0 }}>
                  <defs>
                    <linearGradient id="gradient-chart" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#3b82f6" />
                      <stop offset="1" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
           </div>
           
           <div className="lg:col-span-2 premium-card p-0 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-navy-700 bg-navy-800/80">
                <h3 className="text-lg font-bold text-white">Resumen por Período</h3>
              </div>
              <GridComponent dataSource={summaryData} className="border-none">
                <ColumnsDirective>
                  <ColumnDirective field="period" headerText="Período" width="140" />
                  <ColumnDirective field="orders" headerText="Pedidos" textAlign="Center" width="100" />
                  <ColumnDirective field="revenue" headerText="Ingresos" format="C0" textAlign="Right" width="120" />
                  <ColumnDirective headerText="Variación" textAlign="Center" width="100" template={(d: any) => (
                    <span className={`flex items-center justify-center gap-1 font-medium ${d.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {d.trend > 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {Math.abs(d.trend)}%
                    </span>
                  )} />
                </ColumnsDirective>
              </GridComponent>
           </div>
        </div>

        {/* 4. DISTRIBUCIÓN GEOGRÁFICA Y 5. PODIO PRODUCTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           <div className="premium-card p-6 bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600/50 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none text-accent-blue"><MapPin size={250}/></div>
             <h3 className="text-lg font-bold text-white mb-6 relative z-10">Distribución Geográfica</h3>
             <div className="flex flex-col gap-4 relative z-10">
               {sortedCountries.slice(0, 5).map((c, i) => {
                 const percentage = Math.round((c[1] / totalOrders) * 100) || 0;
                 return (
                   <div key={i} className="flex flex-col gap-1.5">
                     <div className="flex justify-between text-sm">
                       <span className="font-medium text-text-primary flex items-center gap-2">
                         <span className="w-5 text-center">{['🇺🇸','🇨🇴','🇲🇽','🇪🇸','🇦🇷'][i] || '🌍'}</span> {c[0]}
                       </span>
                       <span className="text-text-secondary font-mono">{c[1]} peds <span className="text-white ml-2">{percentage}%</span></span>
                     </div>
                     <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
                       <div className="bg-accent-blue h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>

           <div className="premium-card p-6 relative">
              <h3 className="text-lg font-bold text-white mb-6 text-center">Top 3 Productos</h3>
              <div className="flex items-end justify-center gap-4 h-[250px] pt-4">
                 {/* Plata */}
                 {sortedProducts[1] && (
                   <div className="flex flex-col items-center w-[30%]">
                      <p className="text-xs text-text-secondary text-center truncate w-full px-2 mb-2" title={sortedProducts[1][0]}>{sortedProducts[1][0]}</p>
                      <div className="w-full bg-gradient-to-t from-navy-800 to-slate-400/80 rounded-t-lg border-t-2 border-slate-300 flex flex-col items-center justify-start pt-3 h-[130px] shadow-[0_0_15px_rgba(148,163,184,0.2)]">
                         <span className="text-2xl font-black text-slate-100 drop-shadow-md">2</span>
                         <span className="text-xs font-medium text-slate-200 mt-2">{formatCurrency(sortedProducts[1][1].revenue)}</span>
                      </div>
                   </div>
                 )}
                 {/* Oro */}
                 {sortedProducts[0] && (
                   <div className="flex flex-col items-center w-[35%] z-10">
                      <div className="mb-2 text-yellow-400 animate-bounce"><Trophy size={28}/></div>
                      <p className="text-sm font-bold text-text-primary text-center truncate w-full px-2 mb-2" title={sortedProducts[0][0]}>{sortedProducts[0][0]}</p>
                      <div className="w-full bg-gradient-to-t from-navy-800 to-yellow-500/80 rounded-t-lg border-t-2 border-yellow-400 flex flex-col items-center justify-start pt-3 h-[170px] shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                         <span className="text-3xl font-black text-white drop-shadow-md">1</span>
                         <span className="text-sm font-bold text-yellow-100 mt-2">{formatCurrency(sortedProducts[0][1].revenue)}</span>
                      </div>
                   </div>
                 )}
                 {/* Bronce */}
                 {sortedProducts[2] && (
                   <div className="flex flex-col items-center w-[30%]">
                      <p className="text-xs text-text-secondary text-center truncate w-full px-2 mb-2" title={sortedProducts[2][0]}>{sortedProducts[2][0]}</p>
                      <div className="w-full bg-gradient-to-t from-navy-800 to-amber-700/80 rounded-t-lg border-t-2 border-amber-600 flex flex-col items-center justify-start pt-3 h-[100px] shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                         <span className="text-2xl font-black text-amber-100 drop-shadow-md">3</span>
                         <span className="text-xs font-medium text-amber-200 mt-2">{formatCurrency(sortedProducts[2][1].revenue)}</span>
                      </div>
                   </div>
                 )}
              </div>
           </div>

        </div>

        {/* 6. TABLA DETALLADA COMPLETA */}
        <div className="premium-card p-0 flex flex-col overflow-hidden mb-10">
          <div className="p-6 border-b border-navy-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Detalle Histórico de Pedidos</h3>
              <p className="text-sm text-text-secondary">Exporta esta tabla para auditorías o contabilidad</p>
            </div>
            <button 
              onClick={exportExcel}
              className="bg-navy-900 border border-navy-700 hover:bg-navy-800 text-text-primary px-3 py-1.5 rounded text-sm transition flex gap-2 items-center"
            >
              <DownloadCloud size={14}/> Bajar CSV
            </button>
          </div>
          <GridComponent 
            ref={detailGridRef}
            dataSource={orders} 
            allowPaging={true} 
            pageSettings={{ pageSize: 10 }}
            allowSorting={true} 
            allowPdfExport={true}
            allowExcelExport={true}
            className="border-none"
          >
            <ColumnsDirective>
              <ColumnDirective field="orderDate" headerText="Fecha" width="130" format="yMd" />
              <ColumnDirective field="orderNumber" headerText="ID" width="100" />
              <ColumnDirective field="customer.firstName" headerText="Cliente" width="150" />
              <ColumnDirective field="customer.country" headerText="Ubicación" width="130" />
              <ColumnDirective field="totalAmount" headerText="Monto" width="130" format="C2" textAlign="Right" />
              <ColumnDirective field="status" headerText="Estado" width="120" textAlign="Center" template={(d:any) => (
                <span className="px-2 py-1 bg-navy-800 border border-navy-600 rounded text-xs text-text-primary">{d.status}</span>
              )} />
            </ColumnsDirective>
            <GridInject services={[Page, Sort, PdfExport, ExcelExport]} />
          </GridComponent>
        </div>

      </div>
    </div>
  );
}
