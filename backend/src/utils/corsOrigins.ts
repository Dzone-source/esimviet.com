const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'https://esimviet.com',
  'https://www.esimviet.com',
  'https://5gtrip.com',
  'https://www.5gtrip.com',
];

export function getAllowedOrigins(): string[] {
  const fromEnv = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()) || []),
  ].filter(Boolean) as string[];

  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
}

export function resolveFrontendUrl(originHeader?: string | null): string {
  const allowed = getAllowedOrigins();
  if (originHeader && allowed.includes(originHeader)) {
    return originHeader;
  }
  return process.env.FRONTEND_URL || 'http://localhost:3000';
}
