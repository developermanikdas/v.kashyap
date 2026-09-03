/**
 * Dynamic API Base and Backend URL Configuration
 * Seamlessly adapts across local dev, LAN / mobile testing, and public production deployment.
 */
export const getApiBase = () => {
  // 1. Explicitly configured Environment Variable
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL.trim();
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      // If environment points to localhost but user is accessing via LAN IP on mobile
      if (host !== "localhost" && host !== "127.0.0.1" && /^(http:\/\/)?(localhost|127\.0\.0\.1)/i.test(envUrl)) {
        return envUrl.replace(/localhost|127\.0\.0\.1/gi, host);
      }
    }
    return envUrl;
  }

  // 2. Browser Environment Fallbacks
  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;

    // Public Domain (e.g. yourdomain.com, vercel.app, netlify.app, render.com)
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      // If it's a private LAN IP (e.g. 192.168.x.x, 10.x.x.x) during local testing
      if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname)) {
        return `http://${hostname}:5000/api/v1`;
      }
      // Standard public domain deployment using reverse proxy or same-origin API
      return `${origin}/api/v1`;
    }
  }

  // 3. Local Development Default
  return "http://localhost:5000/api/v1";
};

export const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    const envUrl = import.meta.env.VITE_BACKEND_URL.trim();
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host !== "localhost" && host !== "127.0.0.1" && /^(http:\/\/)?(localhost|127\.0\.0\.1)/i.test(envUrl)) {
        return envUrl.replace(/localhost|127\.0\.0\.1/gi, host);
      }
    }
    return envUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname)) {
        return `http://${hostname}:5000`;
      }
      return origin;
    }
  }

  return "http://localhost:5000";
};

export const API_BASE = getApiBase();
export const BACKEND_URL = getBackendUrl();

export default API_BASE;
