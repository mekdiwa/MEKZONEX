import Link from "next/link";
import { Icon } from "./icons";

function Col({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}><Link href={l.href} className="text-sm text-white/55 transition hover:text-white">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 bg-panel/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <img src="/logo.png" alt="MEKZONE" className="h-16 w-auto object-contain" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            ศูนย์รวมเติมเกม สั่งซื้อสินค้า บัญชีเกม และอุปกรณ์เสริมสำหรับเกมเมอร์ บริการปลอดภัย รวดเร็ว ตลอด 24 ชั่วโมง
          </p>
          <div className="mt-5 flex gap-2.5">
            {["discord", "facebook", "youtube"].map((n) => (
              <a key={n} href="#" aria-label={n}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-brand-400/60 hover:text-brand-300">
                <Icon name={n} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <Col title="เมนู" links={[
          { label: "หน้าหลัก", href: "/" }, { label: "สินค้าทั้งหมด", href: "/#products" },
          { label: "เติมเงิน", href: "/topup" }, { label: "ประวัติการสั่งซื้อ", href: "/history" }]} />
        <Col title="ช่วยเหลือ" links={[
          { label: "วิธีการสั่งซื้อ", href: "#" }, { label: "ช่องทางชำระเงิน", href: "/topup" },
          { label: "นโยบายความเป็นส่วนตัว", href: "#" }, { label: "เงื่อนไขการใช้บริการ", href: "#" }]} />
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300">ช่องทางชำระเงิน</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {["PromptPay", "TrueMoney", "ธนาคาร", "บัตรเครดิต"].map((p) => (
              <span key={p} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">{p}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} MEKZONE — All rights reserved.
      </div>
    </footer>
  );
}
