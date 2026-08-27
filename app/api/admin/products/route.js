import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ products: await prisma.product.findMany({ orderBy: { createdAt: "desc" } }) });
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const d = await req.json();
  if (!d.name || !d.price) return NextResponse.json({ error: "กรุณากรอกชื่อและราคา" }, { status: 400 });
  const product = await prisma.product.create({
    data: {
      name: d.name, description: d.description || "", price: Number(d.price),
      oldPrice: d.oldPrice ? Number(d.oldPrice) : null, stock: parseInt(d.stock) || 0,
      image: d.image || "https://placehold.co/600x600/14101d/8b5cf6?text=PRODUCT",
      recommended: !!d.recommended,
    },
  });
  return NextResponse.json({ product });
}
