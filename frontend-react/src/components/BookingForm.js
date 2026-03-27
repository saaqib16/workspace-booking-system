import { useState } from "react";
import API from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const initialForm = {
  roomId: "",
  startDateTime: "",
  endDateTime: "",
};

export default function BookingForm({ currentUser, rooms, onBookingSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.roomId || !form.startDateTime || !form.endDateTime) {
      setStatus({ type: "error", message: "Fill in all booking fields before submitting." });
      return;
    }

    if (form.startDateTime >= form.endDateTime) {
      setStatus({ type: "error", message: "Start must be earlier than end date & time." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await API.post("/bookings", {
        userId: currentUser?.id || 1,
        roomId: Number(form.roomId),
        startDateTime: form.startDateTime,
        endDateTime: form.endDateTime,
      });

      setStatus({ type: "success", message: "Booking created successfully." });
      setForm(initialForm);

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, "Booking failed. Please try another room or time slot."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel-card">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Book A Room</h2>
          <p className="panel-card__subtitle">Submit a reservation to `/api/bookings`.</p>
        </div>
        <span className="badge-soft">
          {currentUser?.name || "User"} {currentUser?.id ? `#${currentUser.id}` : ""}
        </span>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="roomId">Room</label>
          <select
            className="field-control"
            id="roomId"
            name="roomId"
            onChange={handleChange}
            value={form.roomId}
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomName} — {room.location || "No location"} ({room.capacity} seats)
              </option>
            ))}
          </select>
        </div>

        <div className="booking-form__grid">
          <div className="field-group">
            <label htmlFor="startDateTime">Start Date &amp; Time</label>
            <input
              className="field-control"
              id="startDateTime"
              min={new Date().toISOString().slice(0, 16)}
              name="startDateTime"
              onChange={handleChange}
              type="datetime-local"
              value={form.startDateTime}
            />
          </div>

          <div className="field-group">
            <label htmlFor="endDateTime">End Date &amp; Time</label>
            <input
              className="field-control"
              id="endDateTime"
              min={form.startDateTime || new Date().toISOString().slice(0, 16)}
              name="endDateTime"
              onChange={handleChange}
              type="datetime-local"
              value={form.endDateTime}
            />
          </div>
        </div>

        <div className="booking-actions">
          <p
            className={`booking-message${status.type ? ` booking-message--${status.type}` : ""}`}
          >
            {status.message || "Bookings sync with the dashboard after success."}
          </p>

          <button className="book-button" disabled={submitting} type="submit">
            {submitting ? "Saving..." : "Book Room"}
          </button>
        </div>
      </form>
    </section>
  );
}
