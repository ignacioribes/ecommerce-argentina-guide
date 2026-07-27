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
      tiendanube: "Gratis con Pago Nube en todos los planes",
      shopify: "Incluida si usás Shopify Payments",
      empretienda: "Sin comisión por venta en ningún caso",
    },
  },
  {
    group: "Comisiones",
    label: "Comisión con pasarelas externas",
    values: {
      tiendanube: "2% (Esencial) → 1% (Impulso) → 0,7% (Escala)",
      shopify: "2% (Basic) → 1% (Grow) → 0,6% (Advanced) → 0,2% (Plus)",
      empretienda: "Sin comisión (Mercado Pago, Ualá Bis, efectivo, transferencia)",
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
      tiendanube: "No destacado en el pricing público",
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
  "Tiendanube cobra una comisión adicional por «liberación del dinero» con Pago Nube (desde 2,99% + IVA hasta 3,50% + IVA según el plan), separada de la comisión por transacción.",
  "Shopify no tiene plan gratis; ofrece prueba de 3 días y luego US$1/mes durante 3 meses antes de pasar al precio de lista.",
  "Empretienda tiene un único plan (todo incluido) sin escalones de funcionalidades, a diferencia de Tiendanube y Shopify.",
  "Última actualización: julio 2026.",
];
