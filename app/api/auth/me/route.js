import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const s = await getUserFromRequest(req);
  if (!s) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: s.sub },
    select: { id: true, username: true, role: true, balance: true },
  });
  return NextResponse.json({ user });
}
