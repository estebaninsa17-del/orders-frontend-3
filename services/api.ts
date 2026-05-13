const BASE = "/api/proxy";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let errorMsg = `Error HTTP: ${res.status}`;
    try {
      const err = await res.json();
      errorMsg = err.detail || errorMsg;
    } catch (e) {
      // Ignorar fallo de parseo JSON si no existe
    }
    console.error(`Status ${res.status} al llamar ${res.url}:`, errorMsg);
    throw new Error(errorMsg);
  }
  // Para códigos 204 (No Content) no hay body que parsear
  if (res.status === 204) return null;
  
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
};

export const getOrders = async (page = 1, pageSize = 100) => {
  try {
    const res = await fetch(`${BASE}/orders?page=${page}&pageSize=${pageSize}`);
    const json = await handleResponse(res);
    return json?.data || json || [];
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    return [];
  }
};

export async function getOrder(id: number | string) {
  try {
    const res = await fetch(`${BASE}/orders/${id}`);
    const json = await handleResponse(res);
    return json?.data || json;
  } catch (error) {
    console.error("Error al cargar el pedido:", error);
    return null;
  }
}

export async function createOrder(data: any) {
  try {
    const res = await fetch(`${BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error: any) {
    console.error("Error al crear pedido:", error);
    if (error.message === "Failed to fetch") {
      throw new Error("Error de conexión con el servidor");
    }
    throw error;
  }
}

export async function updateOrder(id: number | string, data: any) {
  try {
    const res = await fetch(`${BASE}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    throw error;
  }
}

export async function patchOrderState(id: number | string, status: string) {
  try {
    const res = await fetch(`${BASE}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }), // Enviamos el objeto con el field status que acepta el backend
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error);
    throw error;
  }
}

export async function deleteOrder(id: number | string) {
  try {
    const res = await fetch(`${BASE}/orders/${id}`, { method: "DELETE" });
    await handleResponse(res);
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const res = await fetch(`${BASE}/products`);
    const json = await handleResponse(res);
    return json?.data || json || [];
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
}

// TODO: Endpoint no provisto en especificación Swagger. Se deja como mock.
export async function createProduct(data: any) {
  console.warn("Endpoint POST /api/v1/products no documentado en API real");
  return Promise.resolve(null);
}

// TODO: Endpoint no provisto en especificación Swagger. Se deja como mock.
export async function updateProduct(id: number | string, data: any) {
  console.warn("Endpoint PUT /api/v1/products no documentado en API real");
  return Promise.resolve(null);
}

// TODO: Endpoint no provisto en especificación Swagger. Se deja como mock.
export async function deleteProduct(id: number | string) {
  console.warn("Endpoint DELETE /api/v1/products no documentado en API real");
  return Promise.resolve(null);
}