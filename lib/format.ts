const int = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatInt = (v: number) => int.format(Math.round(v));

export const formatEuros = (v: number) => {
  if (v >= 1_000_000) return `${oneDecimal.format(v / 1_000_000)} M€`;
  if (v >= 1_000) return `${int.format(Math.round(v / 1_000))} k€`;
  return `${int.format(Math.round(v))} €`;
};

export const formatTicket = (v: number) => `${int.format(Math.round(v))} €`;
