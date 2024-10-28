export function formatNumber(
  value: number | string | undefined | null,
  options?: { decimals?: number; emptyValues?: string },
) {
  const decimals = options?.decimals ?? 2;
  const emptyValues = options?.emptyValues ?? "-";

  if (typeof value === "undefined" || value === null) return emptyValues;

  if (isNaN(Number(value)) || (value as unknown) instanceof Date)
    return value.toString();
  value = Number(value);

  if (value === 0) return emptyValues;

  const formatter = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value);
}

export function truncateNumber(value: string, decimals: number) {
  const [integer, decimal] = value.split(".");
  if (!integer) return value;

  if (!decimal) {
    if (value.includes(".") && decimals > 0) return value;
    return integer;
  }

  return `${integer}.${decimal.slice(0, decimals)}`;
}
