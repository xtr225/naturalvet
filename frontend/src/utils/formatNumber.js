export function formatNumber(value, options = {}) {
  return new Intl.NumberFormat("es-PE", options).format(value);
}
