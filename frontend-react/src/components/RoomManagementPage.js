import { useState } from "react";
import API from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const initialForm = {
  roomName: "",
  capacity: "",
  location: "",
};

export default function RoomManagementPage({
  currentUser,
  rooms,
  loading,
  error,
  onRoomsChanged,
  onShowRooms,
}) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = currentUser?.role === "ADMIN";
  const totalCapacity = rooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0),
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.roomName.trim()) {
      setStatus({
        type: "error",
        message: "Add a room name before saving.",
      });
      return;
    }

    if (!form.capacity || Number(form.capacity) <= 0) {
      setStatus({
        type: "error",
        message: "Capacity should be greater than zero.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      await API.post("/rooms", {
        roomName: form.roomName.trim(),
        capacity: Number(form.capacity),
        location: form.location.trim(),
      });

      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Room added to the inventory.",
      });

      if (onRoomsChanged) {
        onRoomsChanged();
      }
    } catch (requestError) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(
          requestError,
          "Unable to save the room right now."
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Delete ${room.roomName}? This removes it from the shared room inventory.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(room.id);
    setStatus({
      type: "",
      message: "",
    });

    try {
      await API.delete(`/rooms/${room.id}`);
      setStatus({
        type: "success",
        message: `${room.roomName} was removed from the inventory.`,
      });

      if (onRoomsChanged) {
        onRoomsChanged();
      }
    } catch (requestError) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(
          requestError,
          "Unable to delete this room right now."
        ),
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-stack">
        <section className="hero-card">
          <p className="hero-card__eyebrow">Room Management</p>
          <h1>Admin access is required to change room inventory.</h1>
          <p>
            You can still explore available rooms, but creating and deleting
            them is limited to admins in this interface.
          </p>
          {onShowRooms ? (
            <div className="page-actions">
              <button
                className="secondary-button"
                onClick={onShowRooms}
                type="button"
              >
                Back to rooms
              </button>
            </div>
          ) : null}
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-card__eyebrow">Room Management</p>
        <h1>Shape the inventory your team sees.</h1>
        <p>
          Add new spaces, prune outdated ones, and keep the room catalog aligned
          with how the office is actually being used.
        </p>

        <div className="page-actions">
          {onShowRooms ? (
            <button
              className="secondary-button"
              onClick={onShowRooms}
              type="button"
            >
              Back to explorer
            </button>
          ) : null}
          <span className="badge-soft">{rooms.length} rooms in inventory</span>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-card__label">Inventory Count</p>
          <p className="stat-card__value">{rooms.length}</p>
          <p className="stat-card__hint">Rooms currently available to book</p>
        </article>

        <article className="stat-card">
          <p className="stat-card__label">Total Seats</p>
          <p className="stat-card__value">{totalCapacity}</p>
          <p className="stat-card__hint">Combined capacity across all rooms</p>
        </article>

        <article className="stat-card">
          <p className="stat-card__label">Role</p>
          <p className="stat-card__value">Admin</p>
          <p className="stat-card__hint">You can create and remove rooms here</p>
        </article>

        <article className="stat-card">
          <p className="stat-card__label">API Surface</p>
          <p className="stat-card__value">POST/DELETE</p>
          <p className="stat-card__hint">Using the existing `/api/rooms` endpoints</p>
        </article>
      </section>

      <section className="room-management-grid">
        <section className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Add a room</h2>
              <p className="panel-card__subtitle">
                Create a new room record with name, capacity, and an optional
                location label.
              </p>
            </div>
          </div>

          <form className="room-management-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="roomName">Room Name</label>
              <input
                className="field-control"
                id="roomName"
                name="roomName"
                onChange={handleChange}
                placeholder="Atlas Studio"
                type="text"
                value={form.roomName}
              />
            </div>

            <div className="room-management-form__grid">
              <div className="field-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  className="field-control"
                  id="capacity"
                  min="1"
                  name="capacity"
                  onChange={handleChange}
                  placeholder="8"
                  type="number"
                  value={form.capacity}
                />
              </div>

              <div className="field-group">
                <label htmlFor="location">Location</label>
                <input
                  className="field-control"
                  id="location"
                  name="location"
                  onChange={handleChange}
                  placeholder="North Wing"
                  type="text"
                  value={form.location}
                />
              </div>
            </div>

            {status.message ? (
              <div className={`inline-status inline-status--${status.type || "info"}`}>
                {status.message}
              </div>
            ) : (
              <div className="inline-status">
                Inventory changes appear across the dashboard after a successful
                save or delete.
              </div>
            )}

            <button className="book-button" disabled={submitting} type="submit">
              {submitting ? "Saving room..." : "Add Room"}
            </button>
          </form>
        </section>

        <section className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Current inventory</h2>
              <p className="panel-card__subtitle">
                Remove rooms that are no longer available to keep booking clean.
              </p>
            </div>
            <span className="badge-soft">{rooms.length} active</span>
          </div>

          {loading ? (
            <div className="empty-state">Loading room inventory...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              No rooms exist yet. Add the first one from the form.
            </div>
          ) : (
            <div className="inventory-list">
              {rooms.map((room) => (
                <article className="inventory-item" key={room.id}>
                  <div>
                    <h3>{room.roomName}</h3>
                    <p>
                      {room.location || "Location not specified"} • {room.capacity}{" "}
                      seats
                    </p>
                  </div>

                  <button
                    className="danger-button"
                    disabled={deletingId === room.id}
                    onClick={() => handleDelete(room)}
                    type="button"
                  >
                    {deletingId === room.id ? "Deleting..." : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
