export interface ServicesPageSettings {
  id?: number;
  country_code: string;
  hero_title: string;
  hero_subtitle: string;
  services_title: string;
  services_description: string;
  why_choose_title: string;
  why_choose_description: string;
  cta_btn_text: string;
  updated_at?: string;
}

export async function fetchServicesPageSettings(countryCode: string): Promise<ServicesPageSettings> {
  const response = await fetch(`/api/services-page/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch Services page settings for ${countryCode}`);
  }
  return response.json();
}

export async function updateServicesPageSettings(
  countryCode: string,
  payload: Omit<ServicesPageSettings, "id" | "country_code" | "updated_at">
): Promise<ServicesPageSettings> {
  const response = await fetch(`/api/services-page/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update Services page settings for ${countryCode}`);
  }
  return response.json();
}
