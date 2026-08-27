"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Icon } from "./icons";

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = กำลังโหลด
  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await r.json();
      setUser(d.user ?? null);
    } catch { setUser(null); }
  }, []);
  useEffect(() => {
    refresh();
    window.addEventListener("auth-changed", refresh);
    return () => window.removeEventListener("auth-changed", refresh);
  }, [refresh]);
  return { user, refresh };
}

const NAV = [
  { label: "หน้าหลัก", href: "/", icon: "home" },
  { label: "สินค้า", href: "/#products", icon: "bag" },
  { label: "เติมเงิน", href: "/topup", icon: "wallet" },
  { label: "ประวัติ", href: "/history", icon: "clock" },
  { label: "สถานะเว็บรัน", href: "/#status", icon: "activity" },
];

export default function Header({ onOpenMenu }) {
  const { user, refresh } = useAuth();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("auth-changed"));
    location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-panel/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <button onClick={onOpenMenu} aria-label="เปิดเมนู"
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 active:scale-95 lg:hidden">
          <Icon name="menu" className="h-6 w-6" />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map(({ label, href, icon }) => (
            <Link key={label} href={href}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
              <Icon name={icon} className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user === undefined ? null : user ? (
            <>
              <Link href="/topup"
                className="flex items-center gap-1.5 rounded-full border border-brand-500/50 bg-brand-600/20 px-3.5 py-1.5 text-sm font-semibold text-brand-200 transition hover:bg-brand-600/30">
                <Icon name="wallet" className="h-4 w-4" /> ${Number(user.balance).toLocaleString()}
              </Link>
              <span className="hidden text-sm text-white/70 sm:block">{user.username}</span>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300">ADMIN</Link>
              )}
              <button onClick={logout} aria-label="ออกจากระบบ"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:text-white">
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link href="/login"
              className="rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-glow-sm transition hover:brightness-110">
              เข้าสู่ระบบ
            </Link>
          )}

          <Link href="/" aria-label="MEKZONE">
            <img src="/logo.png" alt="MEKZONE" className="h-11 w-auto object-contain drop-shadow-[0_0_14px_rgba(139,92,246,0.5)]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
