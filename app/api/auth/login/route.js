import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username: username?.trim() } });
  if (!user || !(await verifyPassword(password || "", user.password)))
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });

  const res = NextResponse.json({ user: { id: user.id, username: user.username, role: user.role, balance: user.balance } });
  res.cookies.set(COOKIE_NAME, await createToken({ sub: user.id, username: user.username, role: user.role }),
    { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 604800, path: "/" });
  return res;
}
