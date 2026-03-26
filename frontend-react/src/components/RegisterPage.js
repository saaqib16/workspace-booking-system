import { useState } from "react";
import API from "../services/api";
import AuthShowcase from "./AuthShowcase";

const initialForm = {
  name: "",
  email: "",
  role: "EMPLOYEE",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage({ onRegistered, onShowLogin }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.role ||
      !form.password ||
      !form.confirmPassword
    ) {
      setStatus({
        type: "error",
        message: "Complete every field before creating your account.",
      });
      return;
    }

    if (form.password.length < 6) {
      setStatus({
        type: "error",
        message: "Choose a password with at least 6 characters.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({
        type: "error",
        message: "Password and confirm password must match.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (onRegistered) {
        onRegistered({
          email: form.email,
          message: "Registration successful. Sign in with your new account.",
          type: "success",
        });
      }
    } catch (error) {
      const responseData = error.response?.data;
      const validationMessage =
        responseData?.message ||
        Object.values(responseData || {})[0];

      setStatus({
        type: "error",
        message:
          validationMessage ||
          "Unable to create the account right now. Please check the API.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <AuthShowcase
        copy="Create an account that fits the dashboard experience, then move straight into room discovery, scheduling, and analytics."
        title="Set up your workspace access in one smooth step."
      />

      <section className="login-panel">
        <div className="login-panel__header">
          <p className="hero-card__eyebrow">Create Account</p>
          <h2 className="login-panel__title">Register for workspace access</h2>
          <p className="login-panel__copy">
            This form sends a JSON payload to `/api/auth/register` on the Spring
            Boot backend.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Full Name</label>
            <input
              autoComplete="name"
              className="field-control"
              id="name"
              name="name"
              onChange={handleChange}
              placeholder="Your full name"
              type="text"
              value={form.name}
            />
          </div>

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
            <label htmlFor="role">Role</label>
            <select
              className="field-control"
              id="role"
              name="role"
              onChange={handleChange}
              value={form.role}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="auth-form-grid">
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                autoComplete="new-password"
                className="field-control"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Create a password"
                type="password"
                value={form.password}
              />
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                autoComplete="new-password"
                className="field-control"
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Repeat your password"
                type="password"
                value={form.confirmPassword}
              />
            </div>
          </div>

          <div className="login-panel__note">
            <strong>API check</strong>
            <span>
              The backend already exposes `POST /api/auth/register` and expects
              `name`, `email`, `password`, and `role` in the request body.
            </span>
          </div>

          {status.message ? (
            <div className={`inline-status inline-status--${status.type || "info"}`}>
              {status.message}
            </div>
          ) : null}

          <button className="login-button" disabled={submitting} type="submit">
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="auth-switch">
            <span>Already have an account?</span>
            <button
              className="auth-switch__button"
              onClick={onShowLogin}
              type="button"
            >
              Back to sign in
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
