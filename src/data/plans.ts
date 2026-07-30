export type Plan = {
  id: string;
  name: string;
  /** Monthly cost in the platform's billing currency */
  monthlyMonthly: number; // pagado mes a mes
  monthlyAnnual?: number; // pagado anualmente (por mes)
  currency: "ARS" | "USD";
  /** Commission when using an external payment gateway (0-1) */
  externalFee: number;
  /** Commission when using the platform's own payment gateway (0-1) */
  ownFee: number;
  /** Optional extra note */
  note?: string;
};

export type PlatformPlans = {
  platformId: string;
  plans: Plan[];
};

export const platformPlans: PlatformPlans[] = [
  {
    platformId: "tiendanube",
    plans: [
      {
        id: "tn-esencial",
        name: "Esencial",
        monthlyMonthly: 26999,
        monthlyAnnual: 20249,
        currency: "ARS",
        externalFee: 0.02,
        ownFee: 0,
        note: "Pago Nube sin comisión por venta (aplica extra por liberación).",
      },
      {
        id: "tn-impulso",
        name: "Impulso",
        monthlyMonthly: 78999,
        currency: "ARS",
        externalFee: 0.01,
        ownFee: 0,
      },
      {
        id: "tn-escala",
        name: "Escala",
        monthlyMonthly: 234999,
        currency: "ARS",
        externalFee: 0.007,
        ownFee: 0,
      },
    ],
  },
  {
    platformId: "shopify",
    plans: [
      {
        id: "sh-basic",
        name: "Basic",
        monthlyMonthly: 25,
        monthlyAnnual: 19,
        currency: "USD",
        externalFee: 0.02,
        ownFee: 0.02,
      },
      {
        id: "sh-grow",
        name: "Grow",
        monthlyMonthly: 65,
        monthlyAnnual: 49,
        currency: "USD",
        externalFee: 0.01,
        ownFee: 0.01,
      },
      {
        id: "sh-advanced",
        name: "Advanced",
        monthlyMonthly: 399,
        monthlyAnnual: 299,
        currency: "USD",
        externalFee: 0.006,
        ownFee: 0.006,
      },
    ],
  },
  {
    platformId: "empretienda",
    plans: [
      {
        id: "emp-unico",
        name: "Plan único",
        monthlyMonthly: 9490,
        currency: "ARS",
        externalFee: 0,
        ownFee: 0,
        note: "Sin comisión por venta con ningún medio de pago.",
      },
    ],
  },
];
