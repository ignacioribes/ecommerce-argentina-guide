import { useMemo, useState } from "react";
import { z } from "zod";
import { ChevronDown, ChevronUp, Calculator, Zap } from "lucide-react";
import { platforms } from "@/data/platforms";
import { platformPlans, type Plan } from "@/data/plans";

// ---------------------------------------------------------------------------
// Accent helpers
// ---------------------------------------------------------------------------
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
const accentBorder: Record<string, string> = {
  "accent-1": "border-accent-1",
  "accent-2": "border-accent-2",
  "accent-3": "border-accent-3",
};
const accentBg10: Record<string, string> = {
  "accent-1": "bg-accent-1/10",
  "accent-2": "bg-accent-2/10",
  "accent-3": "bg-accent-3/10",
};

// ---------------------------------------------------------------------------
// Key features definition
// ---------------------------------------------------------------------------
type Feature = {
  id: string;
  label: string;
  emoji: string;
  /** Weight per platform (0-1). Higher = platform supports this well. */
  weights: Record<string, number>;
};

const KEY_FEATURES: Feature[] = [
  {
    id: "plan_gratuito",
    label: "Plan gratuito",
    emoji: "🎁",
    weights: { tiendanube: 1, shopify: 0, empretienda: 0.3 },
  },
  {
    id: "facturacion_ars",
    label: "Facturación en ARS",
    emoji: "🇦🇷",
    weights: { tiendanube: 1, shopify: 0, empretienda: 1 },
  },
  {
    id: "sin_comision",
    label: "Sin comisión por venta",
    emoji: "💸",
    weights: { tiendanube: 0.3, shopify: 0.1, empretienda: 1 },
  },
  {
    id: "ia_integrada",
    label: "IA integrada",
    emoji: "🤖",
    weights: { tiendanube: 0.5, shopify: 1, empretienda: 0 },
  },
  {
    id: "pos_fisico",
    label: "Punto de venta físico",
    emoji: "🏪",
    weights: { tiendanube: 0.2, shopify: 1, empretienda: 0 },
  },
  {
    id: "soporte_247",
    label: "Soporte 24/7",
    emoji: "🎧",
    weights: { tiendanube: 0.4, shopify: 1, empretienda: 0.5 },
  },
  {
    id: "productos_digitales",
    label: "Productos digitales",
    emoji: "📦",
    weights: { tiendanube: 0.5, shopify: 0.5, empretienda: 1 },
  },
  {
    id: "multi_idioma",
    label: "Multi-idioma / moneda",
    emoji: "🌐",
    weights: { tiendanube: 1, shopify: 1, empretienda: 0.1 },
  },
  {
    id: "envios_locales",
    label: "Envíos locales (OCA, Correo…)",
    emoji: "🚚",
    weights: { tiendanube: 0.8, shopify: 0.4, empretienda: 1 },
  },
  {
    id: "apps_ecosistema",
    label: "Ecosistema de apps",
    emoji: "🛒",
    weights: { tiendanube: 0.7, shopify: 1, empretienda: 0.2 },
  },
];

function compatibilityScore(platformId: string, selected: Set<string>): number {
  if (selected.size === 0) return -1; // means "not shown"
  let total = 0;
  let sum = 0;
  for (const f of KEY_FEATURES) {
    if (selected.has(f.id)) {
      sum += (f.weights[platformId] ?? 0);
      total += 1;
    }
  }
  return total === 0 ? 0 : Math.round((sum / total) * 100);
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
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

const TIENDA_NUBE_RELEASE_FEES = [
  { days: 1, label: "1 día", lowerRate: 0.0559, upperRate: 0.064 },
  { days: 7, label: "7 días", lowerRate: 0.0389, upperRate: 0.0445 },
  { days: 14, label: "14 días", lowerRate: 0.0299, upperRate: 0.035 },
] as const;

function estimateTiendaNubeReleaseCost(revenue: number) {
  return TIENDA_NUBE_RELEASE_FEES.map(({ days, label, lowerRate, upperRate }) => ({
    days,
    label,
    lowerRate,
    upperRate,
    minCost: revenue * lowerRate,
    maxCost: revenue * upperRate,
  }));
}

function planPriceARS(plan: Plan, billing: "monthly" | "annual", usdRate: number) {
  const raw =
    billing === "annual" && plan.monthlyAnnual != null
      ? plan.monthlyAnnual
      : plan.monthlyMonthly;
  return plan.currency === "USD" ? raw * usdRate : raw;
}

// ---------------------------------------------------------------------------
// Score badge colors
// ---------------------------------------------------------------------------
function scoreBadgeStyle(score: number): string {
  if (score >= 75) return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
  if (score >= 50) return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
  return "bg-red-500/20 text-red-300 border border-red-500/40";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Simulator() {
  const [isOpen, setIsOpen] = useState(false);

  // -- Raw input state (live) --
  const [revenueStr, setRevenueStr] = useState("1500000");
  const [usdRateStr, setUsdRateStr] = useState("1500");
  const [gateway, setGateway] = useState<"own" | "external">("own");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  // -- Calculated snapshot (only updated when user clicks "Calcular") --
  type CalcSnapshot = {
    revenue: number;
    usdRate: number;
    gateway: "own" | "external";
    billing: "monthly" | "annual";
  };
  const [snapshot, setSnapshot] = useState<CalcSnapshot>({
    revenue: 1_500_000,
    usdRate: 1_300,
    gateway: "own",
    billing: "monthly",
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // -- Feature selection --
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // Mark dirty when any input changes
  // ---------------------------------------------------------------------------
  function handleRevenueChange(val: string) {
    setRevenueStr(val);
    setIsDirty(true);
  }
  function handleUsdRateChange(val: string) {
    setUsdRateStr(val);
    setIsDirty(true);
  }
  function handleGatewayChange(val: "own" | "external") {
    setGateway(val);
    setIsDirty(true);
  }
  function handleBillingChange(val: "monthly" | "annual") {
    setBilling(val);
    setIsDirty(true);
  }

  // ---------------------------------------------------------------------------
  // Calculate handler
  // ---------------------------------------------------------------------------
  function handleCalculate() {
    const parsed = inputSchema.safeParse({
      revenue: Number(revenueStr) || 0,
      usdRate: Number(usdRateStr) || 1,
    });
    const revenue = parsed.success ? parsed.data.revenue : 0;
    const usdRate = parsed.success ? parsed.data.usdRate : 1_300;

    setIsCalculating(true);
    // Short visual delay for "calculating" feel
    setTimeout(() => {
      setSnapshot({ revenue, usdRate, gateway, billing });
      setHasCalculated(true);
      setIsDirty(false);
      setIsCalculating(false);
    }, 350);
  }

  // ---------------------------------------------------------------------------
  // Results — computed from the SNAPSHOT (not live inputs)
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    return platforms.map((platform) => {
      const bundle = platformPlans.find((p) => p.platformId === platform.id);
      const plans = (bundle?.plans ?? []).map((plan) => {
        const planARS = planPriceARS(plan, snapshot.billing, snapshot.usdRate);
        const feeRate = snapshot.gateway === "own" ? plan.ownFee : plan.externalFee;
        const commissionARS = snapshot.revenue * feeRate;
        const totalARS = planARS + commissionARS;
        return { plan, planARS, feeRate, commissionARS, totalARS };
      });
      const cheapest = plans.reduce(
        (acc, p) => (acc == null || p.totalARS < acc.totalARS ? p : acc),
        null as null | (typeof plans)[number],
      );
      return { platform, plans, cheapest };
    });
  }, [snapshot]);

  const bestOverall = useMemo(() => {
    const flat = results.flatMap((r) =>
      r.plans.map((p) => ({ ...p, platform: r.platform })),
    );
    return flat.reduce(
      (acc, p) => (acc == null || p.totalARS < acc.totalARS ? p : acc),
      null as null | (typeof flat)[number],
    );
  }, [results]);

  const tiendaNubeReleaseCost = useMemo(() => {
    return estimateTiendaNubeReleaseCost(snapshot.revenue);
  }, [snapshot.revenue]);

  // ---------------------------------------------------------------------------
  // Feature toggle
  // ---------------------------------------------------------------------------
  function toggleFeature(id: string) {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Compatibility scores
  // ---------------------------------------------------------------------------
  const scores = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of platforms) {
      map[p.id] = compatibilityScore(p.id, selectedFeatures);
    }
    return map;
  }, [selectedFeatures]);

  const showScores = selectedFeatures.size > 0;

  // Best compatibility platform
  const bestCompat = showScores
    ? Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <section id="simulador" className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-3xl border-2 border-white/20 bg-card overflow-hidden shadow-2xl shadow-black/40 transition-all duration-300">

        {/* ---- Header (Clickable Toggle) ---- */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 md:px-10 py-7 border-b border-white/15 bg-surface-2/40 hover:bg-surface-2/70 transition-colors cursor-pointer select-none"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-accent-1/10 border border-accent-1/30 text-accent-1 mt-1 md:mt-0">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent-1 font-bold">
                    Simulador interactivo
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-white/70">
                    {isOpen ? "Desplegado" : "Pulsá para calcular"}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-2xl md:text-3xl font-semibold text-white flex items-center gap-3">
                  ¿Cuánto te sale vender por mes?
                </h2>
                <p className="mt-1 text-sm text-ink-soft max-w-xl">
                  Calculá tu costo real (plan + comisiones) según tu facturación mensual proyectada.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto">
              {!isOpen && hasCalculated && bestOverall && snapshot.revenue > 0 && (
                <div className="hidden sm:block text-right">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-accent-1 font-bold">
                    Más conveniente
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {bestOverall.platform.name} ({formatARS(bestOverall.totalARS)}/mes)
                  </p>
                </div>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-all shadow-sm"
              >
                <span>{isOpen ? "Ocultar" : "Simular costos"}</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">

            {/* ---- Controls ---- */}
            <div className="px-6 md:px-10 py-8 bg-surface/40 border-b border-hairline">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                    Facturación mensual (ARS)
                  </span>
                  <div className="mt-2 flex items-center rounded-xl border border-hairline bg-card focus-within:ring-2 focus-within:ring-accent-1">
                    <span className="pl-4 text-ink-soft">$</span>
                    <input
                      id="sim-revenue"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={1_000_000_000}
                      value={revenueStr}
                      onChange={(e) => handleRevenueChange(e.target.value)}
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
                      id="sim-usd-rate"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={100000}
                      value={usdRateStr}
                      onChange={(e) => handleUsdRateChange(e.target.value)}
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
                        id={`sim-gateway-${g}`}
                        onClick={() => handleGatewayChange(g)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${gateway === g
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
                        id={`sim-billing-${b}`}
                        onClick={() => handleBillingChange(b)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${billing === b
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

              {/* ---- Key Features chips ---- */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-3.5 w-3.5 text-accent-3" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                    Funcionalidades que necesitás
                  </span>
                  {selectedFeatures.size > 0 && (
                    <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white/70 cursor-pointer transition-colors"
                      onClick={() => setSelectedFeatures(new Set())}
                    >
                      Limpiar selección
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {KEY_FEATURES.map((f) => {
                    const isSelected = selectedFeatures.has(f.id);
                    return (
                      <button
                        key={f.id}
                        id={`sim-feature-${f.id}`}
                        onClick={() => toggleFeature(f.id)}
                        className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${isSelected
                            ? "border-accent-1/60 bg-accent-1/15 text-white shadow-sm shadow-accent-1/20 scale-[1.03]"
                            : "border-white/15 bg-white/5 text-ink-soft hover:border-white/30 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---- Calculate button ---- */}
              <div className="mt-7 flex items-center gap-4">
                <button
                  id="sim-calculate-btn"
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className={`relative inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold shadow-lg transition-all duration-200 ${isDirty || !hasCalculated
                      ? "bg-gradient-to-r from-[oklch(0.72_0.17_195)] to-[oklch(0.78_0.19_140)] text-[oklch(0.12_0.02_255)] shadow-[oklch(0.72_0.17_195/0.35)] hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                      : "bg-surface-2 text-white/60 border border-white/15 cursor-not-allowed shadow-none"
                    }`}
                >
                  {isCalculating ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Calculando…</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      <span>Calcular</span>
                    </>
                  )}
                  {(isDirty || !hasCalculated) && !isCalculating && (
                    <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-accent-3 border-2 border-card animate-pulse" />
                  )}
                </button>

                {!isDirty && hasCalculated && (
                  <span className="text-xs text-ink-soft/60 font-mono">
                    ✓ Resultados actualizados
                  </span>
                )}
                {isDirty && hasCalculated && (
                  <span className="text-xs text-amber-400/80 font-mono animate-pulse">
                    Hay cambios sin calcular
                  </span>
                )}
              </div>
            </div>

            {/* ---- Results ---- */}
            {hasCalculated && (
              <div className="p-6 md:p-10 grid gap-6 md:grid-cols-3">
                {results.map(({ platform, plans, cheapest }) => {
                  const score = scores[platform.id];
                  const isBestCompat = bestCompat === platform.id;
                  return (
                    <div
                      key={platform.id}
                      className="rounded-2xl border border-hairline bg-background flex flex-col overflow-hidden"
                    >
                      <div className={`p-5 border-b border-hairline flex items-start justify-between bg-surface-2/40 gap-3`}>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`h-2 w-2 rounded-full shrink-0 ${accentClass[platform.accent]}`} />
                          <h3 className="font-display text-xl font-semibold text-white truncate">
                            {platform.name}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {cheapest && (
                            <span className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${accentText[platform.accent]}`}>
                              desde {formatARS(cheapest.totalARS)}
                            </span>
                          )}
                          {showScores && (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${scoreBadgeStyle(score)}`}>
                                {score}% compatible
                              </span>
                              {isBestCompat && (
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${accentText[platform.accent]} ${accentBg10[platform.accent]} ${accentBorder[platform.accent]}`}>
                                  ★ Mejor fit
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Feature compatibility bar */}
                      {showScores && (
                        <div className="px-5 pt-3 pb-1">
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${score >= 75 ? "bg-emerald-400" : score >= 50 ? "bg-amber-400" : "bg-red-400"
                                }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {platform.id === "tiendanube" && (
                        <div className="border-t border-hairline bg-surface-2/20 px-5 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-accent-1 font-semibold">
                              Liberación con Pago Nube
                            </p>
                            <span className="text-[10px] font-mono text-ink-soft/70">
                              aprox. sobre {formatARS(snapshot.revenue)}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {tiendaNubeReleaseCost.map(({ days, label, lowerRate, upperRate, minCost, maxCost }) => (
                              <div key={days} className="rounded-lg border border-white/10 bg-background/50 px-3 py-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm text-white">{label}</span>
                                  <span className="text-[11px] font-mono text-ink-soft">
                                    {(lowerRate * 100).toFixed(2)}% – {(upperRate * 100).toFixed(2)}%
                                  </span>
                                </div>
                                <p className="mt-1 text-[11px] leading-snug text-ink-soft/80">
                                  desde {formatARS(minCost)} hasta {formatARS(maxCost)}
                                </p>
                              </div>
                            ))}
                          </div>

                          <p className="mt-3 text-[11px] leading-snug text-ink-soft/70">
                            Referencia orientativa para la comisión de liberación; no incluye IVA ni costos de acreditación bancaria.
                          </p>
                        </div>
                      )}

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
                                    <span
                                      className={`rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 border ${accentText[platform.accent]}`}
                                      style={{ borderColor: "currentColor" }}
                                    >
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
                              {plan.note && snapshot.gateway === "own" && (
                                <p className="mt-3 text-[11px] leading-snug text-ink-soft/80 italic">
                                  {plan.note}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---- Empty state (not yet calculated) ---- */}
            {!hasCalculated && !isCalculating && (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="p-4 rounded-2xl bg-accent-1/10 border border-accent-1/20">
                  <Calculator className="h-8 w-8 text-accent-1/60" />
                </div>
                <p className="text-sm text-ink-soft max-w-xs leading-relaxed">
                  Completá tus datos arriba y presioná{" "}
                  <span className="text-white font-semibold">Calcular</span> para ver los resultados.
                </p>
              </div>
            )}

            {isCalculating && (
              <div className="flex items-center justify-center gap-3 py-16">
                <svg className="h-6 w-6 animate-spin text-accent-1" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-sm text-ink-soft font-mono">Calculando costos…</span>
              </div>
            )}

            <p className="px-6 md:px-10 pb-8 text-xs text-ink-soft leading-relaxed">
              Estimación orientativa. No incluye comisiones extra del medio de pago (Mercado Pago, Ualá,
              etc.), IVA, retenciones ni la comisión adicional de <em>liberación</em> que Pago Nube
              cobra sobre cada venta.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
