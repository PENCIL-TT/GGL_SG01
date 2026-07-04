export interface NavBarSettings {
  id?: number;
  home_label: string;
  info_label: string;
  about_label: string;
  careers_label: string;
  services_label: string;
  global_presence_label: string;
  contact_label: string;
  updated_at?: string;
}

export interface AboutUsPageSettings {
  id?: number;
  country_code: string;
  hero_title: string;
  hero_subtitle?: string;
  about_title: string;
  paragraph_1: string;
  paragraph_2: string;
  paragraph_3: string;
  paragraph_4?: string | null;
  image_url: string;
  floating_card_title?: string;
  floating_card_subtitle?: string;
  final_paragraph?: string;
  updated_at?: string;
}

export async function fetchNavBarSettings(): Promise<NavBarSettings> {
  const response = await fetch("/api/navigation-bar");
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch navigation bar settings");
  }
  return response.json();
}

export async function updateNavBarSettings(
  payload: Omit<NavBarSettings, "id" | "updated_at">
): Promise<NavBarSettings> {
  const response = await fetch("/api/navigation-bar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to update navigation bar settings");
  }
  return response.json();
}

export async function fetchAboutUsPageSettings(countryCode: string): Promise<AboutUsPageSettings> {
  const response = await fetch(`/api/about-us-page/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch About Us page settings for ${countryCode}`);
  }
  return response.json();
}

export async function updateAboutUsPageSettings(
  countryCode: string,
  payload: Omit<AboutUsPageSettings, "id" | "country_code" | "updated_at">
): Promise<AboutUsPageSettings> {
  const response = await fetch(`/api/about-us-page/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update About Us page settings for ${countryCode}`);
  }
  return response.json();
}
