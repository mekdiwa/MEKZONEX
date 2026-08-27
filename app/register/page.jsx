"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm) return setErr("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) return setErr(d.error);
      window.dispatchEvent(new Event("auth-changed"));
      location.href = "/";
    } finally { setBusy(false); }
  };

  const input = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-brand-400/60";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-brand-500/30 bg-card p-8 shadow-glow">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="MEKZONE" className="h-20 w-auto object-contain" />
          <h1 className="mt-4 text-xl font-bold">สมัครสมาชิก</h1>
          <p className="mt-1 text-xs text-white/45">ฟรี! สมัครครั้งเดียว ใช้ได้ตลอด</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3.5">
          <input required placeholder="ชื่อผู้ใช้ (3 ตัวขึ้นไป)" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} className={input} />
          <input required type="password" placeholder="รหัสผ่าน (6 ตัวขึ้นไป)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
          <input required type="password" placeholder="ยืนยันรหัสผ่าน" value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={input} />
          {err && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-300">{err}</p>}
          <button disabled={busy}
            className="w-full rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 py-3 text-sm font-bold text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-50">
            {busy ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-white/45">
          มีบัญชีแล้ว? <Link href="/login" className="font-semibold text-brand-300 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}
