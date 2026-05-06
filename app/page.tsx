"use client";
import { useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import { getOrders } from "../services/api";
import Link from "next/link";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
  getOrders().then((data) => {
  setOrders(data || []);
  setTotal(data.length || 0);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const countries = new Set(orders.map((o) => o.customer.country)).size;

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
        <h2 className="page-title">Dashboard</h2>
        <div className="cards-row">
          <div className="card">
            <div className="label">Total Pedidos</div>
            <div className="value">{total}</div>
          </div>
          <div className="card">
            <div className="label">Ingresos Totales</div>
            <div className="value green">${totalRevenue.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="label">Países</div>
            <div className="value">{countries}</div>
          </div>
          <div className="card">
            <div className="label">Promedio por Pedido</div>
            <div className="value">${total ? (totalRevenue / total).toFixed(2) : "0"}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Últimos Pedidos</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Orden</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Cliente</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>País</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>{o.orderNumber}</td>
                  <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>{o.customer.firstName} {o.customer.lastName}</td>
                  <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>{o.customer.country}</td>
                  <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>${o.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}