import { useEffect, useState } from "react";
import Analytics from "./Analytics";
import BookingForm from "./BookingForm";
import Rooms from "./Rooms";
import Sidebar from "./Sidebar";
import API from "../services/api";

function getMostUsedRoomLabel(roomId, rooms) {
  if (!roomId) {
    return "No bookings yet";
  }

  const room = rooms.find((item) => item.id === roomId);
  return room ? room.roomName : `Room ${roomId}`;
}

export default function Dashboard({ currentUser, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [roomsResponse, analyticsResponse] = await Promise.all([
          API.get("/rooms"),
          API.get("/analytics"),
        ]);

        if (!active) {
          return;
        }

        setRooms(roomsResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError.response?.data?.message ||
            "Unable to connect to the workspace API."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [refreshCounter]);

  const totalCapacity = rooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0),
    0
  );

  const mostUsedRoom = getMostUsedRoomLabel(analytics?.mostUsedRoom, rooms);

  const stats = [
    {
      label: "Total Rooms",
      value: rooms.length,
      hint: "Live inventory from the backend",
    },
    {
      label: "Seats Available",
      value: totalCapacity,
      hint: "Combined room capacity",
    },
    {
      label: "Bookings",
      value: analytics?.totalBookings ?? 0,
      hint: "Current booking records",
    },
    {
      label: "Most Used Room",
      value: mostUsedRoom,
      hint: "Top room by booking volume",
    },
  ];

  return (
    <div className="dashboard-shell">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="dashboard-main">
        <section className="hero-card">
          <p className="hero-card__eyebrow">React Workspace Dashboard</p>
          <h1>
            Welcome back, {currentUser?.name || "workspace teammate"}.
          </h1>
          <p>
            This frontend reads room inventory, creates bookings for your
            account, and visualizes usage analytics from the existing backend so
            the whole stack feels like a real product workflow.
          </p>
        </section>

        {error ? (
          <div className="error-state" style={{ marginTop: "24px" }}>
            {error}
          </div>
        ) : null}

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <p className="stat-card__label">{stat.label}</p>
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__hint">{stat.hint}</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <Rooms error={error} loading={loading} rooms={rooms} />
          <BookingForm
            currentUser={currentUser}
            onBookingSuccess={() => setRefreshCounter((count) => count + 1)}
            rooms={rooms}
          />
        </section>

        <Analytics
          analytics={analytics}
          error={error}
          loading={loading}
          rooms={rooms}
        />
      </main>
    </div>
  );
}
