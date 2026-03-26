import { useEffect, useState } from "react";
import Analytics from "./Analytics";
import BookingForm from "./BookingForm";
import RoomManagementPage from "./RoomManagementPage";
import Rooms from "./Rooms";
import RoomsPage from "./RoomsPage";
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
  const [activeView, setActiveView] = useState("dashboard");
  const [rooms, setRooms] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const isAdmin = currentUser?.role === "ADMIN";

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

  useEffect(() => {
    if (activeView === "manageRooms" && !isAdmin) {
      setActiveView("rooms");
    }
  }, [activeView, isAdmin]);

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

  const handleRefresh = () => {
    setRefreshCounter((count) => count + 1);
  };

  const renderDashboardOverview = () => (
    <>
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

        <div className="page-actions">
          <button
            className="secondary-button"
            onClick={() => setActiveView("rooms")}
            type="button"
          >
            Explore rooms
          </button>
          {isAdmin ? (
            <button
              className="secondary-button"
              onClick={() => setActiveView("manageRooms")}
              type="button"
            >
              Manage rooms
            </button>
          ) : null}
        </div>
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
          onBookingSuccess={handleRefresh}
          rooms={rooms}
        />
      </section>

      <Analytics
        analytics={analytics}
        error={error}
        loading={loading}
        rooms={rooms}
      />
    </>
  );

  const renderBookingsView = () => (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-card__eyebrow">Bookings</p>
        <h1>Reserve a room with a dedicated booking page.</h1>
        <p>
          Pick the right room, choose the date and time, and send the request
          straight to `/api/bookings` without hunting through the overview.
        </p>

        <div className="page-actions">
          <button
            className="secondary-button"
            onClick={() => setActiveView("rooms")}
            type="button"
          >
            Review rooms first
          </button>
          <span className="badge-soft">{rooms.length} rooms ready to book</span>
        </div>
      </section>

      {error ? <div className="error-state">{error}</div> : null}

      <section className="content-grid content-grid--single">
        <BookingForm
          currentUser={currentUser}
          onBookingSuccess={handleRefresh}
          rooms={rooms}
        />
      </section>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-card__eyebrow">Analytics</p>
        <h1>See which spaces are actually carrying the load.</h1>
        <p>
          Booking patterns become easier to spot when analytics has a full page
          to breathe, especially as the room inventory grows.
        </p>

        <div className="page-actions">
          <button
            className="secondary-button"
            onClick={() => setActiveView("rooms")}
            type="button"
          >
            Compare against rooms
          </button>
          <span className="badge-soft">
            {analytics?.totalBookings ?? 0} bookings tracked
          </span>
        </div>
      </section>

      <Analytics
        analytics={analytics}
        error={error}
        loading={loading}
        rooms={rooms}
      />
    </div>
  );

  const renderCurrentView = () => {
    if (activeView === "rooms") {
      return (
        <RoomsPage
          error={error}
          loading={loading}
          onShowManageRooms={isAdmin ? () => setActiveView("manageRooms") : null}
          rooms={rooms}
        />
      );
    }

    if (activeView === "manageRooms") {
      return (
        <RoomManagementPage
          currentUser={currentUser}
          error={error}
          loading={loading}
          onRoomsChanged={handleRefresh}
          onShowRooms={() => setActiveView("rooms")}
          rooms={rooms}
        />
      );
    }

    if (activeView === "bookings") {
      return renderBookingsView();
    }

    if (activeView === "analytics") {
      return renderAnalyticsView();
    }

    return renderDashboardOverview();
  };

  return (
    <div className="dashboard-shell">
      <Sidebar
        activeView={activeView}
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigate={setActiveView}
      />

      <main className="dashboard-main">{renderCurrentView()}</main>
    </div>
  );
}
