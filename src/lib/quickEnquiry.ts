export interface QuickEnquiryRecord {
  id?: number;
  country_code: string;
  title: string;
  subtitle: string;
  email_recipient: string;
  success_message: string;
  error_message: string;
  updated_at?: string;
}

const API_BASE = "/api/quick-enquiry";

export async function fetchQuickEnquiryRecords(): Promise<QuickEnquiryRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch quick enquiry records");
  }
  return response.json();
}

export async function fetchQuickEnquiryByCountry(countryCode: string): Promise<QuickEnquiryRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to fetch quick enquiry for ${countryCode}`);
  }
  return response.json();
}

export async function updateQuickEnquiryRecord(
  countryCode: string,
  payload: Omit<QuickEnquiryRecord, "id" | "country_code" | "updated_at">
): Promise<QuickEnquiryRecord> {
  const response = await fetch(`${API_BASE}/${countryCode.toUpperCase()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Failed to update quick enquiry for ${countryCode}`);
  }
  return response.json();
}
