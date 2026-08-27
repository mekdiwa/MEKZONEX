import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
const PROTECTED = ["/history", "/topup", "/admin"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname.startsWith(p))) return NextResponse.next();

  let session = null;
  const token = req.cookies.get("mek_token")?.value;
  if (token) { try { session = (await jwtVerify(token, secret)).payload; } catch {} }

  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && session.role !== "ADMIN")
    return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/history/:path*", "/topup/:path*", "/admin/:path*"] };
