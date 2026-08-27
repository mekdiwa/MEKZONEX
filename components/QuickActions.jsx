import Link from "next/link";
import { Icon } from "./icons";

const ACTIONS = [
  { th: "เติมเงิน", en: "Topup", icon: "wallet", href: "/topup" },
  { th: "สั่งซื้อ", en: "Shop", icon: "basket", href: "/#products" },
  { th: "ประวัติการซื้อ", en: "History", icon: "clock", href: "/history" },
  { th: "ติดต่อ", en: "Support", icon: "headset", href: "#" },
];

export default function QuickActions() {
  return (
    <section className="mx-auto mt-7 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:gap-4">
      {ACTIONS.map(({ th, en, icon, href }) => (
        <Link key={en} href={href}
          className="group relative flex items-center gap-3 overflow-hidden rounded-[24px] border border-brand-500/45 bg-gradient-to-br from-[#191024] via-[#130c1d] to-[#0f0a16] p-4 shadow-glow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-400/70 sm:p-5">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-brand-600/25 blur-2xl transition group-hover:bg-brand-500/35" />
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-white bg-[#0d0913] text-white transition group-hover:scale-105 sm:h-[76px] sm:w-[76px]">
            <Icon name={icon} className="h-7 w-7 sm:h-9 sm:w-9" />
          </div>
          <div className="relative min-w-0">
            <p className="truncate text-lg font-extrabold italic leading-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.6)] sm:text-2xl">{th}</p>
            <p className="truncate text-lg font-extrabold italic leading-tight text-brand-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.6)] sm:text-2xl">{en}</p>
            <span className="mt-1.5 inline-block rounded-lg border border-brand-200/50 bg-gradient-to-b from-brand-500 to-brand-700 px-3 py-0.5 text-[11px] font-bold text-white shadow sm:text-sm">
              คลิกเลย!!
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
