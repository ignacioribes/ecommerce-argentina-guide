export type NewsItem = {
  id: string;
  title: string;
  date: string;
  body: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export const news: NewsItem[] = [
  {
    id: "actualizacion-octubre-2026",
    title: "Actualización de precios (Tiendanube y Empretienda) y retiro a 30 días en Pago Nube",
    date: "Octubre de 2026",
    body: "Tiendanube aplicó su ajuste trimestral de precios (Esencial $27.999, Impulso $79.999 y Escala $244.999 mensuales, con 25% de descuento en pago anual) y sumó un nuevo plazo de liberación de dinero a 30 días en Pago Nube con comisiones más bajas. Por su parte, Empretienda actualizó el valor de su plan único a $10.490/mes con 15 días de prueba gratuita.",
    table: {
      headers: ["Plan (Pago Nube a 30 días)", "Tasa (tarjeta / MODO)"],
      rows: [
        ["Inicial", "2,99% + IVA"],
        ["Esencial", "2,97% + IVA"],
        ["Impulso", "2,85% + IVA"],
        ["Escala", "2,65% + IVA"],
      ],
    },
  },
  {
    id: "tiendanube-tasas-financiacion",
    title: "Tiendanube mejora tasas de financiación",
    date: "10 de agosto de 2026",
    body: "Desde hoy, lunes 10 de agosto a las 10 horas, las tasas de financiación con Pago Nube son más bajas. Esta mejora te va a permitir ganar más en cada venta.",
    table: {
      headers: ["Cuotas sin interés", "Tasas"],
      rows: [
        ["2", "4,40%"],
        ["3", "10,20%"],
        ["6", "10,30%"],
        ["9", "15,30%"],
        ["12", "21,20%"],
      ],
    },
  },
];
