import { notFound } from "next/navigation";

import { getCachedDeals } from "@/lib/getCachedDeals";
import {
  getAnnualNOI,
  getCapRate,
  getCashInvested,
  getCashOnCashReturn,
  getMonthlyCashFlow,
  getMonthlyExpenses,
  getMonthlyMortgage,
} from "@/lib/calculations";
import { getInvestmentScore, getScoreLabel } from "@/lib/scoring";
import { getDealSummary } from "@/lib/summary";

function formatCurrency(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(safeValue);
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ marketKey: string; slug: string }>;
}) {
  const { marketKey, slug } = await params;
  const properties = await getCachedDeals(marketKey);

  const property = properties.find(
    (item) => item.slug === slug || item.id === slug
  );

  if (!property) {
    notFound();
  }

  const expenses = getMonthlyExpenses(property);
  const cashFlow = getMonthlyCashFlow(property);
  const capRate = getCapRate(property);
  const cashOnCash = getCashOnCashReturn(property);
  const annualNOI = getAnnualNOI(property);
  const cashInvested = getCashInvested(property);
  const monthlyMortgage = getMonthlyMortgage(property.price);
  const score = getInvestmentScore(property);
  const scoreLabel = getScoreLabel(score);
  const ai = getDealSummary(property);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <img
            src={property.image || "/placeholder-house.svg"}
            alt={property.address}
            className="h-72 w-full object-cover"
          />

          <div className="p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-400">
                  {marketKey}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">{property.address}</h1>
                <p className="mt-2 text-slate-400">
                  {property.city}, {property.state}
                  {property.beds > 0 ? ` • ${property.beds} bd` : ""}
                  {property.baths > 0 ? ` • ${property.baths} ba` : ""}
                  {property.sqft > 0 ? ` • ${property.sqft.toLocaleString()} sqft` : ""}
                  {property.propertyType ? ` • ${property.propertyType}` : ""}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 px-5 py-4">
                <div className="text-sm text-slate-400">Investment Score</div>
                <div className="mt-1 text-3xl font-semibold text-sky-300">
                  {score.toFixed(1)}
                </div>
                <div className="text-sm text-slate-400">{scoreLabel}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Purchase Price", value: formatCurrency(property.price) },
                { label: "Est. Monthly Rent", value: formatCurrency(property.estimatedRent) },
                { label: "Monthly Cash Flow", value: formatCurrency(cashFlow) },
                { label: "Cap Rate", value: `${capRate.toFixed(1)}%` },
                { label: "Cash-on-Cash Return", value: `${cashOnCash.toFixed(1)}%` },
                { label: "Cash Invested", value: formatCurrency(cashInvested) },
                { label: "Annual NOI", value: formatCurrency(annualNOI) },
                { label: "Mortgage", value: formatCurrency(monthlyMortgage) },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="text-sm text-slate-400">{metric.label}</div>
                  <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <h2 className="text-lg font-semibold">Monthly Expense Breakdown</h2>

                <div className="mt-5 space-y-4">
                  {[
                    ["Mortgage", expenses.mortgage],
                    ["Taxes", expenses.taxes],
                    ["Insurance", expenses.insurance],
                    ["HOA", expenses.hoa],
                    ["Vacancy", expenses.vacancy],
                    ["Maintenance", expenses.maintenance],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-medium">{formatCurrency(Number(value))}</span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                    <span className="text-slate-300">Total Expenses</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(expenses.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <h2 className="text-lg font-semibold">Why This Deal Ranks Well</h2>
                <p className="mt-4 text-sm leading-6 text-slate-300">{ai.summary}</p>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-emerald-400">Strengths</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {ai.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-amber-400">Risks</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {ai.risks.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-900 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Best Strategy
                  </div>
                  <div className="mt-2 font-medium">{ai.strategy}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}