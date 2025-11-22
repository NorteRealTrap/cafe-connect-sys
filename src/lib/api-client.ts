/**
 * API Client com timeout, retry e tratamento de erros
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, retries = 3, ...fetchOptions } = options;

  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        if (i === retries - 1) {
          throw new APIError(`Request timeout after ${timeout}ms`, 408);
        }
      } else if (i === retries - 1) {
        throw error;
      }

      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }

  throw new APIError('Max retries reached', 500);
}

export const api = {
  async get<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(url, { ...options, method: 'GET' });
    
    if (!response.ok) {
      throw new APIError(
        `GET ${url} failed`,
        response.status,
        await response.json().catch(() => null)
      );
    }
    
    return response.json();
  },

  async post<T>(url: string, data: any, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new APIError(
        `POST ${url} failed`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  async put<T>(url: string, data: any, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new APIError(
        `PUT ${url} failed`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  async delete<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new APIError(
        `DELETE ${url} failed`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },
};
