// Global Configuration File
// This ensures that the frontend can easily communicate with either the local backend or the production backend.

window.APP_CONFIG = {
    // If the frontend is hosted on Vercel, replace this URL with your deployed backend URL (e.g., Render, Railway, AWS).
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? "http://localhost:8080/api" 
        : "https://your-production-backend-url.com/api"
};
