const BASE_URL = "https://backapp.preown.store/api/addresses";

function getToken() {
  if (typeof window === "undefined") return null; // guard for SSR
  return localStorage.getItem("jwt"); // adjust key name to match what you actually store
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMyAddresses() {
  const res = await fetch(`${BASE_URL}/my`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Failed to fetch addresses");
  }
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

export async function createAddress(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Failed to create address");
  }
  const json = await res.json();
  return json.data ?? json;
}

export async function deleteAddress(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Failed to delete address");
  }
  return true;
}

export async function updateAddress(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Failed to update address");
  }
  const json = await res.json();
  return json.data ?? json;
}
