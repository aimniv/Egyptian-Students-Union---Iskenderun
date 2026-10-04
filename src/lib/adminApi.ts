export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

export interface AdminSession {
  email: string;
  name: string;
}

export interface AdminAccount {
  email: string;
  name: string;
  hasPassword: boolean;
  createdAt: string;
  createdBy: string;
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'unreachable');
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // not JSON: the API is not served here (for example plain `vite` without `vercel dev`)
  }
  if (!res.ok || data === null) throw new ApiError(res.status, data?.error || 'unreachable');
  return data as T;
}

export const adminApi = {
  me: () => request<AdminSession>('GET', '/api/auth/me'),
  login: (email: string, password: string) => request<{ step: 'otp' }>('POST', '/api/auth/login', { email, password }),
  verify: (email: string, code: string) => request<AdminSession>('POST', '/api/auth/verify', { email, code }),
  setupRequest: (email: string) => request<{ ok: true }>('POST', '/api/auth/setup-request', { email }),
  setupConfirm: (email: string, code: string, password: string) =>
    request<{ ok: true }>('POST', '/api/auth/setup-confirm', { email, code, password }),
  logout: () => request<{ ok: true }>('POST', '/api/auth/logout', {}),
  listAdmins: () => request<{ admins: AdminAccount[]; me: string }>('GET', '/api/admins'),
  addAdmin: (email: string, name: string) =>
    request<{ ok: true; invited: boolean }>('POST', '/api/admins', { email, name }),
  removeAdmin: (email: string) => request<{ ok: true }>('DELETE', '/api/admins', { email }),
};
