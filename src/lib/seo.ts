export interface SeoRecord {
  id: number;
  path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  extra_meta: Record<string, string> | null;
  created_at?: string;
  updated_at?: string;
}

export interface SeoPayload {
  path: string;
  title?: string;
  description?: string;
  keywords?: string;
  extra_meta?: Record<string, string> | null;
}

const API_BASE = "/api/seo";

export async function fetchSeoRecords(): Promise<SeoRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to fetch SEO records");
  }
  return response.json();
}

export async function fetchSeoRecordByPath(path: string): Promise<SeoRecord | null> {
  const response = await fetch(`${API_BASE}/by-path?path=${encodeURIComponent(path)}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const err = await response.text();
    throw new Error(err || "Failed to fetch SEO record by path");
  }
  return response.json();
}

export async function createSeoRecord(payload: SeoPayload): Promise<SeoRecord> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to create SEO record");
  }
  return response.json();
}

export async function updateSeoRecord(id: number, payload: SeoPayload): Promise<SeoRecord> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to update SEO record");
  }
  return response.json();
}

export async function deleteSeoRecord(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to delete SEO record");
  }
}
