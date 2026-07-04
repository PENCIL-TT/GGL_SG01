const API_BASE_URL = "/api/service-details";

export interface ServiceDetailsPageSettings {
  id?: number;
  country_code: string;
  service_slug: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  section1_title: string | null;
  section1_content: string | null;
  section1_image_url: string | null;
  features_title: string | null;
  features_list: string[] | null;
  cta_title: string | null;
  cta_button_text: string | null;
  cta_button_link: string | null;
  updated_at?: string;
}

export async function fetchServiceDetailsPageSettings(countryCode: string, serviceSlug: string): Promise<ServiceDetailsPageSettings> {
  const response = await fetch(`${API_BASE_URL}/${countryCode.toUpperCase()}/${serviceSlug}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch service details page settings for ${countryCode} - ${serviceSlug}`);
  }
  return response.json();
}

export async function updateServiceDetailsPageSettings(
  countryCode: string,
  serviceSlug: string,
  payload: Omit<ServiceDetailsPageSettings, "id" | "country_code" | "service_slug" | "updated_at">
): Promise<ServiceDetailsPageSettings> {
  const response = await fetch(`${API_BASE_URL}/${countryCode.toUpperCase()}/${serviceSlug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update service details page settings for ${countryCode} - ${serviceSlug}`);
  }
  return response.json();
}
