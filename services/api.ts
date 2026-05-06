const BASE = "https://orders-api-0yop.onrender.com"
export async function getOrders(page = 1, pageSize = 10) {
  const res = await fetch(`${BASE}/orders?page=${page}&pageSize=${pageSize}`);
  return res.json();
}

export async function getOrder(id: number) {
  const res = await fetch(`${BASE}/orders/${id}`);
  return res.json();
}

export async function createOrder(data: any) {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOrder(id: number, data: any) {
  const res = await fetch(`${BASE}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteOrder(id: number) {
  await fetch(`${BASE}/orders/${id}`, { method: "DELETE" });
}

export async function getProducts() {
  const res = await fetch(`${BASE}/products`);
  return res.json();
}