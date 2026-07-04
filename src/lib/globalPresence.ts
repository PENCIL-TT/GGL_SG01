export interface GlobalPresenceRecord {
  id?: number;
  country_code: string;
  title: string;
  content_paragraph: string;
  button_text: string;
  link_path: string;
  map_iframe_url?: string;
  updated_at?: string;
}

export interface GlobalPresenceOffice {
  id?: number;
  country_code: string;
  office_country: string;
  city_name: string;
  office_name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  updated_at?: string;
}

const API_BASE = "/api/global-presence";

export async function fetchGlobalPresenceRecords(): Promise<GlobalPresenceRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch global presence records");
  }
  return response.json();
}

export async function fetchGlobalPresenceByCountry(countryCode: string): Promise<GlobalPresenceRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch global presence for ${countryCode}`);
  }
  return response.json();
}

export async function updateGlobalPresenceRecord(
  countryCode: string,
  payload: Omit<GlobalPresenceRecord, "id" | "country_code" | "updated_at">
): Promise<GlobalPresenceRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update global presence for ${countryCode}`);
  }
  return response.json();
}

export async function fetchGlobalPresenceOffices(): Promise<GlobalPresenceOffice[]> {
  const response = await fetch("/api/global-presence-offices");
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch global presence offices");
  }
  return response.json();
}

export async function createGlobalPresenceOffice(office: Omit<GlobalPresenceOffice, "id" | "updated_at">): Promise<void> {
  const response = await fetch("/api/global-presence-offices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(office),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to create office");
  }
}

export async function updateGlobalPresenceOffice(id: number, office: Omit<GlobalPresenceOffice, "id" | "updated_at">): Promise<void> {
  const response = await fetch(`/api/global-presence-offices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(office),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to update office");
  }
}

export async function deleteGlobalPresenceOffice(id: number): Promise<void> {
  const response = await fetch(`/api/global-presence-offices/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to delete office");
  }
}
