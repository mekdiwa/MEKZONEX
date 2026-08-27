import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, balance: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}

export async function PATCH(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { userId, add } = await req.json();
  const amt = Number(add);
  if (!userId || !amt) return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  const user = await prisma.user.update({ where: { id: userId }, data: { balance: { increment: amt } } });
  return NextResponse.json({ user: { id: user.id, balance: user.balance } });
}
