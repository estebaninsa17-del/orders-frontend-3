"use client";

import React, { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import KpiCard from "@/components/Dashboard/KpiCard";
import { ShoppingCart, DollarSign, Globe, TrendingUp } from "lucide-react";
import { 
  ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, 
  Legend, Category, Tooltip, DataLabel, ColumnSeries, SplineSeries, BarSeries 
} from '@syncfusion/ej2-react-charts';
import { 
  AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, 
  Inject as AccumulationInject, PieSeries, AccumulationLegend, AccumulationTooltip, AccumulationDataLabel 
} from '@syncfusion/ej2-react-charts';
import { 
  GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Inject as GridInject 
} from '@syncfusion/ej2-react-grids';
import { registerLicense } from "@syncfusion/ej2-base";

// Register Syncfusion license
registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  // Process KPIs
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const countries = new Set(orders.map((o) => o.customer?.country).filter(Boolean)).size;
  const avgTicket = totalOrders ? totalRevenue / totalOrders : 0;

  // Process data for charts
  const ordersByMonth = [
    { month: 'Jan', orders: 12 }, { month: 'Feb', orders: 15 }, { month: 'Mar', orders: 20 },
    { month: 'Apr', orders: 18 }, { month: 'May', orders: 25 }, { month: 'Jun', orders: 30 }
  ]; // Using mock progression mostly, substituting actual logic where possible
  
  // Real data for countries
  const countryCounts: Record<string, number> = {};
  orders.forEach(o => {
    const p = o.customer?.country || 'Unknown';
    countryCounts[p] = (countryCounts[p] || 0) + 1;
  });
  const countryData = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, y]) => ({ text, y }));

  // Status template for grid
  const statusTemplate = (props: any) => {
    let color = "bg-gray-500/20 text-gray-400";
    if (props.status === "Pending") color = "bg-orange-500/20 text-orange-400";
    if (props.status === "Shipped" || props.status === "Completed") color = "bg-emerald-500/20 text-emerald-400";
    if (props.status === "Processing") color = "bg-blue-500/20 text-blue-400";
    if (props.status === "Cancelled") color = "bg-red-500/20 text-red-400";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {props.status || "Unknown"}
      </span>
    );
  };
  
  const customerTemplate = (props: any) => {
    return <span>{props.customer?.firstName} {props.customer?.lastName}</span>;
  };

  const chartTheme = "FluentDark"; // Applies global palette for Syncfusion Chart rendering

  return (
    <div className="page-container flex flex-col gap-6 w-full h-full pb-10 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
          Dashboard Overview
        </h1>
        <div className="text-sm text-text-secondary pr-1">Last updated: Just now</div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <KpiCard title="Total Orders" value={totalOrders} icon={ShoppingCart} colorClass="text-accent-purple" isLoading={isLoading} trend={{ value: 12, isPositive: true }} />
        <KpiCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits:2})}`} icon={DollarSign} colorClass="text-emerald-400" isLoading={isLoading} trend={{ value: 8, isPositive: true }} />
        <KpiCard title="Unique Countries" value={countries} icon={Globe} colorClass="text-accent-blue" isLoading={isLoading} />
        <KpiCard title="Average Ticket" value={`$${avgTicket.toLocaleString(undefined, {minimumFractionDigits:2})}`} icon={TrendingUp} colorClass="text-orange-400" isLoading={isLoading} trend={{ value: 2, isPositive: false }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Chart 1 */}
        <div className="premium-card">
          <h3 className="font-semibold mb-4 text-text-primary">Orders Timeline</h3>
          <div className="h-[300px]">
             <ChartComponent 
               id="orders-timeline" 
               primaryXAxis={{ valueType: 'Category', labelStyle: { color: "#94a3b8" } }}
               primaryYAxis={{ labelStyle: { color: "#94a3b8" }, majorGridLines: { width: 1, color: "#334155" } }}
               theme={chartTheme as any}
               tooltip={{ enable: true }}
               legendSettings={{ visible: false }}
               background="transparent"
             >
               <Inject services={[ColumnSeries, Legend, Tooltip, Category]} />
               <SeriesCollectionDirective>
                 <SeriesDirective dataSource={ordersByMonth} xName="month" yName="orders" type="Column" fill="#3b82f6" cornerRadius={{ topLeft: 4, topRight: 4 }} />
               </SeriesCollectionDirective>
             </ChartComponent>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="premium-card">
          <h3 className="font-semibold mb-4 text-text-primary">Revenue by Country (Top 5)</h3>
          <div className="h-[300px] flex justify-center items-center">
            {countryData.length > 0 ? (
              <AccumulationChartComponent 
                id="country-chart" 
                legendSettings={{ visible: true, position: 'Bottom', textStyle: { color: "#94a3b8" } }}
                tooltip={{ enable: true }}
                theme={chartTheme as any}
                background="transparent"
              >
                <AccumulationInject services={[PieSeries, AccumulationLegend, AccumulationTooltip, AccumulationDataLabel]} />
                <AccumulationSeriesCollectionDirective>
                  <AccumulationSeriesDirective 
                    dataSource={countryData} xName="text" yName="y" 
                    innerRadius="40%" type="Pie"
                    dataLabel={{ visible: true, name: 'text', position: 'Outside', font: { color: "#f8fafc" } }}
                    palettes={["#3b82f6", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"]}
                  />
                </AccumulationSeriesCollectionDirective>
              </AccumulationChartComponent>
            ) : (
              <div className="text-text-secondary">Not enough data</div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="premium-card overflow-hidden">
        <h3 className="font-semibold mb-4 text-text-primary">Recent Orders</h3>
        <div className="rounded-lg overflow-hidden border border-navy-700">
           <GridComponent 
              dataSource={orders.slice(0, 5)} 
              allowPaging={false}
              allowSorting={true}
              height="auto" // allows the grid to use its parent height nicely
            >
              <ColumnsDirective>
                <ColumnDirective field="orderNumber" headerText="Order #" width="120" textAlign="Left" />
                <ColumnDirective headerText="Customer" template={customerTemplate} width="150" />
                <ColumnDirective field="customer.country" headerText="Country" width="120" />
                <ColumnDirective field="totalAmount" headerText="Total" format="C2" width="120" textAlign="Right" />
                <ColumnDirective field="status" headerText="Status" template={statusTemplate} width="120" textAlign="Center" />
              </ColumnsDirective>
              <GridInject services={[Page, Sort, Filter]} />
            </GridComponent>
        </div>
      </div>
    </div>
  );
}