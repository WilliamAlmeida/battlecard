/**
 * PvP Lobby Service
 * Fetches server `/stats` endpoint and exposes a simple polling subscribe helper.
 */
import { config } from '../config';

export interface LobbyStats {
  queueSize: number;
  activeGames: number;
  uptime?: number;
}

const defaultFetchInterval = 5000; // ms

export async function fetchLobbyStats(): Promise<LobbyStats> {
  const url = `${config.serverUrl}/stats`;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch lobby stats: ${res.status}`);
  }
  
  const data = await res.json();
  return {
    queueSize: data.queueSize ?? data.queue ?? 0,
    activeGames: data.activeGames ?? data.games ?? 0,
    uptime: data.uptime,
  };
}

export function subscribeLobbyStats(cb: (s: LobbyStats) => void, interval = defaultFetchInterval) {
  let stopped = false;

  const run = async () => {
    if (stopped) return;
    try {
      const stats = await fetchLobbyStats();
      cb(stats);
    } catch (err) {
      // ignore - don't spam console in production
      console.warn('[pvpLobbyService] fetch error', err);
    }
    if (!stopped) setTimeout(run, interval);
  };

  void run();

  return () => {
    stopped = true;
  };
}

export default { fetchLobbyStats, subscribeLobbyStats };
