import { useEffect, useState } from "react";
import type { OrderNote } from "../types/order";

interface Props {
  orderId: string;
}

const SupportNotes = ({ orderId }: Props) => {
  const [notes, setNotes] = useState<OrderNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notes from order details (simple approach)
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/orders/${orderId}`);

        if (!res.ok) {
          throw new Error("Failed to load order notes");
        }

        const data = await res.json();
        setNotes(data.notes ?? []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [orderId]);

  const addNote = async () => {
    if (!newNote.trim()) {
      setError("Note cannot be empty");
      return;
    }

    if (newNote.length > 1000) {
      setError("Note cannot exceed 1000 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
      });

      if (!res.ok) {
        throw new Error("Failed to add note");
      }

      
      setNotes((prev) => [
        ...prev,
        {
          id: "",
          author: "You",
          note: newNote,
         createdUtc: new Date().toISOString()
        }
      ]);

      setNewNote("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Support Notes</h3>

      {/* Notes list */}
      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && notes.length === 0 && (
        <p>No support notes available.</p>
      )}

      {notes.length > 0 && (
        <ul style={{ paddingLeft: "16px" }}>
          {notes.map((note, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "14px" }}>{note.note}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                — {note.author},{" "}
                {new Date(note.createdUtc).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add note */}
      <div style={{ marginTop: "16px" }}>
        <textarea
          rows={3}
          placeholder="Add internal support note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <button onClick={addNote} disabled={submitting}>
          {submitting ? "Adding..." : "Add Note"}
        </button>
      </div>
    </div>
  );
};

export default SupportNotes;
