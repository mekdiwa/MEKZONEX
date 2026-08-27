import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ recommended: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ products });
}
