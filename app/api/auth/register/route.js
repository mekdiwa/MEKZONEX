import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || username.trim().length < 3 || !password || password.length < 6)
    return NextResponse.json({ error: "ชื่อผู้ใช้ 3 ตัวขึ้นไป และรหัสผ่าน 6 ตัวขึ้นไป" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return NextResponse.json({ error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" }, { status: 409 });

  const user = await prisma.user.create({ data: { username, password: await hashPassword(password) } });
  const res = NextResponse.json({ user: { id: user.id, username, role: user.role, balance: 0 } });
  res.cookies.set(COOKIE_NAME, await createToken({ sub: user.id, username, role: user.role }),
    { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 604800, path: "/" });
  return res;
}
