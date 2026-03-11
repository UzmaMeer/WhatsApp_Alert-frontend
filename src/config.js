// 🟢 LIVE PRODUCTION BACKEND (RAILWAY)
const RAILWAY_URL = "https://whatsappalert-backend-production.up.railway.app";

/**
 * BACKEND_URL logic:
 * Humne Ngrok hata diya hai kyunke Backend already Live hai.
 * Ab chahe aap Localhost par hon ya Firebase par, request Railway par hi jayegi.
 */
export const BACKEND_URL = RAILWAY_URL;

console.log(`📡 Frontend is communicating with: ${BACKEND_URL}`);