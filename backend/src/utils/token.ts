import { Request } from 'express';

function readCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  const match = raw.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Read JWT from Authorization, X-Access-Token, or admin_token cookie */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  const xToken = req.headers['x-access-token'];
  if (typeof xToken === 'string' && xToken.trim()) {
    return xToken.trim();
  }

  const cookieToken = readCookie(req, 'admin_token');
  if (cookieToken?.trim()) {
    return cookieToken.trim();
  }

  return null;
}

export function authCookieHeader(token: string): string {
  const maxAge = 7 * 24 * 60 * 60;
  const parts = [
    `admin_token=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function clearAuthCookieHeader(): string {
  const parts = ['admin_token=', 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts.join('; ');
}
