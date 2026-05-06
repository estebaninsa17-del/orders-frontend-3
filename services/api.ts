const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders`)
  return res.json()
}

export async function getOrder(id: number) {
  const res = await fetch(`${API_URL}/orders/${id}`);
  return res.json();
}

export async function createOrder(data: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOrder(id: number, data: any) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteOrder(id: number) {
  await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}