import { useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

const STORAGE_KEY = "workspace-booking-user";

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function getStoredUser() {
  try {
    const rawUser = window.localStorage.getItem(STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
}

function App() {
  const [authView, setAuthView] = useState("login");
  const [authNotice, setAuthNotice] = useState(null);
  const [currentUser, setCurrentUser] = useState(getStoredUser);

  const handleLogin = (user) => {
    const safeUser = sanitizeUser(user);
    setCurrentUser(safeUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  };

  const handleRegistered = (notice) => {
    setAuthView("login");
    setAuthNotice(notice);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setAuthView("login");
  };

  if (!currentUser) {
    if (authView === "register") {
      return (
        <RegisterPage
          onRegistered={handleRegistered}
          onShowLogin={() => setAuthView("login")}
        />
      );
    }

    return (
      <LoginPage
        initialEmail={authNotice?.email}
        notice={authNotice}
        onLogin={handleLogin}
        onShowRegister={() => {
          setAuthView("register");
          setAuthNotice(null);
        }}
      />
    );
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
