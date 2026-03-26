const sections = [
  {
    title: "Dashboard",
    description: "Live workspace overview",
    active: true,
  },
  {
    title: "Rooms",
    description: "Capacity and location details",
  },
  {
    title: "Bookings",
    description: "Create and track reservations",
  },
  {
    title: "Analytics",
    description: "Usage insights and trends",
  },
];

function formatRole(role) {
  if (!role) {
    return "Workspace member";
  }

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export default function Sidebar({ currentUser, onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar__eyebrow">Workspace Suite</p>
        <h2 className="sidebar__title">Book smarter, meet faster.</h2>
        <p className="sidebar__copy">
          A React dashboard connected to the Spring Boot API for room management,
          bookings, and analytics.
        </p>
      </div>

      <div className="sidebar__nav">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`sidebar__item${
              section.active ? " sidebar__item--active" : ""
            }`}
          >
            <strong>{section.title}</strong>
            <span>{section.description}</span>
          </div>
        ))}
      </div>

      <div className="sidebar__footer">
        <strong>{currentUser?.name || "Signed in"}</strong>
        <span>{currentUser?.email || "Connected to the workspace app"}</span>
        <span className="sidebar__role">{formatRole(currentUser?.role)}</span>
        <button className="sidebar__logout" onClick={onLogout} type="button">
          Log Out
        </button>
      </div>
    </aside>
  );
}
