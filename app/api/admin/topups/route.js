import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const status = new URL(req.url).searchParams.get("status");
  const topups = await prisma.topup.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: "desc" }, take: 100,
  });
  return NextResponse.json({ topups });
}

export async function PATCH(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, action } = await req.json(); // action: approve | reject
  if (!["approve", "reject"].includes(action))
    return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });

  try {
    await prisma.$transaction(async (tx) => {
      const t = await tx.topup.findUnique({ where: { id } });
      if (!t) throw new Error("ไม่พบรายการ");
      if (t.status !== "PENDING") throw new Error("รายการนี้ถูกดำเนินการไปแล้ว");
      await tx.topup.update({
        where: { id },
        data: { status: action === "approve" ? "APPROVED" : "REJECTED", approvedAt: new Date() },
      });
      if (action === "approve")
        await tx.user.update({ where: { id: t.userId }, data: { balance: { increment: t.amount } } });
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
