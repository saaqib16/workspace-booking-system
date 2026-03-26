import { useState } from "react";
import API from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const initialForm = {
  roomId: "",
  date: "",
  startTime: "",
  endTime: "",
};

function withSeconds(timeValue) {
  if (!timeValue) {
    return "";
  }

  return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
}

export default function BookingForm({ currentUser, rooms, onBookingSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.roomId || !form.date || !form.startTime || !form.endTime) {
      setStatus({
        type: "error",
        message: "Fill in all booking fields before submitting.",
      });
      return;
    }

    if (form.startTime >= form.endTime) {
      setStatus({
        type: "error",
        message: "Start time must be earlier than end time.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      await API.post("/bookings", {
        userId: currentUser?.id || 1,
        roomId: Number(form.roomId),
        date: form.date,
        startTime: withSeconds(form.startTime),
        endTime: withSeconds(form.endTime),
      });

      setStatus({
        type: "success",
        message: "Booking created successfully.",
      });
      setForm(initialForm);

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Booking failed. Please try another room or time slot."
        ),
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
          <p className="panel-card__subtitle">
            Submit a reservation to `/api/bookings`.
          </p>
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
                {room.roomName} ({room.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="booking-form__grid">
          <div className="field-group">
            <label htmlFor="date">Date</label>
            <input
              className="field-control"
              id="date"
              min={new Date().toISOString().split("T")[0]}
              name="date"
              onChange={handleChange}
              type="date"
              value={form.date}
            />
          </div>

          <div className="field-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              className="field-control"
              id="startTime"
              name="startTime"
              onChange={handleChange}
              type="time"
              value={form.startTime}
            />
          </div>

          <div className="field-group">
            <label htmlFor="endTime">End Time</label>
            <input
              className="field-control"
              id="endTime"
              name="endTime"
              onChange={handleChange}
              type="time"
              value={form.endTime}
            />
          </div>
        </div>

        <div className="booking-actions">
          <p
            className={`booking-message${
              status.type ? ` booking-message--${status.type}` : ""
            }`}
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
