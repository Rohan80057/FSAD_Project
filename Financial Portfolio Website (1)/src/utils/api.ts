import { authService } from './auth';

const API_BASE_URL = 'http://localhost:8088/api';

/**
 * Custom fetch wrapper that automatically attaches the user's Supabase JWT
 * to the Authorization header, securely authenticating with the Spring Boot backend.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const session = await authService.getSession();
    const token = session?.access_token;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && !authService.isDevMode() ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        let response = await fetch(url, { ...options, headers });

        // If request fails with 401 and we have an auth header, try one more time WITHOUT it
        // (This handles stale/invalid tokens gracefully)
        if (response.status === 401 && headers.Authorization) {
            console.warn(`Auth failed for ${url}, retrying without token...`);
            const { Authorization, ...headersWithoutAuth } = headers as any;
            response = await fetch(url, { ...options, headers: headersWithoutAuth });
        }

        // Attempt to parse JSON response.
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            throw new Error(
                (data && data.message) || response.statusText || 'API request failed'
            );
        }

        return data;
    } catch (error) {
        console.error(`API Error on ${url}:`, error);
        throw error;
    }
}
