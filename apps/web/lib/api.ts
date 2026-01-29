const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });
}

export interface AuthResponse {
    message: string;
    token?: string;
    errors?: Array<{ message: string }>;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export async function register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export interface Website {
    id: string;
    url: string;
    userId: string;
    createdAt: string;
    ticks?: WebsiteTick[];
}

export interface WebsiteTick {
    id: string;
    websiteId: string;
    regionId: string;
    responseTimeMs: number;
    status: 'Up' | 'Down' | 'Unknown';
    createdAt: string;
}

export interface CreateWebsiteResponse {
    id?: string;
    message: string;
    errors?: Array<{ message: string }>;
}

export async function createWebsite(url: string): Promise<CreateWebsiteResponse> {
    const response = await fetchWithAuth('/api/website', {
        method: 'POST',
        body: JSON.stringify({ url }),
    });
    return response.json();
}

export interface GetWebsiteResponse {
    id?: string;
    url?: string;
    user_id?: string;
    message?: string;
}

export async function getWebsiteStatus(websiteId: string): Promise<GetWebsiteResponse> {
    const response = await fetchWithAuth(`/api/website/status/${websiteId}`, {
        method: 'GET',
    });
    return response.json();
}

export interface GetWebsitesResponse {
    websites?: Array<{
        id: string;
        url: string;
        createdAt: string;
        ticks: Array<{
            id: string;
            status: 'Up' | 'Down' | 'Unknown';
            responseTimeMs: number;
            createdAt: string;
            region: string;
        }>;
    }>;
    message?: string;
}

export async function getWebsites(): Promise<GetWebsitesResponse> {
    const response = await fetchWithAuth('/api/websites', {
        method: 'GET',
    });
    return response.json();
}

export interface DeleteWebsiteResponse {
    message: string;
}

export async function deleteWebsite(websiteId: string): Promise<DeleteWebsiteResponse> {
    const response = await fetchWithAuth(`/api/website/${websiteId}`, {
        method: 'DELETE',
    });
    return response.json();
}

export interface GetWebsiteByIdResponse {
    website?: {
        id: string;
        url: string;
        createdAt: string;
        ticks: Array<{
            id: string;
            status: 'Up' | 'Down' | 'Unknown';
            responseTimeMs: number;
            createdAt: string;
            region: string;
        }>;
    };
    message?: string;
}

export async function getWebsiteById(websiteId: string): Promise<GetWebsiteByIdResponse> {
    const response = await fetchWithAuth(`/api/website/${websiteId}`, {
        method: 'GET',
    });
    return response.json();
}

export function saveToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

export function removeToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

export function isAuthenticated(): boolean {
    return !!getToken();
}
