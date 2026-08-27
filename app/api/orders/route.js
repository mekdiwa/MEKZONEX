import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const s = await getUserFromRequest(req);
  if (!s) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: { userId: s.sub },
    include: { items: { include: { product: { select: { name: true, image: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req) {
  const s = await getUserFromRequest(req);
  if (!s) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const { items } = await req.json();
  if (!Array.isArray(items) || !items.length)
    return NextResponse.json({ error: "ไม่พบรายการสินค้า" }, { status: 400 });

  try {
    const order = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: s.sub } });
      if (!user) throw new Error("ไม่พบผู้ใช้");

      let total = 0;
      const lines = [];
      for (const it of items) {
        const qty = Math.max(1, parseInt(it.quantity) || 1);
        const p = await tx.product.findUnique({ where: { id: it.productId } });
        if (!p || !p.active) throw new Error("ไม่พบสินค้านี้");
        if (p.stock < qty) throw new Error(`"${p.name}" สินค้าไม่เพียงพอ`);
        total += p.price * qty;
        lines.push({ productId: p.id, quantity: qty, price: p.price });
        await tx.product.update({ where: { id: p.id }, data: { stock: { decrement: qty } } });
      }
      if (user.balance < total) throw new Error("ยอดเงินไม่เพียงพอ กรุณาเติมเงินก่อนสั่งซื้อ");
      await tx.user.update({ where: { id: user.id }, data: { balance: { decrement: total } } });

      return tx.order.create({
        data: {
          orderNumber: "MZ" + Date.now().toString().slice(-9),
          userId: user.id, total, status: "PAID",
          items: { create: lines },
        },
        include: { items: { include: { product: true } } },
      });
    });
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
