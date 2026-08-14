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
