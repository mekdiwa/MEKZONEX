"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "./icons";
import { useAuth } from "./Header";

const ITEMS = [
  { label: "หน้าหลัก", href: "/", icon: "home" },
  { label: "สินค้า", href: "/#products", icon: "bag" },
  { label: "เติมเงิน", href: "/topup", icon: "wallet" },
  { label: "ประวัติ", href: "/history", icon: "clock" },
  { label: "สถานะเว็บรัน", href: "/#status", icon: "activity" },
];

export default function SideDrawer({ open, onClose }) {
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("auth-changed"));
    onClose();
    location.href = "/";
  };

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute inset-y-0 left-0 flex w-[78%] max-w-xs flex-col border-r border-white/10 bg-drawer shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <img src="/logo.png" alt="MEKZONE" className="h-9 w-auto object-contain" />
          <button onClick={onClose} aria-label="ปิดเมนู"
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/80 transition hover:bg-white/20">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {user && (
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-brand-500/40 bg-brand-600/15 p-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white"><Icon name="user" /></div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.username}</p>
              <p className="text-xs text-brand-300">ยอดเงิน ${Number(user.balance).toLocaleString()}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {ITEMS.map(({ label, href, icon }) => (
            <Link key={label} href={href} onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] text-white/55 transition hover:bg-white/5 hover:text-white">
              <Icon name={icon} className="h-5 w-5" /> {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          {user ? (
            <button onClick={logout}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-white/10 py-3 text-[15px] font-semibold text-white transition hover:bg-white/20">
              <Icon name="logout" className="h-5 w-5" /> ออกจากระบบ
            </button>
          ) : (
            <Link href="/login" onClick={onClose}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-white py-3 text-[15px] font-semibold text-black transition hover:bg-white/90">
              <Icon name="user" className="h-5 w-5" /> เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
