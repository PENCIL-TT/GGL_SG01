export interface ContactPageRecord {
  id?: number;
  country_code: string;
  title: string;
  subtitle: string;
  email_recipient: string;
  phone: string;
  address: string;
  map_iframe_url: string;
  updated_at?: string;
}

const API_BASE = "/api/contact-page-content";

export async function fetchContactPageRecords(): Promise<ContactPageRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch contact page records");
  }
  return response.json();
}

export async function fetchContactPageByCountry(countryCode: string): Promise<ContactPageRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch contact page for ${countryCode}`);
  }
  return response.json();
}

export async function updateContactPageRecord(
  countryCode: string,
  payload: Omit<ContactPageRecord, "id" | "country_code" | "updated_at">
): Promise<ContactPageRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update contact page for ${countryCode}`);
  }
  return response.json();
}
