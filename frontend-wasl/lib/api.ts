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

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      result?.message || `Erreur ${res.status} lors de la création de la mission`
    );
  }

  return result;
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

// UPDATE trip
export async function updateTrip(id: number, data: any) {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Impossible de modifier la mission");
  }

  return res.json();
}

// CREATE Facture //
export async function createInvoice(data: {
  startDate: string;
  endDate: string;
  tripIds: number[];
}) {
  const res = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Impossible de créer la facture");
  }

  return result;
}

// GET Factures //
export async function getInvoices() {
  const res = await fetch(`${API_URL}/invoices`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les factures");
  }

  return res.json();
}

export async function getInvoicesSummary() {
  const res = await fetch(`${API_URL}/invoices/summary`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de charger le résumé de facturation");
  }

  return res.json();
}

export async function updateInvoiceStatus(id: number, status: string) {
  const res = await fetch(`${API_URL}/invoices/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Impossible de mettre à jour le statut de la facture");
  }

  return res.json();
}

export async function deleteInvoice(id: number) {
  const res = await fetch(`${API_URL}/invoices/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de supprimer la facture");
  }

  return res.json();
}

// PRICING 

export async function getPricing() {
  const res = await fetch(`${API_URL}/pricing`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les tarifs");
  }

  return res.json();
}

export async function createPricing(data: {
  departureSite: string;
  arrivalSite: string;
  amountHt: number;
}) {
  const res = await fetch(`${API_URL}/pricing`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Impossible de créer le tarif");
  }

  return result;
}

export async function deletePricing(id: number) {
  const res = await fetch(`${API_URL}/pricing/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Impossible de supprimer le tarif");
  }

  return result;
}