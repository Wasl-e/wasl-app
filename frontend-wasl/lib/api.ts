import { getToken } from "./session";

const API_URL = "http://localhost:3001";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET all trips
export async function getTrips() {
  const res = await fetch(`${API_URL}/trips`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les missions");
  }

  return res.json();
}

// GET one trip
export async function getTrip(id: number) {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de charger la mission");
  }

  return res.json();
}

// POST create trip
export async function createTrip(data: any) {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Impossible de créer la mission");
  }

  return res.json();
}

// PATCH update status
export async function updateTripStatus(id: number, status: string) {
  const res = await fetch(`${API_URL}/trips/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Impossible de mettre à jour le statut");
  }

  return res.json();
}

// DELETE trip
export async function deleteTrip(id: number) {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de supprimer la mission");
  }

  return res.json();
}