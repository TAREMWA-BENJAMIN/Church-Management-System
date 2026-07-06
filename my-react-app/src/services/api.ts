export const API_BASE_URL = 'http://localhost:8000/api';

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export function authHeaders(customHeaders: any = {}) {
  const token = getAuthToken();
  return {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}

export async function fetchCommunications(entityType: string, entityId: number, tab: 'inbox' | 'sent') {
  const url = `${API_BASE_URL}/communications?entity_type=${encodeURIComponent(entityType)}&entity_id=${entityId}&tab=${tab}`;
  const response = await fetch(url, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch communications');
  }
  return response.json();
}

export async function sendCommunication(data: any) {
  const response = await fetch(`${API_BASE_URL}/communications`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to send communication');
  }
  return response.json();
}

export async function markAsRead(id: number) {
  const response = await fetch(`${API_BASE_URL}/communications/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to mark communication as read');
  }
  return response.json();
}

export async function fetchDirectory() {
  const [diocesesRes, archdeaconriesRes, parishesRes] = await Promise.all([
    fetch(`${API_BASE_URL}/directory/dioceses`, { headers: authHeaders() }),
    fetch(`${API_BASE_URL}/directory/archdeaconries`, { headers: authHeaders() }),
    fetch(`${API_BASE_URL}/directory/parishes`, { headers: authHeaders() }),
  ]);

  if (!diocesesRes.ok || !archdeaconriesRes.ok || !parishesRes.ok) {
    throw new Error('Failed to fetch directory');
  }

  const dioceses = await diocesesRes.json();
  const archdeaconries = await archdeaconriesRes.json();
  const parishes = await parishesRes.json();

  return { dioceses, archdeaconries, parishes };
}
