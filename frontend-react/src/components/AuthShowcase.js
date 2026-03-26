const highlights = [
  {
    label: "One dashboard",
    value: "Rooms, bookings, and analytics in one view",
  },
  {
    label: "Faster planning",
    value: "Create reservations without leaving the workspace",
  },
  {
    label: "Team visibility",
    value: "Track usage trends and the most booked rooms",
  },
];

const workflow = [
  "Create your workspace account",
  "Review room availability and capacity",
  "Book confidently and monitor usage trends",
];

export default function AuthShowcase({ copy, title }) {
  return (
    <section className="login-showcase">
      <div className="login-showcase__badge">Workspace Suite</div>

      <h1 className="login-showcase__title">{title}</h1>

      <p className="login-showcase__copy">{copy}</p>

      <div className="login-highlight-grid">
        {highlights.map((highlight) => (
          <article className="login-highlight-card" key={highlight.label}>
            <p className="login-highlight-card__label">{highlight.label}</p>
            <p className="login-highlight-card__value">{highlight.value}</p>
          </article>
        ))}
      </div>

      <div className="login-story-card">
        <p className="login-story-card__eyebrow">Inside the flow</p>
        <div className="login-story-list">
          {workflow.map((step) => (
            <div className="login-story-step" key={step}>
              <span className="login-story-step__dot" />
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
