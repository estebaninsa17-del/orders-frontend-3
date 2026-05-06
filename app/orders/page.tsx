"use client";
import { useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Filter, Sort, Inject, Toolbar } from "@syncfusion/ej2-react-grids";
import { getOrders, deleteOrder } from "../../services/api";
import Link from "next/link";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const load = () => getOrders(1, 100).then((d) => setOrders(d.data || []));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este pedido?")) {
      await deleteOrder(id);
      load();
    }
  };

  const actionTemplate = (row: any) => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Link href={`/orders/${row.id}`}>
        <button className="btn btn-secondary">Ver</button>
      </Link>
      <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>Eliminar</button>
    </div>
  );

  return (
    <>
      <nav className="navbar">
        <h1>📦 Orders Management</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/orders">Pedidos</Link>
          <Link href="/products">Productos</Link>
        </nav>
      </nav>
      <div className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 className="page-title" style={{ margin: 0 }}>Pedidos</h2>
          <Link href="/orders/create">
            <button className="btn btn-primary">+ Nuevo Pedido</button>
          </Link>
        </div>
        <div className="section">
          <GridComponent dataSource={orders} allowPaging allowFiltering allowSorting toolbar={["Search"]}>
            <ColumnsDirective>
              <ColumnDirective field="orderNumber" headerText="# Orden" width="130" />
              <ColumnDirective field="orderDate" headerText="Fecha" width="150" format="yMd" />
              <ColumnDirective field="customer.firstName" headerText="Cliente" width="150" />
              <ColumnDirective field="customer.country" headerText="País" width="130" />
              <ColumnDirective field="totalAmount" headerText="Total" width="120" format="C2" />
              <ColumnDirective headerText="Acciones" width="180" template={actionTemplate} />
            </ColumnsDirective>
            <Inject services={[Page, Filter, Sort, Toolbar]} />
          </GridComponent>
        </div>
      </div>
    </>
  );
}