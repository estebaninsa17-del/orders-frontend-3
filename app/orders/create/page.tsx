"use client";
import { useState, useEffect } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import { createOrder, getProducts } from "../../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function CreateOrder() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    id: Date.now(),
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    phone: "",
  });

  const [items, setItems] = useState([
    { productId: "", quantity: 1 }
  ]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async () => {
    if (!customer.firstName || !customer.lastName) {
      alert("Por favor completa el nombre del cliente");
      return;
    }
    if (items.some((i) => !i.productId)) {
      alert("Por favor selecciona un producto en cada item");
      return;
    }

    setLoading(true);

    const orderItems = items.map((item, index) => {
      const product = products.find((p) => p.id === Number(item.productId));
      return {
        id: index + 1,
        product,
        unitPrice: product.unitPrice,
        quantity: Number(item.quantity),
      };
    });

    const payload = {
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      totalAmount: 0,
      customer: { ...customer, id: Date.now() },
      items: orderItems,
    };

    await createOrder(payload);
    setLoading(false);
    router.push("/orders");
  };

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
        <h2 className="page-title">Nuevo Pedido</h2>

        <div className="section">
          <div className="section-title">Datos del Cliente</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Nombre", field: "firstName" },
              { label: "Apellido", field: "lastName" },
              { label: "Ciudad", field: "city" },
              { label: "País", field: "country" },
              { label: "Teléfono", field: "phone" },
            ].map(({ label, field }) => (
              <div key={field}>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.3rem" }}>{label}</label>
                <input
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "0.9rem" }}
                  value={(customer as any)[field]}
                  onChange={(e) => setCustomer({ ...customer, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="section-title" style={{ margin: 0 }}>Items del Pedido</div>
            <button className="btn btn-secondary" onClick={addItem}>+ Agregar Item</button>
          </div>

          {items.map((item, index) => (
            <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 120px auto", gap: "1rem", marginBottom: "0.75rem", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.3rem" }}>Producto</label>
                <select
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "0.9rem" }}
                  value={item.productId}
                  onChange={(e) => updateItem(index, "productId", e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.productName} — ${p.unitPrice}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#888", display: "block", marginBottom: "0.3rem" }}>Cantidad</label>
                <input
                  type="number"
                  min={1}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "0.9rem" }}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                />
              </div>
              <button className="btn btn-danger" onClick={() => removeItem(index)} disabled={items.length === 1}>✕</button>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
          {loading ? "Guardando..." : "Crear Pedido"}
        </button>
      </div>
    </>
  );
}