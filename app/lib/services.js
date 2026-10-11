import { Baby, SprayCan, ChefHat } from "lucide-react";

// Single source of truth for every service category on JungleZone.
// `href` is only set for categories that already have a live listing page;
// `status` is the label shown on the others (cleaning is next, cooking after that).
export const services = [
  {
    slug: "babysitting",
    icon: Baby,
    title: "Babysitting",
    desc: "Babysitters and nannies for childcare in your home, one-off or regular.",
    href: "/babysitters",
    status: "Live",
  },
  {
    slug: "cleaning",
    icon: SprayCan,
    title: "Cleaning",
    desc: "Individual cleaners and cleaning companies for homes, offices, restaurants and end of tenancy.",
    status: "Coming next",
  },
  {
    slug: "cooking",
    icon: ChefHat,
    title: "Cooking",
    desc: "Private chefs, home cooks and caterers for meal prep, dinner parties and events.",
    status: "Coming later",
  },
];

export const serviceHref = (svc) => svc.href ?? `/#services`;
