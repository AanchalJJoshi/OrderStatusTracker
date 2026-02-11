import type { Order } from "../types/order";
import type { OrderStatus } from "../types/order";


interface Props {
  order: Order;
}

const statusColorMap: Record<OrderStatus, string> = {
  PLACED: "#6b7280",
  PAID: "#2563eb",
  SHIPPED: "#f59e0b",
  DELIVERED: "#16a34a",
  CANCELLED: "#dc2626"
};

const OrderDetails = ({ order }: Props) => {
  return (
    <div style={{ padding: "16px", border: "1px solid #e5e7eb", marginTop: "16px" }}>
      {/* Header */}
      <header style={{ marginBottom: "16px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          Order {order.id}
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "12px",
              backgroundColor: statusColorMap[order.status],
              color: "#fff",
              fontSize: "12px"
            }}
          >
            {order.status}
          </span>
        </h2>

        <p style={{ marginTop: "8px", color: "#374151" }}>
          <strong>Email:</strong> {order.customer.email}
          <br />
          <strong>Mobile:</strong> {order.customer.mobile}
        </p>
      </header>

      {/* Items */}
      <section style={{ marginBottom: "16px" }}>
        <h3>Items</h3>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} × {item.quantity} — ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>

        <p style={{ marginTop: "8px" }}>
          <strong>Total:</strong> ₹{order.total}
        </p>
      </section>

      {/* Timeline */}
      <section>
        <h3>Order Timeline</h3>

        {order.timeline.length === 0 ? (
          <p>No timeline events available.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {order.timeline.map((event, index) => (
              <li
                key={index}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #e5e7eb"
                }}
              >
                <strong>{event.status}</strong>{" "}
                <span style={{ color: "#6b7280", fontSize: "12px" }}>
                  ({new Date(event.timestampUtc).toLocaleString()})
                </span>

                {event.comment && (
                  <div style={{ marginTop: "4px", fontSize: "14px" }}>
                    {event.comment}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default OrderDetails;
