import { useState } from "react";
import type { OrderStatus } from "../types/order";
import { ORDER_STATUSES } from "../types/order";


interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdated?: (newStatus: OrderStatus) => void;
}



const UpdateStatus = ({
  orderId,
  currentStatus,
  onStatusUpdated
}: Props) => {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async () => {
    if (selectedStatus === currentStatus) {
      setError("Please select a different status");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/orders/${orderId}/status?status=${selectedStatus}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status");
      }

      setMessage("Order status updated successfully");
      onStatusUpdated?.(selectedStatus);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Update Order Status</h3>

      <div style={{ marginBottom: "8px" }}>
        <select
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value as OrderStatus)
          }
          disabled={loading}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          onClick={updateStatus}
          disabled={loading}
          style={{ marginLeft: "8px" }}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdateStatus;
