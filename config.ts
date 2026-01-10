/**
 * Client Configuration
 * Centralized config for PUBLIC client-side values only
 * 
 * ⚠️ WARNING: This file is bundled and exposed to the browser!
 * Never put secrets, API keys, or sensitive data here.
 * 
 * For secrets (like API keys), use Vite's define in vite.config.ts
 * or keep them server-side only.
 */

// Read Vite env variables (available at build/runtime via import.meta.env)
const env = (import.meta as any)?.env || {};

export const config = {
  // Server URL (where the backend API is running)
  serverUrl: env.VITE_SERVER_URL || 'http://localhost:3001',
  
  // WebSocket URL (for PvP connections)
  wsUrl: env.VITE_WS_URL || 'ws://localhost:3001/ws',
} as const;

export default config;
