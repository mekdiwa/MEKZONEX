import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const s = await getUserFromRequest(req);
  if (!s) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const topups = await prisma.topup.findMany({ where: { userId: s.sub }, orderBy: { createdAt: "desc" }, take: 10 });
  return NextResponse.json({ topups });
}

export async function POST(req) {
  const s = await getUserFromRequest(req);
  if (!s) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const { amount, method, ref } = await req.json();
  const amt = Number(amount);
  if (!amt || amt < 10) return NextResponse.json({ error: "เติมขั้นต่ำ 10 บาท" }, { status: 400 });

  const topup = await prisma.topup.create({
    data: { userId: s.sub, amount: amt, method: method || "PROMPTPAY", ref: ref || null },
  });
  return NextResponse.json({ topup });
}
