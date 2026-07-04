export interface AboutUsRecord {
  id?: number;
  country_code: string;
  title: string;
  content_paragraph_1: string;
  content_paragraph_2: string;
  image_url: string;
  button_text: string;
  learn_more_path: string;
  updated_at?: string;
}

const API_BASE = "/api/about-us";

export async function fetchAboutUsRecords(): Promise<AboutUsRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch About Us records");
  }
  return response.json();
}

export async function fetchAboutUsRecord(countryCode: string): Promise<AboutUsRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch About Us record for ${countryCode}`);
  }
  return response.json();
}

export async function updateAboutUsRecord(
  countryCode: string,
  payload: Omit<AboutUsRecord, "id" | "country_code" | "updated_at">
): Promise<AboutUsRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update About Us record for ${countryCode}`);
  }
  return response.json();
}
