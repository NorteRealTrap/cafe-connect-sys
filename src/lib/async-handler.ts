/**
 * Wrapper para funções async com tratamento de erro automático
 */
export function asyncHandler<T>(
  fn: (...args: any[]) => Promise<T>
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async error:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };
}

/**
 * Fetch com timeout e retry
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000,
  retries: number = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
      if (!response.ok && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof Error && error.name === 'AbortError') {
        if (i === retries - 1) {
          throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
      } else if (i === retries - 1) {
        throw error;
      }
      
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }

  throw new Error('Max retries reached');
}
