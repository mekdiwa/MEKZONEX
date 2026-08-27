"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

const TABS = [
  { id: "stats", label: "📊 สถิติ" }, { id: "orders", label: "🛒 ออเดอร์" },
  { id: "topups", label: "💰 เติมเงิน" }, { id: "products", label: "📦 สินค้า" },
  { id: "users", label: "👥 สมาชิก" },
];
const th = "px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-white/40";
const td = "px-3 py-3 text-sm";

export default function AdminPage() {
  const [tab, setTab] = useState("stats");
  const [data, setData] = useState({});
  const [form, setForm] = useState(null); // form สินค้า

  const api = async (url, opts) => {
    const r = await fetch(url, { cache: "no-store", ...opts });
    const d = await r.json();
    if (!r.ok) { alert(d.error || "Error"); throw new Error(d.error); }
    return d;
  };
  const load = async () => {
    try {
      const [stats, orders, topups, products, users] = await Promise.all([
        api("/api/admin/stats"), api("/api/admin/orders"),
        api("/api/admin/topups"), api("/api/admin/products"), api("/api/admin/users"),
      ]);
      setData({ stats: stats, orders: orders.orders, topups: topups.topups, products: products.products, users: users.users });
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const approve = async (id, action) => {
    if (!confirm(`ยืนยันจะ${action === "approve" ? "อนุมัติ" : "ปฏิเสธ"}รายการนี้?`)) return;
    await api("/api/admin/topups", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    load();
  };
  const setOrderStatus = async (id, status) => {
    await api("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };
  const saveProduct = async (e) => {
    e.preventDefault();
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    await api(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(null); load();
  };
  const removeProduct = async (id) => {
    if (!confirm("ลบสินค้านี้?")) return;
    const d = await api(`/api/admin/products/${id}`, { method: "DELETE" });
    if (d.message) alert(d.message);
    load();
  };
  const addBalance = async (userId) => {
    const add = prompt("จำนวนเงินที่ต้องการเพิ่ม (ติดลบ = หัก):");
    if (!add) return;
    await api("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, add: Number(add) }) });
    load();
  };

  const badge = (s, map) => <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${map[s]}`}>{s}</span>;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-10">
      <h1 className="text-2xl font-bold">🔐 แผงควบคุมแอดมิน</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "border-brand-400 bg-brand-600/30 text-white" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"}`}>
            {t.label}
            {t.id === "topups" && data.topups?.filter((x) => x.status === "PENDING").length > 0 && (
              <span className="ml-2 rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-black">
                {data.topups.filter((x) => x.status === "PENDING").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { l: "สมาชิกทั้งหมด", v: data.stats?.users ?? "-", i: "user" },
            { l: "ออเดอร์ทั้งหมด", v: data.stats?.orders ?? "-", i: "bag" },
            { l: "รายได้รวม", v: `$${Number(data.stats?.revenue ?? 0).toLocaleString()}`, i: "wallet" },
            { l: "เติมเงินรออนุมัติ", v: data.stats?.pendingTopups ?? "-", i: "clock" },
          ].map(({ l, v, i }) => (
            <div key={l} className="rounded-2xl border border-brand-500/30 bg-card p-5">
              <Icon name={i} className="h-6 w-6 text-brand-400" />
              <p className="mt-3 text-2xl font-bold">{v}</p>
              <p className="text-xs text-white/45">{l}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-white/10"><tr><th className={th}>ออเดอร์</th><th className={th}>ผู้ใช้</th><th className={th}>รายการ</th><th className={th}>ยอด</th><th className={th}>สถานะ</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {data.orders?.map((o) => (
                <tr key={o.id}>
                  <td className={td}>#{o.orderNumber}<br /><span className="text-[10px] text-white/35">{new Date(o.createdAt).toLocaleString("th-TH")}</span></td>
                  <td className={td}>{o.user.username}</td>
                  <td className={`${td} text-xs text-white/60`}>{o.items.map((i) => `${i.product.name}×${i.quantity}`).join(", ")}</td>
                  <td className={`${td} font-bold text-brand-400`}>${o.total.toLocaleString()}</td>
                  <td className={td}>
                    <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-panel px-2 py-1.5 text-xs">
                      <option value="PAID">ชำระแล้ว</option><option value="DELIVERED">ส่งมอบแล้ว</option><option value="CANCELLED">ยกเลิก</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "topups" && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-white/10"><tr><th className={th}>ผู้ใช้</th><th className={th}>จำนวน</th><th className={th}>ช่องทาง</th><th className={th}>วันที่</th><th className={th}>สถานะ</th><th className={th}>จัดการ</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {data.topups?.map((t) => (
                <tr key={t.id}>
                  <td className={td}>{t.user.username}</td>
                  <td className={`${td} font-bold text-brand-400`}>฿{Number(t.amount).toLocaleString()}</td>
                  <td className={td}>{t.method}</td>
                  <td className={`${td} text-xs text-white/45`}>{new Date(t.createdAt).toLocaleString("th-TH")}</td>
                  <td className={td}>{badge(t.status, { PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/40", APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40", REJECTED: "bg-red-500/15 text-red-300 border-red-500/40" })}</td>
                  <td className={td}>
                    {t.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button onClick={() => approve(t.id, "approve")} className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"><Icon name="check" className="inline h-3.5 w-3.5" /> อนุมัติ</button>
                        <button onClick={() => approve(t.id, "reject")} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/30">ปฏิเสธ</button>
                      </div>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="mt-5">
          <button onClick={() => setForm({ name: "", price: "", stock: "", image: "", description: "", recommended: false })}
            className="mb-4 flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-glow-sm">
            <Icon name="plus" className="h-4 w-4" /> เพิ่มสินค้าใหม่
          </button>

          {form && (
            <form onSubmit={saveProduct} className="mb-5 grid gap-3 rounded-2xl border border-brand-500/40 bg-card p-5 sm:grid-cols-2">
              <input required placeholder="ชื่อสินค้า" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-400/60" />
              <input required type="number" step="0.01" placeholder="ราคา $" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-400/60" />
              <input type="number" placeholder="ราคาก่อนลด (ถ้ามี)" value={form.oldPrice ?? ""} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-400/60" />
              <input type="number" placeholder="สต็อก" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-400/60" />
              <input placeholder="URL รูปภาพ" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-400/60 sm:col-span-2" />
              <input placeholder="คำอธิบาย" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-400/60 sm:col-span-2" />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={!!form.recommended} onChange={(e) => setForm({ ...form, recommended: e.target.checked })} /> แสดงเป็นสินค้าแนะนำ
              </label>
              <div className="flex gap-2 sm:justify-end">
                <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">บันทึก</button>
                <button type="button" onClick={() => setForm(null)} className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white/70">ยกเลิก</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card">
            <table className="w-full min-w-[680px]">
              <thead className="border-b border-white/10"><tr><th className={th}>สินค้า</th><th className={th}>ราคา</th><th className={th}>สต็อก</th><th className={th}>สถานะ</th><th className={th}>จัดการ</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {data.products?.map((p) => (
                  <tr key={p.id}>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className={`${td} text-brand-400`}>${p.price}{p.oldPrice && <span className="ml-1 text-xs text-white/35 line-through">${p.oldPrice}</span>}</td>
                    <td className={td}>{p.stock}</td>
                    <td className={td}>{p.active ? "✅ ขายอยู่" : "⛔ ปิดขาย"}</td>
                    <td className={td}>
                      <div className="flex gap-2">
                        <button onClick={() => setForm(p)} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20">แก้ไข</button>
                        <button onClick={() => removeProduct(p.id)} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/30"><Icon name="trash" className="inline h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-card">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-white/10"><tr><th className={th}>ชื่อผู้ใช้</th><th className={th}>ยอดเงิน</th><th className={th}>สิทธิ์</th><th className={th}>สมัครเมื่อ</th><th className={th}>จัดการ</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {data.users?.map((u) => (
                <tr key={u.id}>
                  <td className={`${td} font-semibold`}>{u.username}</td>
                  <td className={`${td} font-bold text-brand-400`}>${Number(u.balance).toLocaleString()}</td>
                  <td className={td}>{u.role === "ADMIN" ? <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300">ADMIN</span> : "USER"}</td>
                  <td className={`${td} text-xs text-white/45`}>{new Date(u.createdAt).toLocaleDateString("th-TH")}</td>
                  <td className={td}>
                    <button onClick={() => addBalance(u.id)} className="rounded-lg bg-brand-600/30 px-3 py-1.5 text-xs font-bold text-brand-200 hover:bg-brand-600/50">± เงิน</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
