import apiBaseUrl from "./config";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    userId: string;
    name: string;
    email: string;
};

export async function login(
    request: LoginRequest
): Promise<LoginResponse> {
    const response = await fetch(
        `${apiBaseUrl}/Auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("Login failed.");
    }

    return response.json();
}

export async function register(
    request: RegisterRequest
): Promise<RegisterResponse> {
    const response = await fetch(
        `${apiBaseUrl}/Auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("Registration failed.");
    }

    return response.json();
}

const TOKEN_STORAGE_KEY = "flowscore_token";

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getAuthHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}