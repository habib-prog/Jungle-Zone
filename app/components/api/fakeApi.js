//  Navbar items
export const navItems = [
  { navText: "Home", navLink: "/" },
  { navText: "Blogs", navLink: "/blogs" },
  { navText: "About Us", navLink: "/about-us" },
  { navText: "Pricing", navLink: "/pricing" },
  { navText: "Contact", navLink: "/contact" },
];

// About Us data
export const aboutUsData = {
  title: "About Us",
  heading:
    "UK Online Introduction Platform for Parents & Independent Babysitters",
  description:
    "JungleZone is an online introduction platform created to make it easier for parents and independent babysitters to discover and connect with each other. JungleZone does not provide childcare services, employ or supply babysitters, or make childcare arrangements on behalf of users. Parents and babysitters remain responsible for deciding whether they wish to enter into an arrangement with each other.",
  features: [
    {
      icon: "🤝",
      title: "Direct Connections",
      description:
        "Find and connect with independent babysitters in your area.",
    },
    {
      icon: "⭐",
      title: "Choice",
      description:
        "Browse profiles and decide for yourself who may be suitable for your family's needs.",
    },
    {
      icon: "💰",
      title: "Direct Arrangements",
      description:
        "Agree service availability, hourly rate and payment directly with your chosen provider.",
    },
  ],
  ctaText: "Learn More About Us",
};

// Work States Data for Customers and Workers
export const workStatesForCustomerData = [
  {
    id: 1,
    title: "Sign Up for Free",
    description:
      "Create an account to start searching for independent babysitter profiles in your area.",
    imgSrc:
      "https://i.fbcd.co/products/original/9847a67d09a39d0ef02f4cacc70490cdbe8cae2a1f7c9a2e5bf23e9a126137ec.jpg",
    stepNumber: "01",
    duration: "2 minutes",
    ctaText: "Get Started",
    ctaLink: "/signup",
    benefits: [
      "No credit card required",
      "Instant access",
      "Browse local profiles",
    ],
    badge: "Quick & Easy",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "Search Local Profiles",
    description:
      "Filter by location, rate, and availability to find babysitters who match your requirements.",
    imgSrc:
      "https://www.shutterstock.com/image-vector/blogging-3d-isometry-concept-web-600nw-2639028933.jpg",
    stepNumber: "02",
    duration: "5 minutes",
    ctaText: "Browse Babysitters",
    ctaLink: "/babysitters",
    benefits: [
      "Location-based search",
      "Direct comparison",
      "Transparent hourly service rates",
    ],
    badge: "Smart Search",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "Communicate Directly",
    description:
      "Connect and message babysitters safely to discuss requirements, arrange interviews, and conduct your own checks.",
    imgSrc:
      "https://thumbs.dreamstime.com/b/chat-bubble-message-communication-icon-dialogue-discussion-vector-design-generative-ai-versatile-symbolizing-messages-406998690.jpg",
    stepNumber: "03",
    duration: "Ongoing",
    ctaText: "Start Messaging",
    ctaLink: "/messages",
    benefits: [
      "Direct communication",
      "Arrange interviews",
      "Agree terms directly",
    ],
    badge: "Direct Contact",
    color: "#FF9800",
  },
];

// Work States Data for Workers
export const workStatesForWorkerData = [
  {
    id: 1,
    title: "Create a Profile",
    description:
      "Complete your profile with accurate information about yourself, your experience, availability and preferred hourly rate.",
    imgSrc:
      "https://i.fbcd.co/products/original/9847a67d09a39d0ef02f4cacc70490cdbe8cae2a1f7c9a2e5bf23e9a126137ec.jpg",
    stepNumber: "01",
    duration: "10 minutes",
    ctaText: "Create Profile",
    ctaLink: "/register",
    benefits: [
      "Free to list profile",
      "Showcase your experience",
      "Use JungleZone service rates",
    ],
    badge: "Independent Sitter",
    color: "#4CAF50",
    documentsRequired: [
      "Photo ID (to show parents)",
      "DBS certificate (if held)",
      "First aid certificate (if held)",
      "Childcare references (if held)",
    ],
  },
  {
    id: 2,
    title: "Connect with Local Families",
    description:
      "Let local parents discover your profile and get in touch directly.",
    imgSrc:
      "https://png.pngtree.com/png-clipart/20230923/original/pngtree-happy-family-symbol-illustration-care-design-icon-vector-png-image_12664533.png",
    stepNumber: "02",
    duration: "5 minutes",
    ctaText: "Browse Families",
    ctaLink: "/worker/search",
    benefits: ["Local visibility", "Direct inquiries", "Flexible schedule"],
    badge: "Find Work",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "Agree Childcare Directly",
    description:
      "Set your own hourly rate and agree availability, service details and payments directly with customers.",
    imgSrc:
      "https://thumbs.dreamstime.com/b/chat-bubble-message-communication-icon-dialogue-discussion-vector-design-generative-ai-versatile-symbolizing-messages-406998690.jpg",
    stepNumber: "03",
    duration: "Ongoing",
    ctaText: "View Messages",
    ctaLink: "/worker/messages",
    benefits: [
      "Keep 100% of your earnings",
      "Set your own hourly rates",
      "Set your own terms",
    ],
    badge: "Direct Agreement",
    color: "#FF9800",
  },
];

// Footer items
export const FooterItems = [
  {
    title: "Platform",
    items: [
      { name: "Home", link: "/" },
      { name: "Blogs", link: "/blogs" },
      { name: "About Us", link: "/about-us" },
      { name: "Pricing", link: "/pricing" },
      { name: "Contact", link: "/contact" },
    ],
  },
  {
    title: "Legal & Policies",
    items: [
      { name: "Terms & Conditions", link: "/terms-conditions" },
      { name: "Privacy Policy", link: "/privacy-policy" },
      { name: "Cookies Policy", link: "/cookies-policy" },
    ],
  },
];

// admin dashboard fake api

export const stats = [
  { label: "Total Users", value: 1240 },
  { label: "Babysitters", value: 320 },
  { label: "Pending Approvals", value: 18 },
  { label: "Ongoing Jobs", value: 42 },
  { label: "Total Revenue", value: "$12,450" },
];

export const pendingSitters = [
  { id: 1, name: "Sarah Ahmed", email: "sarah@mail.com", city: "Dhaka" },
  { id: 2, name: "Nusrat Jahan", email: "nusrat@mail.com", city: "Chittagong" },
  { id: 3, name: "Ayesha Khan", email: "ayesha@mail.com", city: "Sylhet" },
];

export const transactions = [
  {
    id: 101,
    user: "John Doe",
    sitter: "Sarah Ahmed",
    amount: "$50",
    status: "Completed",
  },
  {
    id: 102,
    user: "Michael",
    sitter: "Nusrat Jahan",
    amount: "$35",
    status: "Pending",
  },
  {
    id: 103,
    user: "Emily",
    sitter: "Ayesha Khan",
    amount: "$70",
    status: "Completed",
  },
];

export const fakeUsers = [
  {
    id: 1,
    name: "John Carter",
    email: "john@mail.com",
    role: "Parent",
    image:
      "https://img.freepik.com/free-photo/artist-white_1368-6282.jpg?semt=ais_user_personalization&w=740&q=80",
  },
  {
    id: 2,
    name: "Emily Stone",
    email: "emily@mail.com",
    role: "Parent",
    image:
      "https://img.freepik.com/free-photo/non-binary-person-with-glasses-smiling_23-2148760540.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 3,
    name: "Daniel Lee",
    email: "daniel@mail.com",
    role: "Parent",
    image:
      "https://img.freepik.com/free-photo/modern-man-bench_23-2147961432.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 4,
    name: "Ava Khan",
    email: "ava@mail.com",
    role: "Parent",
    image:
      "https://img.freepik.com/free-photo/clueless-confused-charming-woman-with-curly-hair-eyewear-raising-hand-questioned-gesture-sitting-table_176420-24660.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

export const faqData = {
  parentFaqs: [
    {
      question: "How do I find a babysitter?",
      answer:
        "Create an account, enter your location or postcode and browse babysitter profiles in your area. You can review information provided by babysitters and contact those you are interested in. JungleZone does not independently verify profile information unless expressly stated otherwise.",
    },
    {
      question: "Does JungleZone carry out DBS checks on babysitters?",
      answer:
        "No. JungleZone does not carry out or verify DBS checks or background checks on babysitters. Parents and guardians are responsible for carrying out any checks they consider appropriate before engaging a babysitter, including asking to see relevant DBS documentation, identification, references or qualifications.",
    },
    {
      question: "How do childcare payments work?",
      answer:
        "Providers set their own hourly rates. Customers and providers agree service arrangements and payments directly; JungleZone charges a separate platform access fee.",
    },
    {
      question: "Can I cancel my platform subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. You will retain full access to platform features until the end of your current billing period.",
    },
    {
      question: "Is my personal data safe?",
      answer:
        "Yes. JungleZone Connect Ltd complies with UK GDPR and the Data Protection Act 2018. We process personal data solely to operate the platform and never sell your personal information.",
    },
    {
      question: "What if I have a concern about another user?",
      answer:
        "You can report suspected misuse, inappropriate behaviour or concerns through our reporting facilities or by contacting support@junglezone.uk. JungleZone reviews reports regarding platform conduct, but does not act as an adjudicator of private childcare disputes.",
    },
  ],

  babysitterFaqs: [
    {
      question: "How do I join JungleZone as a babysitter?",
      answer:
        "Create an account and complete your profile with accurate information about yourself, your experience, availability and preferred hourly rate. You are responsible for ensuring that all information you provide is accurate and up to date.",
    },
    {
      question: "Does JungleZone check my DBS or background?",
      answer:
        "No. JungleZone does not carry out, obtain or verify DBS checks or background screenings. A DBS check is not mandatory to create an introductory profile. Parents and guardians may ask to see your current DBS certificate or identification directly when discussing childcare arrangements.",
    },
    {
      question: "Can I set my own hourly rate?",
      answer:
        "Yes. You set your own hourly rate. Agree service details and payment directly with the customer; JungleZone's provider access fee is separate.",
    },
    {
      question: "How will parents contact me?",
      answer:
        "Registered parents can connect and message you through our platform. You will receive notifications and can respond directly through your dashboard.",
    },
    {
      question: "How much does it cost to use JungleZone?",
      answer:
        "Creating a basic profile is free. Optional paid plans (e.g. Pro Member) provide enhanced visibility and features. Any fee paid to JungleZone is solely for platform access and is separate from childcare fees agreed between users.",
    },
    {
      question: "Can I cancel my paid membership at any time?",
      answer:
        "Yes, you can cancel at any time from your account settings. Your paid features will remain active until the end of your current billing period.",
    },
  ],
};

export const verificationDocuments = [
  {
    id: 1,
    label:
      "Proof of Right to Work in the UK (can show to parents upon request)",
  },
  {
    id: 2,
    label: "Enhanced DBS Certificate (can show to parents upon request)",
  },
  {
    id: 3,
    label: "Proof of Address / UK Residency (can show to parents upon request)",
  },
  { id: 4, label: "National Insurance Number" },
  {
    id: 5,
    label:
      "Valid Passport or Government Photo ID (can show to parents upon request)",
  },
  { id: 6, label: "Valid UK Work Visa / BRP (if applicable)" },
  {
    id: 7,
    label:
      "Childcare Certifications (e.g. Paediatric First Aid, CPR - can show upon request)",
  },
];
