import { request } from './adminApi';

export type SubmitKind = 'membership' | 'message' | 'complaint' | 'registration';

/** Public endpoints used by visitors: send a form, or look up their own application by code. */
export const siteApi = {
  submit: (kind: SubmitKind, data: Record<string, unknown>) =>
    request<{ code: string }>('POST', '/api/submit', { kind, data }),
  track: <T,>(kind: 'membership' | 'complaint', code: string) =>
    request<{ record: T }>('POST', '/api/track', { kind, code }),
};
