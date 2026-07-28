export type Platform = {
  id: string;
  name: string;
  tagline: string;
  origin: string;
  accent: string; // token name
  url: string; // pricing link
};

export const platforms: Platform[] = [
  {
    id: "tiendanube",
    name: "Tiendanube",
    tagline: "Plataforma latinoamericana, fuerte en AR/BR/MX",
    origin: "Argentina / LATAM",
    accent: "accent-1",
    url: "https://www.tiendanube.com/planes-y-precios",
  },
  {
    id: "shopify",
    name: "Shopify",
    tagline: "Plataforma global (Canadá), estándar internacional",
    origin: "Canadá / Global",
    accent: "accent-2",
    url: "https://www.shopify.com/ar/precios",
  },
  {
    id: "empretienda",
    name: "Empretienda",
    tagline: "Plataforma argentina, +470.000 tiendas creadas",
    origin: "Argentina",
    accent: "accent-3",
    url: "https://www.empretienda.com/#pricing",
  },
];

export type Row = {
  label: string;
  group: string;
  values: Record<string, string>;
};

export const rows: Row[] = [
  {
    group: "Precios",
    label: "Plan gratis",
    values: {
      tiendanube: "Sí (Inicial) — productos, ventas y visitas ilimitadas",
      shopify: "No — prueba de 3 días, luego US$1/mes los primeros 3 meses",
      empretienda: "No — prueba de 30 días gratis, sin configurar medios de pago",
    },
  },
  {
    group: "Precios",
    label: "Plan de entrada pago",
    values: {
      tiendanube: "Esencial: $26.999 ARS/mes (mensual) / $20.249 ARS/mes (anual)",
      shopify: "Basic: US$19/mes (anual) / US$25/mes (mensual)",
      empretienda: "Único plan: $9.490 ARS/mes",
    },
  },
  {
    group: "Precios",
    label: "Plan intermedio",
    values: {
      tiendanube: "Impulso: $78.999 ARS/mes",
      shopify: "Grow: US$49/mes (anual) / US$65/mes (mensual)",
      empretienda: "No tiene niveles — plan único con todo incluido",
    },
  },
  {
    group: "Precios",
    label: "Plan avanzado",
    values: {
      tiendanube: "Escala: $234.999 ARS/mes",
      shopify: "Advanced: US$299/mes (anual) / US$399/mes (mensual)",
      empretienda: "No tiene niveles — plan único con todo incluido",
    },
  },
  {
    group: "Precios",
    label: "Plan enterprise",
    values: {
      tiendanube: "Evolución: a medida, «consultanos»",
      shopify: "Plus: desde US$2.300/mes",
      empretienda: "No ofrece",
    },
  },
  {
    group: "Comisiones",
    label: "Comisión con medios de pago propios",
    values: {
      tiendanube: "Gratis con Pago Nube en todos los planes (sin comisión por transacción)",
      shopify: "⚠️ Shopify Payments no está disponible en Argentina — siempre se usa pasarela externa",
      empretienda: "Sin procesador propio: usa Mercado Pago / Ualá Bis sin comisión adicional de Empretienda",
    },
  },
  {
    group: "Comisiones",
    label: "Comisión con pasarelas externas",
    values: {
      tiendanube: "2% (Esencial) → 1% (Impulso) → 0,7% (Escala)",
      shopify: "2% (Basic) → 1% (Grow) → 0,6% (Advanced) → 0,2% (Plus) — se suma a la comisión del procesador",
      empretienda: "Sin comisión de plataforma (Mercado Pago, Ualá Bis, efectivo, transferencia)",
    },
  },
  {
    group: "Comisiones",
    label: "Moneda de facturación",
    values: {
      tiendanube: "Pesos argentinos (ARS)",
      shopify: "Dólares (USD)",
      empretienda: "Pesos argentinos (ARS)",
    },
  },
  {
    group: "Comisiones",
    label: "Plazo de liberación del dinero",
    values: {
      tiendanube: "1, 7 o 14 días hábiles con Pago Nube (a elegir). +24 hs hábiles adicionales para acreditar en cuenta bancaria/CVU",
      shopify: "Sin solución propia en AR. Con Mercado Pago: desde inmediato hasta 35 días (según tarifa). Con Talo: liquidación instantánea",
      empretienda: "Depende del procesador elegido: MP desde inmediato hasta 35 días; Ualá Bis según sus condiciones",
    },
  },
  {
    group: "Comisiones",
    label: "Costo de liberación (tarjeta / MODO)",
    values: {
      tiendanube: "1 día: 6,40% → 6,09% → 5,89% → 5,59% + IVA | 7 días: 4,45% → 4,39% → 4,19% → 3,89% + IVA | 14 días: 3,50% → 3,49% → 3,29% → 2,99% + IVA (Inicial → Esencial → Impulso → Escala)",
      shopify: "No aplica (Shopify Payments no disponible en AR). Ejemplo con Mercado Pago: inmediato ~6,29% + IVA; 35 días ~1,49% + IVA",
      empretienda: "Ídem Shopify: depende de la pasarela contratada, no de Empretienda",
    },
  },
  {
    group: "Comisiones",
    label: "Costo de liberación (transferencia)",
    values: {
      tiendanube: "1,50% + IVA (Inicial / Esencial) → 0,99% + IVA (Impulso) → 0,85% + IVA (Escala) — con Pago Nube",
      shopify: "Con Talo: 1% (total 3% sumando el fee de Shopify Basic). Sin comisión de plataforma si el procesador no la cobra",
      empretienda: "Sin comisión de Empretienda. Aplica lo que cobre el procesador (ej. Mercado Pago / Ualá Bis)",
    },
  },
  {
    group: "Producto",
    label: "Soporte",
    values: {
      tiendanube: "Email desde Esencial, +WhatsApp desde Impulso",
      shopify: "Chat en vivo 24/7 en todos los planes; prioritario en Plus",
      empretienda: "Atención humana vía email (se presentan como «anti-bots»)",
    },
  },
  {
    group: "Producto",
    label: "Diseño y personalización",
    values: {
      tiendanube: "+65 diseños; HTML/CSS/JS libre en todos los planes pagos",
      shopify: "Temas incluidos; personalización de checkout limitada salvo en Plus",
      empretienda: "Plantillas editables con secciones, CSS y HTML",
    },
  },
  {
    group: "Producto",
    label: "Multi-idioma / multi-moneda",
    values: {
      tiendanube: "Incluido",
      shopify: "Incluido (traducciones y Shopify Markets)",
      empretienda: "No mencionado en la página",
    },
  },
  {
    group: "Producto",
    label: "Apps e integraciones",
    values: {
      tiendanube: "Tienda de apps propia, con tarifas especiales según plan",
      shopify: "App Store de Shopify (miles de apps)",
      empretienda: "Google Shopping, Facebook/WhatsApp, Analytics, Píxel",
    },
  },
  {
    group: "Producto",
    label: "IA integrada",
    values: {
      tiendanube: "Recursos de IA con límite mensual (30 / 150 / ilimitado)",
      shopify: "Sidekick (asistente IA) + «millones de tokens» en todos los planes",
      empretienda: "No ofrece",
    },
  },
  {
    group: "Producto",
    label: "Punto de venta físico (POS)",
    values: {
      tiendanube: "No es un foco central del pricing público",
      shopify: "POS Pro: US$89/mes por sucursal (incluido parcial en Plus)",
      empretienda: "No ofrece",
    },
  },
  {
    group: "Producto",
    label: "Productos digitales",
    values: {
      tiendanube: "Vía apps",
      shopify: "Vía apps",
      empretienda: "Incluido: descarga automática por link",
    },
  },
  {
    group: "Producto",
    label: "Envíos",
    values: {
      tiendanube: "Envío Nube + más de 30 medios desde Esencial",
      shopify: "Integraciones de envío vía apps y Shopify Shipping",
      empretienda: "OCA, Correo Argentino, Andreani, E-Pick, retiro en punto",
    },
  },
];

export const notes: string[] = [
  "Los precios de Tiendanube y Empretienda están en pesos argentinos; los de Shopify están en dólares y son los publicados en la versión Argentina del sitio (shopify.com/ar).",
  "Tiendanube cobra una comisión por «liberación del dinero» con Pago Nube separada de la comisión por transacción: va desde 0,85% + IVA (transferencia en Escala) hasta 6,40% + IVA (tarjeta a 1 día en Inicial), según el plazo elegido y el plan.",
  "Shopify Payments no está disponible en Argentina: toda tienda Shopify necesita una pasarela externa (Mercado Pago, Mobbex, Talo, etc.) y paga además la comisión de Shopify por pasarela externa (2% en Basic hasta 0,2% en Plus).",
  "Shopify no tiene plan gratis; ofrece prueba de 3 días y luego US$1/mes durante 3 meses antes de pasar al precio de lista.",
  "Empretienda tiene un único plan (todo incluido) sin escalones de funcionalidades, a diferencia de Tiendanube y Shopify.",
  "Última actualización: julio 2026.",
];
