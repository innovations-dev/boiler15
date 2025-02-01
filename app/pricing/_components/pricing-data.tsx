export const pricingPlans = [
  {
    name: "Hobby",
    price: "Free",
    description: "Perfect for side projects and learning",
    features: [
      "Up to 3 projects",
      "Basic authentication",
      "Community support",
      "Basic analytics",
      "1 team member",
    ] as string[],
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professional developers and small teams",
    popular: true,
    features: [
      "Unlimited projects",
      "Advanced authentication",
      "Priority support",
      "Advanced analytics",
      "Up to 5 team members",
      "Custom domains",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams and organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Unlimited team members",
      "Advanced security",
      "Custom features",
      "Training & onboarding",
    ],
  },
] as const;
