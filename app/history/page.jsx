import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ORDER_BADGE = {
  PAID: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  DELIVERED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/40",
};
const ORDER_LABEL = { PAID: "ชำระแล้ว", DELIVERED: "ส่งมอบแล้ว", CANCELLED: "ยกเลิก" };
const TOPUP_BADGE = { PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/40", APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40", REJECTED: "bg-red-500/15 text-red-300 border-red-500/40" };
const TOPUP_LABEL = { PENDING: "รอตรวจสอบ", APPROVED: "สำเร็จ", REJECTED: "ปฏิเสธ" };

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/history");

  const orders = await prisma.order.findMany({
    where: { userId: session.sub },
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  const topups = await prisma.topup.findMany({ where: { userId: session.sub }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-10">
      <h1 className="text-2xl font-bold">ประวัติการใช้งาน</h1>

      <h2 className="mt-6 text-lg font-bold text-brand-300">🛒 คำสั่งซื้อ</h2>
      <div className="mt-3 space-y-3">
        {orders.length === 0 && <p className="text-sm text-white/40">ยังไม่มีคำสั่งซื้อ</p>}
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">#{o.orderNumber}</p>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${ORDER_BADGE[o.status]}`}>{ORDER_LABEL[o.status]}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {o.items.map((it) => (
                <li key={it.id} className="flex justify-between text-xs text-white/60">
                  <span>{it.product.name} × {it.quantity}</span>
                  <span>${(it.price * it.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2.5">
              <span className="text-[11px] text-white/40">{new Date(o.createdAt).toLocaleString("th-TH")}</span>
              <span className="text-sm font-bold text-brand-400">รวม ${o.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-bold text-brand-300">💰 ประวัติเติมเงิน</h2>
      <div className="mt-3 space-y-2">
        {topups.length === 0 && <p className="text-sm text-white/40">ยังไม่มีประวัติเติมเงิน</p>}
        {topups.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-card px-4 py-3">
            <div>
              <p className="text-sm font-semibold">฿{Number(t.amount).toLocaleString()} · {t.method}</p>
              <p className="text-[11px] text-white/40">{new Date(t.createdAt).toLocaleString("th-TH")}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${TOPUP_BADGE[t.status]}`}>{TOPUP_LABEL[t.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
