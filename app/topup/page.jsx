"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { useAuth } from "@/components/Header";

const AMOUNTS = [50, 100, 300, 500, 1000];
const METHODS = [
  { id: "PROMPTPAY", label: "PromptPay" },
  { id: "TRUEMONEY", label: "TrueMoney Wallet" },
  { id: "BANK", label: "โอนธนาคาร" },
];
const badge = {
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/40",
};
const label = { PENDING: "รอตรวจสอบ", APPROVED: "สำเร็จ", REJECTED: "ปฏิเสธ" };

export default function TopupPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("PROMPTPAY");
  const [qr, setQr] = useState(null);
  const [topups, setTopups] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await fetch("/api/topups", { cache: "no-store" });
    if (r.ok) setTopups((await r.json()).topups);
  };
  useEffect(() => { load(); }, []);

  const showQr = async () => {
    const r = await fetch(`/api/topups/qr?amount=${amount}`);
    setQr((await r.json()).qr);
  };
  useEffect(() => { if (method === "PROMPTPAY") showQr(); else setQr(null); }, [amount, method]);

  const submit = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/topups", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method }),
      });
      const d = await r.json();
      if (!r.ok) return alert(d.error);
      alert("✅ สร้างรายการเติมเงินแล้ว รอแอดมินตรวจสอบภายในไม่กี่นาที");
      load();
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-brand-500/50 bg-gradient-to-br from-[#1c1129] to-[#0f0a16] shadow-glow-sm">
          <Icon name="wallet" className="h-7 w-7 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">เติมเงินเข้ากระเป๋า</h1>
          <p className="text-sm text-brand-300">ยอดเงินปัจจุบัน: ${user ? Number(user.balance).toLocaleString() : "..."}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-brand-500/30 bg-card p-5 sm:p-6">
        <p className="text-sm font-semibold text-white/80">1. เลือกจำนวนเงิน (บาท)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button key={a} onClick={() => setAmount(a)}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${amount === a ? "border-brand-400 bg-brand-600/30 text-white" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"}`}>
              ฿{a}
            </button>
          ))}
          <input type="number" min="10" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            className="w-28 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-brand-400/60" />
        </div>

        <p className="mt-5 text-sm font-semibold text-white/80">2. เลือกช่องทางชำระเงิน</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {METHODS.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${method === m.id ? "border-brand-400 bg-brand-600/25 text-white" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"}`}>
              {m.label}
            </button>
          ))}
        </div>

        {qr && (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-white/10 bg-white p-4">
            <img src={qr} alt="PromptPay QR" className="h-56 w-56" />
            <p className="mt-2 text-center text-xs font-semibold text-black/70">สแกนจ่าย {amount} บาท ด้วยแอปธนาคาร</p>
          </div>
        )}

        <button onClick={submit} disabled={busy}
          className="mt-5 w-full rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 py-3.5 text-sm font-bold text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-50">
          {busy ? "กำลังดำเนินการ..." : "ยืนยันรายการเติมเงิน → รอแอดมินอนุมัติ"}
        </button>
        <p className="mt-3 text-center text-[11px] text-white/40">
          * หลังชำระเงินแล้ว ระบบจะเพิ่มยอดอัตโนมัติเมื่อแอดมินกดอนุมัติ (ปกติไม่เกิน 10 นาที)
        </p>
      </div>

      <h2 className="mt-8 text-lg font-bold">รายการเติมเงินล่าสุด</h2>
      <div className="mt-3 space-y-2 pb-8">
        {topups.length === 0 && <p className="text-sm text-white/40">ยังไม่มีประวัติการเติมเงิน</p>}
        {topups.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-card px-4 py-3">
            <div>
              <p className="text-sm font-semibold">฿{Number(t.amount).toLocaleString()} · {t.method}</p>
              <p className="text-[11px] text-white/40">{new Date(t.createdAt).toLocaleString("th-TH")}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${badge[t.status]}`}>{label[t.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
