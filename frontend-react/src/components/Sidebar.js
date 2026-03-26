function getSections(canManageRooms) {
  const sections = [
    {
      key: "dashboard",
      title: "Dashboard",
      description: "Live workspace overview",
    },
    {
      key: "rooms",
      title: "Rooms",
      description: "Explore capacity and location details",
    },
    {
      key: "bookings",
      title: "Bookings",
      description: "Create reservations with your account",
    },
    {
      key: "analytics",
      title: "Analytics",
      description: "Usage insights and room trends",
    },
  ];

  if (canManageRooms) {
    sections.splice(2, 0, {
      key: "manageRooms",
      title: "Manage Rooms",
      description: "Add and remove inventory",
    });
  }

  return sections;
}

function formatRole(role) {
  if (!role) {
    return "Workspace member";
  }

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export default function Sidebar({
  currentUser,
  activeView,
  onNavigate,
  onLogout,
}) {
  const sections = getSections(currentUser?.role === "ADMIN");

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
          <button
            key={section.title}
            className={`sidebar__item${
              activeView === section.key ? " sidebar__item--active" : ""
            }`}
            onClick={() => onNavigate?.(section.key)}
            type="button"
          >
            <strong>{section.title}</strong>
            <span>{section.description}</span>
          </button>
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
