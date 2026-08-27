"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) return setErr(d.error);
      window.dispatchEvent(new Event("auth-changed"));
      const next = new URLSearchParams(window.location.search).get("next");
      location.href = next || (d.user.role === "ADMIN" ? "/admin" : "/");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-brand-500/30 bg-card p-8 shadow-glow">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="MEKZONE" className="h-20 w-auto object-contain" />
          <h1 className="mt-4 text-xl font-bold">เข้าสู่ระบบ</h1>
          <p className="mt-1 text-xs text-white/45">ยินดีต้อนรับกลับมาสู่ MEKZONE</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3.5">
          <input required placeholder="ชื่อผู้ใช้" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-brand-400/60" />
          <input required type="password" placeholder="รหัสผ่าน" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-brand-400/60" />
          {err && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-300">{err}</p>}
          <button disabled={busy}
            className="w-full rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 py-3 text-sm font-bold text-white shadow-glow-sm transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
            {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/45">
          ยังไม่มีบัญชี? <Link href="/register" className="font-semibold text-brand-300 hover:underline">สมัครสมาชิกฟรี</Link>
        </p>
        <p className="mt-2 text-center text-[11px] text-white/30">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white/60"><Icon name="home" className="h-3 w-3" /> กลับหน้าหลัก</Link>
        </p>
      </div>
    </div>
  );
}
