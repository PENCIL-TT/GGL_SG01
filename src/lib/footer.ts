export interface FooterOffice {
  id?: number;
  country_code: string;
  office_index: number;
  title: string;
  address: string;
  phone?: string;
  email?: string;
  updated_at?: string;
}

export interface FooterGeneral {
  id?: number;
  about_text: string;
  facebook_url?: string;
  linkedin_url?: string;
  updated_at?: string;
}

export async function fetchFooterOffices(): Promise<FooterOffice[]> {
  const response = await fetch("/api/footer/offices");
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch footer office records");
  }
  return response.json();
}

export async function updateFooterOffice(
  countryCode: string,
  officeIndex: number,
  payload: Omit<FooterOffice, "id" | "country_code" | "office_index" | "updated_at">
): Promise<FooterOffice> {
  const response = await fetch(`/api/footer/offices/${countryCode.toUpperCase()}/${officeIndex}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update footer office ${officeIndex} for ${countryCode}`);
  }
  return response.json();
}

export async function fetchFooterGeneral(): Promise<FooterGeneral> {
  const response = await fetch("/api/footer/general");
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch general footer settings");
  }
  return response.json();
}

export async function updateFooterGeneral(
  payload: Omit<FooterGeneral, "id" | "updated_at">
): Promise<FooterGeneral> {
  const response = await fetch("/api/footer/general", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to update general footer settings");
  }
  return response.json();
}
