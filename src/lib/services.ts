export interface ServiceRecord {
  id?: number;
  country_code: string;
  service_index: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  icon_type: string;
  updated_at?: string;
}

const API_BASE = "/api/services";

export async function fetchServicesRecords(): Promise<ServiceRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch services records");
  }
  return response.json();
}

export async function fetchServicesByCountry(countryCode: string): Promise<ServiceRecord[]> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch services records for ${countryCode}`);
  }
  return response.json();
}

export async function updateServiceRecord(
  countryCode: string,
  serviceIndex: number,
  payload: Omit<ServiceRecord, "id" | "country_code" | "service_index" | "updated_at">
): Promise<ServiceRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}/${serviceIndex}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update service ${serviceIndex} for ${countryCode}`);
  }
  return response.json();
}
