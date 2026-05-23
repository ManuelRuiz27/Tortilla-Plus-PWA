import { HttpError, type ApiError } from './api-error';
import { useAuthStore } from '../shared/stores/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = (await response.json()) as ApiError;
    } catch {
      errorData = {
        statusCode: response.status,
        error: 'UNKNOWN_ERROR',
        message: 'Ocurrió un error inesperado al procesar la respuesta.',
      };
    }
    
    // Auto logout on 401
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    
    throw new HttpError(errorData);
  }
  
  // Return null if empty response (like 204 No Content)
  if (response.status === 204) {
    return null as any;
  }
  
  return response.json() as Promise<T>;
}

async function getHeaders(customHeaders?: HeadersInit): Promise<Headers> {
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');
  
  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return headers;
}

export const httpClient = {
  get: async <T>(url: string, headers?: HeadersInit): Promise<T> => {
    const finalHeaders = await getHeaders(headers);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: finalHeaders,
    });
    return handleResponse<T>(response);
  },
  
  post: async <T>(url: string, body?: any, headers?: HeadersInit): Promise<T> => {
    const finalHeaders = await getHeaders(headers);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },
  
  put: async <T>(url: string, body?: any, headers?: HeadersInit): Promise<T> => {
    const finalHeaders = await getHeaders(headers);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },
  
  patch: async <T>(url: string, body?: any, headers?: HeadersInit): Promise<T> => {
    const finalHeaders = await getHeaders(headers);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },
  
  delete: async <T>(url: string, headers?: HeadersInit): Promise<T> => {
    const finalHeaders = await getHeaders(headers);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: finalHeaders,
    });
    return handleResponse<T>(response);
  },
};
