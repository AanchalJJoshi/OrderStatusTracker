import { useState } from "react";
import OrderDetails from "../components/OrderDetails";
import OrderSearch  from "../components/OrderSearch";
import { Order } from "../types/order";
export function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<Order | null>(null);

  return (
    <div className="page">
      <h1>Order Support</h1>

      <OrderSearch onSelectOrder={setSelectedOrderId} />

      {selectedOrderId && (
        <OrderDetails order={selectedOrderId} />
      )}
    </div>
  );
}
