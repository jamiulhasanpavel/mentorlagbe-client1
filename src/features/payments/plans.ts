const freePlan = {
  id: "free",
  name: "Free",
  price: "৳0",
  amount: 0,
  description: "For learners who are starting their search.",
  features: ["Browse all tuitions", "Create one application", "Basic profile"],
  popular: false,
};

export const paidPlans = [
  {
    id: "student-plus",
    name: "Student Plus",
    price: "৳299",
    amount: 299,
    description: "For students who want faster mentor matching.",
    features: [
      "Unlimited applications",
      "Priority placement",
      "Verified tutor badges",
      "Direct support",
    ],
    popular: true,
  },
  {
    id: "tutor-pro",
    name: "Tutor Pro",
    price: "৳499",
    amount: 499,
    description: "For tutors growing their teaching opportunities.",
    features: [
      "Unlimited tuition applications",
      "Tutor profile promotion",
      "Applicant insights",
      "Priority support",
    ],
    popular: false,
  },
] as const;

export const pricingPlans = [freePlan, ...paidPlans];

export function getPaidPlan(planId: string | undefined) {
  return paidPlans.find((plan) => plan.id === planId);
}
