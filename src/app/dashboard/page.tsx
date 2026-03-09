import Link from "next/link";
import { Building2, DollarSign, LineChart, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { properties } from "@/lib/data";
import { getCachedDeals } from "@/lib/getCachedDeals";
import { getCapRate, getMonthlyCashFlow } from "@/lib/calculations";
import { getInvestmentScore } from "@/lib/scoring";

import { getDeals } from "@/lib/deals";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getScoreColor(score: number) {
  if (score >= 8.5) return "bg-emerald-500/15 text-emerald-400";
  if (score >= 7) return "bg-sky-500/15 text-sky-400";
  if (score >= 5.5) return "bg-amber-500/15 text-amber-400";
  return "bg-red-500/15 text-red-400";
}

export default async function DashboardPage() {
  const properties = await getCachedDeals("orlando-fl");
  
  if (!properties.length) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="text-2xl font-semibold">No cached deals found</h1>
        <p className="mt-2 text-slate-400">
          Trigger a market refresh first to populate this dashboard.
        </p>
      </main>
    );
  }
  
  const deals = properties
    .map((property) => ({
      ...property,
      cashFlow: getMonthlyCashFlow(property),
      capRate: getCapRate(property),
      score: getInvestmentScore(property),
    }))
    .sort((a, b) => b.score - a.score);

  const avgScore =
    deals.reduce((sum, deal) => sum + deal.score, 0) / deals.length;

  const avgCapRate =
    deals.reduce((sum, deal) => sum + deal.capRate, 0) / deals.length;

  const bestCashFlow = Math.max(...deals.map((deal) => deal.cashFlow));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 lg:block">
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400">
              DealFlow AI
            </p>
            <h2 className="mt-2 text-xl font-semibold">Investor Dashboard</h2>
          </div>

          <nav className="space-y-2 px-4">
            {["Dashboard", "Markets", "Deals", "Saved", "Settings"].map((item) => (
              <div
                key={item}
                className={`rounded-xl px-4 py-3 text-sm ${
                  item === "Deals"
                    ? "bg-sky-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex-1">
          <div className="border-b border-slate-800 bg-slate-950 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Top Investment Deals</h1>
                <p className="mt-1 text-sm text-slate-400">
                Deals ranked using cash flow, cap rate, neighborhood quality and risk factors.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Phoenix", "Tampa", "Dallas", "Charlotte"].map((city) => (
                  <button
                    key={city}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="border-slate-800 bg-slate-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm text-slate-400">
                    Avg Investment Score
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-sky-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{avgScore.toFixed(1)}</div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm text-slate-400">
                    Avg Cap Rate
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-sky-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{avgCapRate.toFixed(1)}%</div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm text-slate-400">
                    Best Cash Flow
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-sky-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">
                    {formatCurrency(bestCashFlow)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm text-slate-400">
                    Deals Found
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-sky-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{deals.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="grid grid-cols-12 border-b border-slate-800 px-6 py-4 text-xs uppercase tracking-wide text-slate-400">
                <div className="col-span-4">Property</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Cash Flow</div>
                <div className="col-span-2">Cap Rate</div>
                <div className="col-span-2">Score</div>
              </div>

              {deals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/property/${deal.id}`}
                  className="grid grid-cols-12 items-center px-6 py-4 transition hover:bg-slate-800/60"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <img
                      src={deal.image}
                      className="h-12 w-16 rounded-md object-cover"
                    />

                    <div>
                      <div className="font-medium text-white">{deal.address}</div>
                      <div className="text-sm text-slate-400">
                        {deal.city}, {deal.state}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-slate-200">
                    {formatCurrency(deal.price)}
                  </div>

                  <div className="col-span-2 text-emerald-400">
                    {formatCurrency(deal.cashFlow)}
                  </div>

                  <div className="col-span-2 text-slate-200">
                    {deal.capRate.toFixed(1)}%
                  </div>

                  <div className="col-span-2">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getScoreColor(deal.score)}`}>
                      {deal.score.toFixed(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}