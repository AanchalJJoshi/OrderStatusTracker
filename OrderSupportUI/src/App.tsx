import { useState } from "react";

import OrderSearch from "../components/OrderSearch";
import OrderDetails from "../components/OrderDetails";
import SupportNotes from "../components/SupportNotes";
import UpdateStatus from "../components/UpdateStatus";

import type { Order } from "../types/order";

function App() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >
      <h1>Support Operations Tool</h1>

      {/* Order Search */}
      <OrderSearch onSelectOrder={setSelectedOrder} />

      {/* Order Details */}
      {selectedOrder ? (
        <>
          <OrderDetails order={selectedOrder} />

          <UpdateStatus
            orderId={selectedOrder.id}
            currentStatus={selectedOrder.status}
            onStatusUpdated={(newStatus) =>
              setSelectedOrder({
                ...selectedOrder,
                status: newStatus
              })
            }
          />

          <SupportNotes orderId={selectedOrder.id} />
        </>
      ) : (
        <p style={{ marginTop: "16px", color: "#6b7280" }}>
          Search and select an order to view details.
        </p>
      )}
    </div>
  );
}

export default App;
