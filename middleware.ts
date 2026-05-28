import { next } from '@vercel/functions';

const sessionCookieName = 'ml_session';

type SessionPayload = {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
};

const protectedRoutes = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/client', role: 'client' },
];

const base64UrlToBytes = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const bytesToBase64Url = (bytes: ArrayBuffer) => {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
};

const readCookie = (cookieHeader: string | null, name: string) => {
  if (!cookieHeader) return undefined;

  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
};

const verifyJwt = async (token: string | undefined, secret: string) => {
  if (!token || !secret) return null;

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) return null;

  try {
    const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedHeader))) as { alg?: string };
    if (header.alg !== 'HS256') return null;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const expectedSignature = bytesToBase64Url(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)),
    );

    if (!timingSafeEqual(signature, expectedSignature)) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload))) as SessionPayload;
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
};

export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const route = protectedRoutes.find((item) => url.pathname.startsWith(item.prefix));
  if (!route) return next();

  const token = decodeURIComponent(readCookie(request.headers.get('cookie'), sessionCookieName) ?? '');
  const session = await verifyJwt(token, process.env.JWT_SECRET ?? '');

  if (!session || session.role !== route.role) {
    return Response.redirect(new URL('/login', url), 302);
  }

  return next();
}
