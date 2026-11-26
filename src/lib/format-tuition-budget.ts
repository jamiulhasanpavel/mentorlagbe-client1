export function formatTuitionBudget(budget?: number | null) {
  if (typeof budget !== "number") return "Negotiable";
  return `${new Intl.NumberFormat("en-BD").format(budget)} BDT/month`;
}
