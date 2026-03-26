import { useEffect, useState } from "react";
import API from "../services/api";
import AuthShowcase from "./AuthShowcase";
import { getApiErrorMessage } from "../utils/apiError";

export default function LoginPage({
  initialEmail = "",
  notice,
  onLogin,
  onShowRegister,
}) {
  const [form, setForm] = useState({
    email: initialEmail,
    password: "",
  });
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      email: initialEmail || current.email,
    }));
  }, [initialEmail]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setStatus({
        type: "error",
        message: "Enter both email and password to continue.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      const response = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (onLogin) {
        onLogin(response.data);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Unable to sign in right now. Please check the API and your credentials."
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <AuthShowcase
        copy="Sign in to access a booking dashboard designed for quick room reservations, cleaner planning, and live operational insight."
        title="Walk into a calmer booking workflow."
      />

      <section className="login-panel">
        <div className="login-panel__header">
          <p className="hero-card__eyebrow">Secure Access</p>
          <h2 className="login-panel__title">Sign in to your dashboard</h2>
          <p className="login-panel__copy">
            Use a registered account from the Spring Boot backend to continue.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              autoComplete="email"
              className="field-control"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="you@company.com"
              type="email"
              value={form.email}
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              className="field-control"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              type="password"
              value={form.password}
            />
          </div>

          <div className="login-panel__note">
            <strong>Tip</strong>
            <span>
              If login fails, make sure the backend is running and the user has
              already been registered in the database.
            </span>
          </div>

          {status.message || notice?.message ? (
            <div
              className={`inline-status inline-status--${
                status.type || notice?.type || "info"
              }`}
            >
              {status.message || notice?.message}
            </div>
          ) : null}

          <button className="login-button" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Enter Workspace"}
          </button>

          <div className="auth-switch">
            <span>New here?</span>
            <button
              className="auth-switch__button"
              onClick={onShowRegister}
              type="button"
            >
              Create an account
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
