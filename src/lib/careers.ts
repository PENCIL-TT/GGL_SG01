export interface CareersPageSettings {
  id?: number;
  country_code: string;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  why_join_title: string;
  why_join_description: string;
  opportunities_title: string;
  opportunities_description: string;
  opportunities_status: string;
  cta_title: string;
  cta_subtitle: string;
  cta_btn1_label: string;
  cta_btn2_label: string;
  updated_at?: string;
}

export async function fetchCareersPageSettings(countryCode: string): Promise<CareersPageSettings> {
  const response = await fetch(`/api/careers-page/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch Careers page settings for ${countryCode}`);
  }
  return response.json();
}

export async function updateCareersPageSettings(
  countryCode: string,
  payload: Omit<CareersPageSettings, "id" | "country_code" | "updated_at">
): Promise<CareersPageSettings> {
  const response = await fetch(`/api/careers-page/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update Careers page settings for ${countryCode}`);
  }
  return response.json();
}
