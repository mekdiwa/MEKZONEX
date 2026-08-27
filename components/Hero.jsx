import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-5">
      <div className="relative overflow-hidden rounded-[26px] border border-brand-500/40 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(120%_160%_at_85%_10%,#5b21b6_0%,#3b1170_32%,#1a0d2b_62%,#120a1c_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.06)_45%,transparent_52%)]" />

        <div className="relative flex items-center gap-4 p-5 sm:gap-6 sm:p-8 md:p-10">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs">
              <span className="text-white">The Best Of Topup</span>{" "}
              <span className="text-brand-300">Only Here</span>
            </p>
            <h1 className="mt-1.5 text-3xl font-extrabold italic leading-none tracking-tight drop-shadow-[0_4px_0_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
              MEK<span className="bg-gradient-to-b from-brand-300 to-brand-600 bg-clip-text text-transparent">ZONE</span>
            </h1>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-xs">
              Resell Executor / Game Pass / Robux / And More ...
            </p>
            <p className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.14em] text-white/45 sm:block">
              Executor / Gems / Account / And More
            </p>

            <div className="mt-4 flex items-center gap-2.5 sm:mt-5 sm:gap-3">
              <Link href="/#products"
                className="rounded-xl border border-brand-200/60 bg-gradient-to-b from-brand-500 to-brand-700 px-5 py-2 text-sm font-extrabold italic tracking-wide text-white shadow-glow-sm transition hover:brightness-110 active:scale-95 sm:px-7 sm:py-2.5 sm:text-base">
                SHOP
              </Link>
              <Link href="/topup"
                className="rounded-xl border border-white/35 bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide text-white/90 backdrop-blur transition hover:bg-white/20 active:scale-95 sm:px-7 sm:py-2.5 sm:text-base">
                CLICK
              </Link>
            </div>

            <p className="mt-4 max-w-xs text-[11px] leading-relaxed text-white/65 sm:mt-5 sm:text-xs">
              บริการรับเติมเกมคุณภาพ ยอดนิยม &amp; โปรโมชั่นดีๆ มากมาย บริการรวดเร็วทันใจตลอด 24 ชม.
            </p>
          </div>

          <div className="relative w-[120px] shrink-0 sm:w-[190px] md:w-[300px]">
            <div className="absolute inset-4 rounded-full bg-brand-500/40 blur-3xl" />
            <img src="https://placehold.co/520x640/160b26/8b5cf6?text=MEKZONE+MOCKUP"
              alt="MEKZONE app mockup"
              className="relative w-full rotate-[9deg] rounded-[28px] border border-white/15 object-cover shadow-2xl" />
            <div className="absolute -left-3 top-8 hidden h-11 w-11 -rotate-12 place-items-center rounded-2xl border border-white/20 bg-[#1c1230]/90 text-lg shadow-lg sm:grid">💎</div>
            <div className="absolute -right-2 top-1/3 hidden h-11 w-11 rotate-12 place-items-center rounded-2xl border border-white/20 bg-[#1c1230]/90 text-lg shadow-lg sm:grid">⚡</div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          <span className="h-1.5 w-7 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </section>
  );
}
