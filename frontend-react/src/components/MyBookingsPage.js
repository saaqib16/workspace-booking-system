import { useEffect, useState } from "react";
import API from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

function formatDateTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getRoomName(roomId, rooms) {
  const room = rooms.find((r) => String(r.id) === String(roomId));
  return room ? `${room.roomName}${room.location ? ` (${room.location})` : ""}` : `Room #${roomId}`;
}

export default function MyBookingsPage({ currentUser, rooms, onBookingChanged }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get(`/bookings/user/${currentUser?.id || 1}`);
      setBookings(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load your bookings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser?.id]);

  const handleCancel = async (booking) => {
    const confirmed = window.confirm("Cancel this booking? This cannot be undone.");
    if (!confirmed) return;
    setCancellingId(booking.id);
    try {
      await API.delete(`/bookings/${booking.id}`);
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      if (onBookingChanged) onBookingChanged();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not cancel this booking."));
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.endDateTime) >= now);
  const past = bookings.filter((b) => new Date(b.endDateTime) < now);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-card__eyebrow">My Bookings</p>
        <h1>Track and manage your reservations.</h1>
        <p>
          All bookings you have created appear here. Cancel upcoming ones if your plans change.
        </p>
        <div className="page-actions">
          <span className="badge-soft">{upcoming.length} upcoming</span>
        </div>
      </section>

      {error ? <div className="error-state">{error}</div> : null}

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Upcoming Bookings</h2>
            <p className="panel-card__subtitle">These reservations are still active.</p>
          </div>
          <span className="badge-soft">{upcoming.length}</span>
        </div>

        {loading ? (
          <div className="empty-state">Loading your bookings...</div>
        ) : upcoming.length === 0 ? (
          <div className="empty-state">No upcoming bookings. Head to the bookings form to create one.</div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Start</th>
                  <th>End</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((b) => (
                  <tr key={b.id}>
                    <td>{getRoomName(b.roomId, rooms)}</td>
                    <td>{formatDateTime(b.startDateTime)}</td>
                    <td>{formatDateTime(b.endDateTime)}</td>
                    <td>
                      <button
                        className="danger-button"
                        disabled={cancellingId === b.id}
                        onClick={() => handleCancel(b)}
                        type="button"
                      >
                        {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Past Bookings</h2>
              <p className="panel-card__subtitle">Completed reservations from your history.</p>
            </div>
            <span className="badge-soft">{past.length}</span>
          </div>
          <div className="bookings-table-wrapper">
            <table className="bookings-table bookings-table--muted">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {past.map((b) => (
                  <tr key={b.id}>
                    <td>{getRoomName(b.roomId, rooms)}</td>
                    <td>{formatDateTime(b.startDateTime)}</td>
                    <td>{formatDateTime(b.endDateTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
