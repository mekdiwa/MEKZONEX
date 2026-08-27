import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const orders = await prisma.order.findMany({
    include: { user: { select: { username: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" }, take: 100,
  });
  return NextResponse.json({ orders });
}

export async function PATCH(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status } = await req.json();
  if (!["PAID", "DELIVERED", "CANCELLED"].includes(status))
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  return NextResponse.json({ order: await prisma.order.update({ where: { id }, data: { status } }) });
}
