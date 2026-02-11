const BASE_URL = "https://localhost:5272/api/orders";

export async function searchOrders(query: string) {
  const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search orders");
  return res.json();
}

export async function getOrder(orderId: string) {
  const res = await fetch(`${BASE_URL}/${orderId}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function addNote(orderId: string, note: string) {
  const res = await fetch(`${BASE_URL}/${orderId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note })
  });

  if (!res.ok) throw new Error("Failed to add note");
}

export async function updateStatus(
  orderId: string,
  newStatus: string,
  comment?: string
) {
  const res = await fetch(`${BASE_URL}/${orderId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newStatus, comment })
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error || "Status update failed");
  }
}
