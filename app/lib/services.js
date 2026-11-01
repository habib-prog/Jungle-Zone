import { Baby, SprayCan, ChefHat } from "lucide-react";

// Single source of truth for every service category on JungleZone.
export const services = [
  {
    slug: "babysitting",
    icon: Baby,
    title: "Babysitting",
    desc: "Babysitters and nannies for childcare in your home, one-off or regular.",
    href: "/babysitters?category=babysitting",
  },
  {
    slug: "cleaning",
    icon: SprayCan,
    title: "Cleaning",
    desc: "Individual cleaners and cleaning companies for homes, offices, restaurants and end of tenancy.",
    href: "/babysitters?category=cleaning",
  },
  {
    slug: "cooking",
    icon: ChefHat,
    title: "Cooking",
    desc: "Private chefs, home cooks and caterers for meal prep, dinner parties and events.",
    href: "/babysitters?category=cooking",
  },
];

export const serviceHref = (svc) => svc.href ?? `/#services`;
