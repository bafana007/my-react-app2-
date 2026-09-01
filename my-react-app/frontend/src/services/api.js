const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export async function apiGet(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`)
  if (!response.ok) {
    const message = await extractError(response)
    throw new Error(message || `GET ${endpoint} failed: ${response.status}`)
  }
  return response.json()
}

export async function apiPost(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const message = await extractError(response)
    throw new Error(message || `POST ${endpoint} failed: ${response.status}`)
  }
  return response.json()
}

async function extractError(response) {
  try {
    const data = await response.json()
    return data?.error
  } catch {
    return null
  }
}