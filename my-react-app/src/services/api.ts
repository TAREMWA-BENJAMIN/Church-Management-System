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

export async function fetchUsers() {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function fetchUsersByRole(roles: string[]) {
  // Encode each role individually but keep the comma separator unencoded so Laravel can split on it
  const roleParam = roles.map(r => encodeURIComponent(r)).join(',');
  const response = await fetch(`${API_BASE_URL}/users?role=${roleParam}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users by role');
  }
  return response.json();
}

export async function createUser(data: any) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
}

export async function updateUser(id: number, data: any) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
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
