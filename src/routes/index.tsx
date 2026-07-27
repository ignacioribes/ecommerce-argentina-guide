import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { platforms, rows, notes } from "@/data/platforms";
import { Simulator } from "@/components/Simulator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ComparaTiendas.ar - Comparativa de plataformas de e-commerce en Argentina 2026" },
      {
        name: "description",
        content:
          "Compará Tiendanube, Shopify y Empretienda: precios, comisiones, soporte, IA, envíos y más. Guía actualizada a julio 2026.",
      },
      { property: "og:title", content: "ComparaTiendas.ar - Comparativa e-commerce en Argentina" },
      {
        property: "og:description",
        content:
          "Tiendanube vs Shopify vs Empretienda: precios, comisiones y funcionalidades comparadas lado a lado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

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

function Index() {
  const groups = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const r of rows) {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group)!.push(r);
    }
    return Array.from(map.entries());
  }, []);

  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent-1/30 selection:text-white">
      {/* Header */}
      <header className="border-b border-hairline sticky top-0 z-40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-display tracking-tight text-xl font-bold">
              <span className="font-mono text-2xl font-black bg-gradient-to-r from-[oklch(0.72_0.17_195)] via-[oklch(0.78_0.19_140)] to-[oklch(0.88_0.18_92)] bg-clip-text text-transparent leading-none">
                &gt;&lt;
              </span>
              <div className="flex items-baseline">
                <span className="bg-gradient-to-r from-[oklch(0.72_0.17_195)] to-[oklch(0.78_0.19_140)] bg-clip-text text-transparent font-black tracking-tight">
                  compara
                </span>
                <span className="bg-gradient-to-r from-[oklch(0.78_0.19_140)] to-[oklch(0.88_0.18_92)] bg-clip-text text-transparent font-black tracking-tight">
                  tiendas
                </span>
                <span className="font-mono text-xs text-white/50 ml-0.5 font-semibold">.ar</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
            <a href="#comparativa" className="hover:text-white transition-colors">Comparativa</a>
            <a href="#simulador" className="hover:text-white transition-colors">Simulador</a>
            <a href="#notas" className="hover:text-white transition-colors">Notas</a>
            <span className="font-mono text-xs bg-surface-2 border border-hairline px-2.5 py-1 rounded-full text-white/70">jul 2026</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-14">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-soft mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-[oklch(0.72_0.17_195)] to-[oklch(0.78_0.19_140)]" />
            Guía comparativa · Argentina
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[0.95] text-white">
            ¿Dónde armar tu{" "}
            <span className="italic bg-gradient-to-r from-[oklch(0.72_0.17_195)] via-[oklch(0.78_0.19_140)] to-[oklch(0.88_0.18_92)] bg-clip-text text-transparent">
              tienda online
            </span>{" "}
            en Argentina?
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft leading-relaxed">
            Precios, comisiones, soporte y funcionalidades de las plataformas más usadas del país,
            puestas al lado una de la otra. Sin humo, con las letras chicas incluidas.
          </p>
        </div>

        {/* Platform cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((p, i) => (
            <article
              key={p.id}
              className="group relative rounded-2xl border border-hairline bg-card p-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_-20px_oklch(0.72_0.17_195/0.2)]"
            >
              <div className="flex items-start justify-between">
                <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest ${accentText[p.accent]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${accentClass[p.accent]}`} />
                  0{i + 1}
                </span>
                <span className="text-xs text-ink-soft/80 font-mono">{p.origin}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white">
                {p.name}
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{p.tagline}</p>
              <div className={`mt-6 h-1 w-12 rounded-full ${accentClass[p.accent]}`} />
            </article>
          ))}
        </div>
      </section>

      {/* Simulator */}
      <Simulator />

      {/* Comparison */}
      <section id="comparativa" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              La comparativa, punto por punto
            </h2>
            <p className="mt-2 text-ink-soft">Filtrá para encontrar lo que te importa.</p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar (ej: comisión, envío, IA…)"
              className="w-full rounded-full border border-hairline bg-card px-5 py-3 text-sm text-white placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-accent-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-hairline bg-card">
          <table className="w-full min-w-[840px] border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-surface-2/40">
                <th className="sticky left-0 z-10 bg-card text-left px-6 py-5 w-[220px] font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                  Característica
                </th>
                {platforms.map((p) => (
                  <th
                    key={p.id}
                    className="text-left px-6 py-5 font-display text-lg font-semibold text-white align-bottom"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${accentClass[p.accent]}`} />
                      {p.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map(([group, groupRows]) => {
                const filtered = groupRows.filter((r) => {
                  if (!q) return true;
                  const hay = [r.label, ...Object.values(r.values)].join(" ").toLowerCase();
                  return hay.includes(q);
                });
                if (filtered.length === 0) return null;
                return (
                  <Fragment key={`g-${group}`}>
                    <tr className="bg-surface-2/80">
                      <td
                        colSpan={4}
                        className="sticky left-0 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-white/90 font-semibold"
                      >
                        · {group}
                      </td>
                    </tr>
                    {filtered.map((r, idx) => (
                      <tr
                        key={`${group}-${r.label}`}
                        className={`border-t border-hairline/70 transition-colors hover:bg-surface-2/30 ${idx % 2 === 1 ? "bg-surface/30" : ""}`}
                      >
                        <td className="sticky left-0 z-10 bg-inherit px-6 py-5 align-top font-medium text-white w-[220px]">
                          {r.label}
                        </td>
                        {platforms.map((p) => (
                          <td
                            key={p.id}
                            className="px-6 py-5 align-top text-sm text-ink-soft leading-relaxed"
                          >
                            {r.values[p.id]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notes */}
      <section id="notas" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-hairline bg-surface-2/80 p-8 md:p-12 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent-3" />
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">La letra chica</h2>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {notes.map((n, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                <span className="font-mono text-xs mt-1 text-accent-1 font-bold">0{i + 1}</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm text-ink-soft">
          <p>
            Datos tomados de los sitios oficiales de cada plataforma en su versión Argentina.
          </p>
          <p className="font-mono text-xs text-white/50">Actualizado · julio 2026</p>
        </div>
      </footer>
    </main>
  );
}
