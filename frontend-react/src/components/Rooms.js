export default function Rooms({ rooms, loading, error }) {
  if (loading) {
    return (
      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Rooms</h2>
            <p className="panel-card__subtitle">Loading available spaces...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Rooms</h2>
            <p className="panel-card__subtitle">
              A problem occurred while loading the room list.
            </p>
          </div>
        </div>
        <div className="error-state">{error}</div>
      </section>
    );
  }

  return (
    <section className="panel-card">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Rooms</h2>
          <p className="panel-card__subtitle">
            Browse the current inventory coming from `/api/rooms`.
          </p>
        </div>
        <span className="badge-soft">{rooms.length} available</span>
      </div>

      {rooms.length === 0 ? (
        <div className="empty-state">No rooms have been added yet.</div>
      ) : (
        <div className="room-list">
          {rooms.map((room) => (
            <article className="room-item" key={room.id}>
              <div className="room-item__top">
                <div>
                  <h3>{room.roomName}</h3>
                  <p>{room.location || "Location not specified"}</p>
                </div>
                <span className="room-pill">{room.capacity} seats</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
