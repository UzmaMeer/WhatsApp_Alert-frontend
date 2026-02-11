// 🟢 LIVE PRODUCTION BACKEND (RAILWAY)
const RAILWAY_URL = "https://whatsappalert-backend-production.up.railway.app";

// Detect if you are running locally or on the live site
const isLocalhost = window.location.hostname === "localhost";

/**
 * BACKEND_URL logic:
 * - If on your PC: Uses Ngrok (Update this URL if you restart Ngrok)
 * - If on Firebase: Uses Railway
 */
export const BACKEND_URL = isLocalhost 
    ? "https://snakiest-edward-autochthonously.ngrok-free.dev" 
    : RAILWAY_URL;

console.log(`📡 Frontend is communicating with: ${BACKEND_URL}`);