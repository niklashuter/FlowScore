import { getAuthHeaders, removeToken } from "./authApi";

export async function authorizedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const response = await fetch(input, {
        ...init,
        headers: {
            ...getAuthHeaders(),
            ...init?.headers,
        },
    });

    if (response.status === 401) {
        removeToken();
        window.location.replace("/login");
    }

    return response;
}