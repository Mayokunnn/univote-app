export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ROUTES = {
  BASE: API_BASE_URL,
  ELECTION: `${API_BASE_URL}/api/election`,
  USER: {
    BASE: `${API_BASE_URL}/api/user`,
    REGISTER: `${API_BASE_URL}/api/user/register`,
    GET: (address: string) => `${API_BASE_URL}/api/user/${address}`,
  },
} as const;
