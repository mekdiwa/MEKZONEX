import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const [users, orders, pendingTopups, rev] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.topup.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
  ]);
  return NextResponse.json({ users, orders, pendingTopups, revenue: rev._sum.total || 0 });
}
