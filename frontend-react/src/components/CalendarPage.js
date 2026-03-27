import { useEffect, useState } from "react";
import API from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM – 8 PM

function toMinutesFromMidnight(isoString) {
  const d = new Date(isoString);
  return d.getHours() * 60 + d.getMinutes();
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}

function isSameDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export default function CalendarPage({ rooms }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await API.get("/bookings");
        setBookings(response.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load bookings for the calendar."));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const dayBookings = bookings.filter(
    (b) => isSameDay(b.startDateTime, viewDate) || isSameDay(b.endDateTime, viewDate)
  );

  const PIXELS_PER_HOUR = 60;
  const DAY_START = 8 * 60; // 8:00

  function getRoomName(roomId) {
    const room = rooms.find((r) => String(r.id) === String(roomId));
    return room ? room.roomName : `Room #${roomId}`;
  }

  const shiftDay = (delta) => {
    setViewDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta);
      return d;
    });
  };

  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-card__eyebrow">Availability Calendar</p>
        <h1>See what's booked at a glance.</h1>
        <p>A timeline of all reservations for the selected day across every room.</p>
        <div className="page-actions">
          <button className="secondary-button" onClick={() => shiftDay(-1)} type="button">← Previous</button>
          <span className="badge-soft">{viewDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
          <button className="secondary-button" onClick={() => shiftDay(1)} type="button">Next →</button>
          <button className="secondary-button" onClick={() => { const d = new Date(); d.setHours(0,0,0,0); setViewDate(d); }} type="button">Today</button>
        </div>
      </section>

      {error ? <div className="error-state">{error}</div> : null}

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Timeline — {formatDate(viewDate)}</h2>
            <p className="panel-card__subtitle">{dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""} on this day</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading calendar...</div>
        ) : (
          <div className="calendar-wrapper">
            {/* Hour labels */}
            <div className="calendar-hours">
              {HOURS.map((h) => (
                <div className="calendar-hour-label" key={h} style={{ height: PIXELS_PER_HOUR }}>
                  {h}:00
                </div>
              ))}
            </div>

            {/* Room columns */}
            <div className="calendar-grid">
              {rooms.map((room) => {
                const roomBookings = dayBookings.filter((b) => String(b.roomId) === String(room.id));
                return (
                  <div className="calendar-column" key={room.id}>
                    <div className="calendar-column__header">{room.roomName}</div>
                    <div className="calendar-column__body" style={{ height: HOURS.length * PIXELS_PER_HOUR, position: "relative" }}>
                      {HOURS.map((h) => (
                        <div className="calendar-grid-line" key={h} style={{ top: (h - 8) * PIXELS_PER_HOUR, height: PIXELS_PER_HOUR }} />
                      ))}
                      {roomBookings.map((b) => {
                        const start = Math.max(toMinutesFromMidnight(b.startDateTime), DAY_START);
                        const end = Math.min(toMinutesFromMidnight(b.endDateTime), DAY_START + HOURS.length * 60);
                        const top = ((start - DAY_START) / 60) * PIXELS_PER_HOUR;
                        const height = Math.max(((end - start) / 60) * PIXELS_PER_HOUR, 20);
                        return (
                          <div
                            className="calendar-event"
                            key={b.id}
                            style={{ top, height }}
                            title={`${getRoomName(b.roomId)}: ${new Date(b.startDateTime).toLocaleTimeString("en-IN", { timeStyle: "short" })} – ${new Date(b.endDateTime).toLocaleTimeString("en-IN", { timeStyle: "short" })}`}
                          >
                            <span>{new Date(b.startDateTime).toLocaleTimeString("en-IN", { timeStyle: "short" })}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {rooms.length === 0 && (
                <div className="empty-state">No rooms yet. Add some rooms first.</div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
