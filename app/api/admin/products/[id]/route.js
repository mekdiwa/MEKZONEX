import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req, { params }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const d = await req.json();
  const data = {};
  for (const k of ["name", "description", "image"]) if (d[k] !== undefined) data[k] = d[k];
  for (const k of ["price", "oldPrice"]) if (d[k] !== undefined) data[k] = d[k] === null || d[k] === "" ? null : Number(d[k]);
  if (d.stock !== undefined) data.stock = parseInt(d.stock) || 0;
  if (d.active !== undefined) data.active = !!d.active;
  if (d.recommended !== undefined) data.recommended = !!d.recommended;
  return NextResponse.json({ product: await prisma.product.update({ where: { id }, data }) });
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    // มีประวัติออเดอร์ผูกอยู่ → ปิดการขายแทน
    await prisma.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ ok: true, message: "มีประวัติการขาย จึงปิดการขายแทนการลบ" });
  }
}
