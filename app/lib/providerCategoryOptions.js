export const providerCategoryOptions = {
  babysitting: {
    label: "Babysitter or nanny",
    comfortableWithLabel: "Comfortable caring for",
    comfortableWithPlaceholder: "Select age groups",
    comfortableWith: ["Babies", "Toddlers", "Preschool children", "School-age children"],
    skills: ["First aid", "Safeguarding", "Reading and storytelling", "Homework help", "Creative play", "Light meal preparation"],
    preferences: ["Comfortable with pets", "Light household chores", "School or nursery pickup", "Overnight care", "Additional needs care"],
    declarations: [
      { label: "I confirm that I have the right to work in the UK.", required: true },
      { label: "I confirm that I am not barred from working with children.", required: true },
      { label: "I say that I hold a DBS certificate and can show it to clients on request.", required: false },
      { label: "I say that I hold a paediatric first aid certificate.", required: false },
    ],
  },
  cleaning: {
    label: "Cleaner",
    comfortableWithLabel: "Comfortable cleaning",
    comfortableWithPlaceholder: "Select property or work types",
    comfortableWith: ["Homes", "Offices", "Retail spaces", "Restaurants and kitchens", "Warehouses", "End of tenancy"],
    skills: ["Regular cleaning", "Deep cleaning", "Kitchen cleaning", "Bathroom cleaning", "Window cleaning", "End-of-tenancy cleaning"],
    preferences: ["One-off jobs", "Regular jobs", "Domestic clients", "Business clients", "Using client-supplied products", "Using my own products"],
    declarations: [
      { label: "I hold my own public liability insurance and can show it directly to clients.", required: true },
      { label: "I am responsible for applicable COSHH duties when handling cleaning chemicals.", required: true },
      { label: "If I have staff, I am responsible for them and their work.", required: true },
    ],
  },
  cooking: {
    label: "Cook or chef",
    comfortableWithLabel: "Comfortable preparing food for",
    comfortableWithPlaceholder: "Select service types",
    comfortableWith: ["Households", "Offices", "Dinner parties", "Private events", "Catered events", "Meal preparation"],
    skills: ["Private chef service", "Meal preparation", "Dinner parties", "Event catering", "Menu planning", "Batch cooking"],
    preferences: ["Vegetarian menus", "Vegan menus", "Dietary requirements", "Allergen-aware preparation", "Small groups", "Large groups"],
    declarations: [
      { label: "I have registered my food business with my local council before providing food where required.", required: true },
      { label: "I will give clients accurate allergen information for the food I prepare.", required: true },
      { label: "I say that I hold at least a Level 2 food hygiene certificate (recommended).", required: false },
      { label: "If I cook from my own premises, I can provide its food hygiene rating.", required: false },
    ],
  },
};

export const getProviderCategoryOptions = (category) =>
  providerCategoryOptions[category] || providerCategoryOptions.babysitting;
