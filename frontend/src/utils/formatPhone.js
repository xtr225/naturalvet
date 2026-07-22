export function formatPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return value ?? "";
}
