export type PosMixedPayment = {
  cashAmount: number;
  cardAmount: number;
  cardReference: string;
  cardProvider?: string;
};
