import { useState } from "react";
import type { Order } from "../types/order";



interface Props {
  onSelectOrder: (order: Order) => void;
}


const OrderSearch = ({ onSelectOrder }: Props) => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchOrders = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      const res = await fetch(`/api/orders?query=${query}`);

      if (!res.ok) {
        throw new Error("Failed to search orders");
      }

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Order Search</h2>

      {/* Search input */}
      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Order ID / Email / Mobile"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: "8px" }}
        />

        <button onClick={searchOrders} disabled={loading}>
          Search
        </button>
      </div>

      {/* States */}
      {loading && <p>Searching orders...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && orders.length === 0 && query && !error && (
        <p>No orders found.</p>
      )}

      {/* Results table */}
      {orders.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "12px"
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Order ID
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Email
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Status
              </th>
              <th style={{ borderBottom: "1px solid #ccc" }} />
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ padding: "6px 0" }}>{order.id}</td>
                <td>{order.customer.email}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => onSelectOrder(order)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderSearch;
