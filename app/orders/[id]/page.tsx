"use client";
import { useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import { getOrder } from "../../../services/api";
import Link from "next/link";
import { useParams } from "next/navigation";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(Number(id)).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;
  if (!order || !order.customer) return <p style={{ padding: "2rem" }}>Pedido no encontrado</p>;

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
        <Link href="/orders">
          <button className="btn btn-secondary" style={{ marginBottom: "1rem" }}>← Volver</button>
        </Link>
        <h2 className="page-title">{order.orderNumber}</h2>

        <div className="cards-row">
          <div className="card">
            <div className="label">Cliente</div>
            <div style={{ fontWeight: 600 }}>{order.customer.firstName} {order.customer.lastName}</div>
            <div style={{ fontSize: "0.85rem", color: "#888" }}>{order.customer.city}, {order.customer.country}</div>
            <div style={{ fontSize: "0.85rem", color: "#888" }}>{order.customer.phone}</div>
          </div>
          <div className="card">
            <div className="label">Total</div>
            <div className="value green">${order.totalAmount}</div>
          </div>
          <div className="card">
            <div className="label">Fecha</div>
            <div style={{ fontWeight: 600 }}>{new Date(order.orderDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Items del Pedido</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Producto</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Proveedor</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Precio Unit.</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Cantidad</th>
                <th style={{ textAlign: "left", padding: "0.5rem", fontSize: "0.85rem", color: "#888" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item: any) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td style={{ padding: "0.6rem 0.5rem" }}>{item.product?.productName}</td>
                  <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem", color: "#888" }}>{item.product?.supplier?.companyName}</td>
                  <td style={{ padding: "0.6rem 0.5rem" }}>${item.unitPrice}</td>
                  <td style={{ padding: "0.6rem 0.5rem" }}>{item.quantity}</td>
                  <td style={{ padding: "0.6rem 0.5rem", fontWeight: 600 }}>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}