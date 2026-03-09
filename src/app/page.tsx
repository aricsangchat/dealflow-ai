import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-6xl flex-col px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sky-400">
            DealFlow AI
          </p>
          <h1 className="text-5xl font-semibold leading-tight">
            Find the best real estate investment deals instantly.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Analyze listings, estimate cash flow, and rank opportunities with a
            clean investor dashboard.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/market/phoenix-az"
              className="rounded-xl bg-sky-500 px-5 py-3 font-medium text-white transition hover:bg-sky-400"
            >
              Analyze Deals
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500"
            >
              View Features
            </a>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-slate-400">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-slate-900 p-4">
                Phoenix Deal
                <div className="text-emerald-400">$412 cash flow</div>
              </div>

              <div className="rounded-lg bg-slate-900 p-4">
                Tampa Deal
                <div className="text-emerald-400">$395 cash flow</div>
              </div>

              <div className="rounded-lg bg-slate-900 p-4">
                Dallas Deal
                <div className="text-emerald-400">$310 cash flow</div>
              </div>
            </div>          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Investment score ranking",
            "Cash flow and cap rate modeling",
            "AI-style deal insights",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-lg font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
