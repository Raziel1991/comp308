const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.msg || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export const api = {
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request("/auth/me")
  },
  games: {
    list: (q = "") => request(`/games${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    myCollection: () => request("/games/my-collection"),
    add: (gameId) => request("/games/add", { method: "POST", body: JSON.stringify({ gameId }) }),
    remove: (gameId) => request(`/games/remove/${gameId}`, { method: "DELETE" })
  }
};
