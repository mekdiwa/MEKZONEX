import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const COOKIE_NAME = "mek_token";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export const hashPassword = (p) => bcrypt.hash(p, 10);
export const verifyPassword = (p, h) => bcrypt.compare(p, h);

export function createToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("7d").sign(secret());
}

export async function verifyToken(token) {
  try { return (await jwtVerify(token, secret())).payload; } catch { return null; }
}

/** ใช้ใน API routes */
export async function getUserFromRequest(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}

/** ใช้ใน server components */
export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}

export async function requireAdmin(req) {
  const s = await getUserFromRequest(req);
  return s?.role === "ADMIN" ? s : null;
}
