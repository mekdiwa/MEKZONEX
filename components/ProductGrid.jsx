"use client";
import { useState } from "react";
import { Icon } from "./icons";

function ProductCard({ p }) {
  const [busy, setBusy] = useState(false);
  const soldOut = p.stock <= 0;

  const buy = async () => {
    if (soldOut || busy) return;
    if (!confirm(`สั่งซื้อ "${p.name}" ใช้ยอด $${p.price} ?`)) return;
    setBusy(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ productId: p.id, quantity: 1 }] }),
      });
      const d = await r.json();
      if (r.status === 401) return (location.href = "/login?next=/");
      if (!r.ok) return alert(d.error || "เกิดข้อผิดพลาด");
      alert(`✅ สั่งซื้อสำเร็จ!\nเลขออเดอร์: ${d.order.orderNumber}`);
      window.dispatchEvent(new Event("auth-changed"));
      location.reload();
    } finally { setBusy(false); }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-brand-500/30 bg-card shadow-glow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-400/60">
      <div className="relative bg-gradient-to-b from-[#0e0a15] to-[#171024] p-3 pb-4">
        <img src={p.image} alt={p.name} loading="lazy"
          className="aspect-square w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.03]" />
        <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
          <Icon name="star" className="h-3 w-3 text-amber-300" /> แนะนำ
        </span>
        {p.oldPrice && (
          <span className="absolute right-5 top-5 flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            <Icon name="tag" className="h-3 w-3" /> -฿{Math.round(p.oldPrice - p.price)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-brand-500/20 p-4">
        <h3 className="truncate text-[15px] font-semibold text-white sm:text-base">{p.name}</h3>
        <p className="mt-0.5 truncate text-xs text-white/45">{p.description}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-lg font-bold text-brand-400">${p.price.toLocaleString()}</span>
          {p.oldPrice && <span className="text-xs text-white/35 line-through">${p.oldPrice.toLocaleString()}</span>}
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/85">
            <span className={`h-2 w-2 rounded-full ${soldOut ? "bg-red-400" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"}`} />
            {soldOut ? "สินค้าหมด" : `เหลือ ${p.stock}`}
          </span>
        </div>

        <button onClick={buy} disabled={soldOut || busy}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200/40 bg-gradient-to-b from-brand-600 to-brand-800 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
          <Icon name="bag" className="h-4 w-4" /> {busy ? "กำลังดำเนินการ..." : "สั่งซื้อ"}
        </button>
      </div>
    </article>
  );
}

export default function ProductGrid({ products }) {
  return (
    <>
      <div id="products" className="mx-auto mt-10 flex max-w-6xl scroll-mt-24 items-center gap-4 px-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brand-500/50 bg-gradient-to-br from-[#1c1129] to-[#0f0a16] shadow-glow-sm">
          <Icon name="star" className="h-7 w-7 text-brand-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.6)] sm:text-[28px]">สินค้าแนะนำสำหรับคุณ</h2>
          <p className="mt-0.5 text-[13px] font-semibold tracking-[0.3em] text-brand-400">RECOMMENDED PRODUCTS</p>
        </div>
      </div>
      <section className="mx-auto mt-5 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:gap-4 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </section>
    </>
  );
}
