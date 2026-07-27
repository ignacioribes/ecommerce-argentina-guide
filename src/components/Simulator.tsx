import { useMemo, useState } from "react";
import { z } from "zod";
import { platforms } from "@/data/platforms";
import { platformPlans, type Plan } from "@/data/plans";

const accentClass: Record<string, string> = {
  "accent-1": "bg-accent-1",
  "accent-2": "bg-accent-2",
  "accent-3": "bg-accent-3",
};
const accentText: Record<string, string> = {
  "accent-1": "text-accent-1",
  "accent-2": "text-accent-2",
  "accent-3": "text-accent-3",
};

const inputSchema = z.object({
  revenue: z.number().min(0).max(1_000_000_000),
  usdRate: z.number().min(1).max(100_000),
});

function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function planPriceARS(plan: Plan, billing: "monthly" | "annual", usdRate: number) {
  const raw =
    billing === "annual" && plan.monthlyAnnual != null
      ? plan.monthlyAnnual
      : plan.monthlyMonthly;
  return plan.currency === "USD" ? raw * usdRate : raw;
}

export function Simulator() {
  const [revenueStr, setRevenueStr] = useState("1500000");
  const [usdRateStr, setUsdRateStr] = useState("1300");
  const [gateway, setGateway] = useState<"own" | "external">("own");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const parsed = inputSchema.safeParse({
    revenue: Number(revenueStr) || 0,
    usdRate: Number(usdRateStr) || 1,
  });
  const revenue = parsed.success ? parsed.data.revenue : 0;
  const usdRate = parsed.success ? parsed.data.usdRate : 1300;

  const results = useMemo(() => {
    return platforms.map((platform) => {
      const bundle = platformPlans.find((p) => p.platformId === platform.id);
      const plans = (bundle?.plans ?? []).map((plan) => {
        const planARS = planPriceARS(plan, billing, usdRate);
        const feeRate = gateway === "own" ? plan.ownFee : plan.externalFee;
        const commissionARS = revenue * feeRate;
        const totalARS = planARS + commissionARS;
        return { plan, planARS, feeRate, commissionARS, totalARS };
      });
      const cheapest = plans.reduce(
        (acc, p) => (acc == null || p.totalARS < acc.totalARS ? p : acc),
        null as null | (typeof plans)[number],
      );
      return { platform, plans, cheapest };
    });
  }, [revenue, usdRate, gateway, billing]);

  const bestOverall = useMemo(() => {
    const flat = results.flatMap((r) =>
      r.plans.map((p) => ({ ...p, platform: r.platform })),
    );
    return flat.reduce(
      (acc, p) => (acc == null || p.totalARS < acc.totalARS ? p : acc),
      null as null | (typeof flat)[number],
    );
  }, [results]);

  return (
    <section id="simulador" className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-3xl border border-hairline bg-card overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-10 py-8 border-b border-hairline">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-3" />
                Simulador de costos
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-white">
                ¿Cuánto te sale vender por mes?
              </h2>
              <p className="mt-2 text-ink-soft max-w-xl">
                Ingresá tu facturación mensual y compará el costo real (plan + comisiones) en cada plataforma.
              </p>
            </div>
            {bestOverall && revenue > 0 && (
              <div className="rounded-2xl bg-surface-2 border border-hairline p-4 min-w-[220px]">
                <p className="text-[11px] font-mono uppercase tracking-widest text-accent-1 font-bold">
                  Más conveniente
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-white">
                  {bestOverall.platform.name} · {bestOverall.plan.name}
                </p>
                <p className="mt-1 text-sm text-ink-soft font-mono">
                  {formatARS(bestOverall.totalARS)} / mes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 md:px-10 py-8 bg-surface/40 border-b border-hairline">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                Facturación mensual (ARS)
              </span>
              <div className="mt-2 flex items-center rounded-xl border border-hairline bg-card focus-within:ring-2 focus-within:ring-accent-1">
                <span className="pl-4 text-ink-soft">$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1_000_000_000}
                  value={revenueStr}
                  onChange={(e) => setRevenueStr(e.target.value)}
                  className="w-full bg-transparent px-2 py-3 text-lg font-medium text-white focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                Cotización USD (ARS)
              </span>
              <div className="mt-2 flex items-center rounded-xl border border-hairline bg-card focus-within:ring-2 focus-within:ring-accent-1">
                <span className="pl-4 text-ink-soft">$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={100000}
                  value={usdRateStr}
                  onChange={(e) => setUsdRateStr(e.target.value)}
                  className="w-full bg-transparent px-2 py-3 text-lg font-medium text-white focus:outline-none"
                />
              </div>
            </label>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                Medio de pago
              </span>
              <div className="mt-2 inline-flex rounded-xl border border-hairline bg-card p-1 w-full">
                {(["own", "external"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGateway(g)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      gateway === g
                        ? "bg-white text-background font-bold shadow-sm"
                        : "text-ink-soft hover:text-white"
                    }`}
                  >
                    {g === "own" ? "Propio" : "Externo"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                Facturación del plan
              </span>
              <div className="mt-2 inline-flex rounded-xl border border-hairline bg-card p-1 w-full">
                {(["monthly", "annual"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      billing === b
                        ? "bg-white text-background font-bold shadow-sm"
                        : "text-ink-soft hover:text-white"
                    }`}
                  >
                    {b === "monthly" ? "Mensual" : "Anual"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 md:p-10 grid gap-6 md:grid-cols-3">
          {results.map(({ platform, plans, cheapest }) => (
            <div
              key={platform.id}
              className="rounded-2xl border border-hairline bg-background flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-hairline flex items-center justify-between bg-surface-2/40">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accentClass[platform.accent]}`} />
                  <h3 className="font-display text-xl font-semibold text-white">
                    {platform.name}
                  </h3>
                </div>
                {cheapest && (
                  <span className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${accentText[platform.accent]}`}>
                    desde {formatARS(cheapest.totalARS)}
                  </span>
                )}
              </div>

              <ul className="divide-y divide-hairline/70">
                {plans.map(({ plan, planARS, feeRate, commissionARS, totalARS }) => {
                  const isCheapest = cheapest?.plan.id === plan.id;
                  const isBestOverall = bestOverall?.plan.id === plan.id;
                  return (
                    <li key={plan.id} className={`p-5 ${isBestOverall ? "bg-surface-2/60" : ""}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{plan.name}</span>
                          {isBestOverall && (
                            <span className="rounded-full bg-accent-1 text-background text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5">
                              Mejor
                            </span>
                          )}
                          {isCheapest && !isBestOverall && (
                            <span className={`rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 border ${accentText[platform.accent]}`} style={{ borderColor: "currentColor" }}>
                              Óptimo
                            </span>
                          )}
                        </div>
                        <span className="font-display text-lg font-semibold text-white tabular-nums">
                          {formatARS(totalARS)}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-ink-soft">
                        <dt>Plan</dt>
                        <dd className="text-right tabular-nums text-white/90">{formatARS(planARS)}</dd>
                        <dt>
                          Comisión{" "}
                          <span className="font-mono">
                            ({(feeRate * 100).toFixed(feeRate < 0.01 ? 2 : 1)}%)
                          </span>
                        </dt>
                        <dd className="text-right tabular-nums text-white/90">
                          {commissionARS === 0 ? "—" : formatARS(commissionARS)}
                        </dd>
                      </dl>
                      {plan.note && gateway === "own" && (
                        <p className="mt-3 text-[11px] leading-snug text-ink-soft/80 italic">
                          {plan.note}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="px-6 md:px-10 pb-8 text-xs text-ink-soft leading-relaxed">
          Estimación orientativa. No incluye comisiones extra del medio de pago (Mercado Pago, Ualá,
          etc.), IVA, retenciones ni la comisión adicional de <em>liberación</em> que Pago Nube
          cobra sobre cada venta.
        </p>
      </div>
    </section>
  );
}
