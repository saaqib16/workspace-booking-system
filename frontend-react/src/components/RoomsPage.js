import { useEffect, useState } from "react";

function getExperienceLabel(capacity) {
  if (capacity >= 16) {
    return "Town hall energy";
  }

  if (capacity >= 10) {
    return "Workshop friendly";
  }

  if (capacity >= 6) {
    return "Team huddle ready";
  }

  return "Focus session fit";
}

function getPlanningNote(room) {
  if (room.capacity >= 16) {
    return "Best suited for cross-functional reviews, training, or larger planning sessions.";
  }

  if (room.capacity >= 10) {
    return "A strong pick for sprint reviews, retros, and project workshops.";
  }

  if (room.capacity >= 6) {
    return "Comfortable for recurring team syncs and weekly status meetings.";
  }

  return "Ideal for interviews, 1:1s, or small collaboration bursts.";
}

export default function RoomsPage({
  rooms,
  loading,
  error,
  onShowManageRooms,
}) {
  const [filters, setFilters] = useState({
    search: "",
    location: "ALL",
    minCapacity: "",
  });
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const locations = Array.from(
    new Set(rooms.map((room) => room.location?.trim()).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right));

  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch =
        !filters.search ||
        room.roomName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.location?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation =
        filters.location === "ALL" || room.location?.trim() === filters.location;
      const minimumCapacity = Number(filters.minCapacity || 0);
      const matchesCapacity = Number(room.capacity || 0) >= minimumCapacity;

      return matchesSearch && matchesLocation && matchesCapacity;
    })
    .sort((left, right) => {
      if (right.capacity !== left.capacity) {
        return right.capacity - left.capacity;
      }

      return left.roomName.localeCompare(right.roomName);
    });

  useEffect(() => {
    if (filteredRooms.length === 0) {
      setSelectedRoomId(null);
      return;
    }

    const hasSelectedRoom = filteredRooms.some(
      (room) => String(room.id) === String(selectedRoomId)
    );

    if (!hasSelectedRoom) {
      setSelectedRoomId(filteredRooms[0].id);
    }
  }, [filteredRooms, selectedRoomId]);

  const selectedRoom =
    filteredRooms.find((room) => String(room.id) === String(selectedRoomId)) ||
    null;

  const visibleCapacity = filteredRooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0),
    0
  );
  const visibleLocations = Array.from(
    new Set(filteredRooms.map((room) => room.location?.trim()).filter(Boolean))
  ).length;
  const largestRoom = filteredRooms[0] || null;

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-card__eyebrow">Room Explorer</p>
        <h1>Browse every space with a little more context.</h1>
        <p>
          This page turns the raw `/api/rooms` feed into a cleaner directory so
          teammates can scan by capacity, location, and meeting style before
          they book.
        </p>

        <div className="page-actions">
          {onShowManageRooms ? (
            <button
              className="secondary-button"
              onClick={onShowManageRooms}
              type="button"
            >
              Manage inventory
            </button>
          ) : null}
          <span className="badge-soft">{rooms.length} rooms synced</span>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-card__label">Visible Rooms</p>
          <p className="stat-card__value">{filteredRooms.length}</p>
          <p className="stat-card__hint">Filtered spaces that match this view</p>
        </article>

        <article className="stat-card">
          <p className="stat-card__label">Visible Seats</p>
          <p className="stat-card__value">{visibleCapacity}</p>
          <p className="stat-card__hint">Combined capacity across results</p>
        </article>

        <article className="stat-card">
          <p className="stat-card__label">Visible Zones</p>
          <p className="stat-card__value">{visibleLocations}</p>
          <p className="stat-card__hint">Distinct locations in this filtered view</p>
        </article>

        <article className="stat-card">
          <p className="stat-card__label">Largest Space</p>
          <p className="stat-card__value">
            {largestRoom ? `${largestRoom.capacity}` : "0"}
          </p>
          <p className="stat-card__hint">
            {largestRoom
              ? `${largestRoom.roomName} • ${largestRoom.capacity} seats`
              : "No rooms yet"}
          </p>
        </article>
      </section>

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Find the right room faster</h2>
            <p className="panel-card__subtitle">
              Filter by name, location, or the minimum number of seats you need.
            </p>
          </div>
        </div>

        <div className="room-filter-grid">
          <div className="field-group">
            <label htmlFor="search">Search</label>
            <input
              className="field-control"
              id="search"
              name="search"
              onChange={handleFilterChange}
              placeholder="Try 'North Wing' or 'Strategy'"
              type="text"
              value={filters.search}
            />
          </div>

          <div className="field-group">
            <label htmlFor="location">Location</label>
            <select
              className="field-control"
              id="location"
              name="location"
              onChange={handleFilterChange}
              value={filters.location}
            >
              <option value="ALL">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="minCapacity">Minimum Seats</label>
            <input
              className="field-control"
              id="minCapacity"
              min="0"
              name="minCapacity"
              onChange={handleFilterChange}
              placeholder="0"
              type="number"
              value={filters.minCapacity}
            />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Rooms</h2>
              <p className="panel-card__subtitle">
                Loading the room directory from the backend...
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2 className="panel-card__title">Rooms</h2>
              <p className="panel-card__subtitle">
                The directory could not be loaded right now.
              </p>
            </div>
          </div>
          <div className="error-state">{error}</div>
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="room-directory-grid">
          <section className="panel-card">
            <div className="panel-card__header">
              <div>
                <h2 className="panel-card__title">Directory</h2>
                <p className="panel-card__subtitle">
                  Select a room to see its profile and best-fit guidance.
                </p>
              </div>
              <span className="badge-soft">{filteredRooms.length} matches</span>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="empty-state">
                No rooms match those filters yet. Try widening the search or
                adding new inventory.
              </div>
            ) : (
              <div className="room-browser-list">
                {filteredRooms.map((room) => (
                  <button
                    className={`room-browser-card${
                      String(room.id) === String(selectedRoomId)
                        ? " room-browser-card--active"
                        : ""
                    }`}
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    type="button"
                  >
                    <div className="room-browser-card__top">
                      <div>
                        <h3>{room.roomName}</h3>
                        <p>{room.location || "Location not specified"}</p>
                      </div>
                      <span className="room-pill">{room.capacity} seats</span>
                    </div>
                    <div className="room-browser-card__footer">
                      <span>{getExperienceLabel(room.capacity)}</span>
                      <span>Room #{room.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="panel-card room-detail-panel">
            <div className="panel-card__header">
              <div>
                <h2 className="panel-card__title">Room profile</h2>
                <p className="panel-card__subtitle">
                  A quick read on how each space fits day-to-day collaboration.
                </p>
              </div>
            </div>

            {selectedRoom ? (
              <div className="room-detail-stack">
                <div className="room-detail-hero">
                  <p className="hero-card__eyebrow">Selected space</p>
                  <h3>{selectedRoom.roomName}</h3>
                  <p>{getPlanningNote(selectedRoom)}</p>
                </div>

                <div className="room-fact-grid">
                  <article className="room-fact-card">
                    <span>Capacity</span>
                    <strong>{selectedRoom.capacity} seats</strong>
                  </article>

                  <article className="room-fact-card">
                    <span>Location</span>
                    <strong>{selectedRoom.location || "Not provided"}</strong>
                  </article>

                  <article className="room-fact-card">
                    <span>Best for</span>
                    <strong>{getExperienceLabel(selectedRoom.capacity)}</strong>
                  </article>

                  <article className="room-fact-card">
                    <span>Reference</span>
                    <strong>Room #{selectedRoom.id}</strong>
                  </article>
                </div>

                <div className="room-detail-note">
                  <strong>Planning cue</strong>
                  <p>
                    Pair this room with the Bookings page when you already know
                    the date and time, or switch to Manage Rooms if the
                    inventory details need to be updated.
                  </p>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                Select a room from the directory to see its details here.
              </div>
            )}
          </section>
        </section>
      ) : null}
    </div>
  );
}
