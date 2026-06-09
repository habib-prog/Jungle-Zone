//  Navbar items
export const navItems = [
    { navText: "Home", navLink: "/", },
    { navText: "Find Babysitter", navLink: "/babysitters", },
    { navText: "About Us", navLink: "/about-us", },
    { navText: "Pricing", navLink: "/pricing", },
    { navText: "Contact", navLink: "/contact", },
];

// About Us data
export const aboutUsData = {
    title: "About Us",
    heading: "Trusted Childcare Connections Across the UK",
    description: "We're dedicated to making quality childcare accessible and safe for every family. Our platform connects parents with verified, qualified childcare providers, ensuring peace of mind for families and opportunities for providers.",
    features: [
        {
            icon: "🛡️",
            title: "Safety First",
            description: "All providers are DBS checked and verified"
        },
        {
            icon: "⭐",
            title: "Trusted Reviews",
            description: "Real feedback from families like yours"
        },
        {
            icon: "💰",
            title: "Transparent Pricing",
            description: "Clear rates with no hidden fees"
        }
    ],
    ctaText: "Learn More About Us",
};

// Work States Data for Customers and Workers
export const workStatesForCustomerData = [
    {
        id: 1,
        title: "Sign Up for Free",
        description: "Create a free account to start searching for childcare providers in your area.",
        imgSrc: "https://i.fbcd.co/products/original/9847a67d09a39d0ef02f4cacc70490cdbe8cae2a1f7c9a2e5bf23e9a126137ec.jpg",
        stepNumber: "01",
        duration: "2 minutes",
        ctaText: "Get Started",
        ctaLink: "/signup",
        benefits: [
            "No credit card required",
            "Instant access",
            "Browse unlimited profiles"
        ],
        badge: "Quick & Easy",
        color: "#4CAF50"
    },
    {
        id: 2,
        title: "Post Your Requirements",
        description: "Detail your childcare needs and preferences to get matched with suitable providers.",
        imgSrc: "https://www.shutterstock.com/image-vector/blogging-3d-isometry-concept-web-600nw-2639028933.jpg",
        stepNumber: "02",
        duration: "5 minutes",
        ctaText: "Post Requirements",
        ctaLink: "/post-requirements",
        benefits: [
            "AI-powered matching",
            "Get responses within 24 hours",
            "Update anytime"
        ],
        badge: "Smart Matching",
        color: "#2196F3"
    },
    {
        id: 3,
        title: "Communicate Securely",
        description: "Message providers safely through our platform without sharing personal details.",
        imgSrc: "https://thumbs.dreamstime.com/b/chat-bubble-message-communication-icon-dialogue-discussion-vector-design-generative-ai-versatile-symbolizing-messages-406998690.jpg",
        stepNumber: "03",
        duration: "Ongoing",
        ctaText: "Start Messaging",
        ctaLink: "/messages",
        benefits: [
            "End-to-end encryption",
            "In-app video calls",
            "Document sharing"
        ],
        badge: "Safe & Private",
        color: "#FF9800"
    },
];

// Work States Data for Workers
export const workStatesForWorkerData = [
    {
        id: 1,
        title: "Create a Free Profile",
        description: "Advertise your experience, qualifications, availability, and fees. Upload documents for validation.",
        imgSrc: "https://i.fbcd.co/products/original/9847a67d09a39d0ef02f4cacc70490cdbe8cae2a1f7c9a2e5bf23e9a126137ec.jpg",
        stepNumber: "01",
        duration: "10 minutes",
        ctaText: "Create Profile",
        ctaLink: "/worker/signup",
        benefits: [
            "Free to list services",
            "Showcase qualifications",
            "Set your own rates"
        ],
        badge: "Professional",
        color: "#4CAF50",
        documentsRequired: [
            "DBS certificate",
            "First aid certificate",
            "Insurance",
            "Qualifications"
        ],
        verificationTime: "24-48 hours"
    },
    {
        id: 2,
        title: "Search for Families",
        description: "Enter a postcode to find local families seeking childcare and read their requirements.",
        imgSrc: "https://png.pngtree.com/png-clipart/20230923/original/pngtree-happy-family-symbol-illustration-care-design-icon-vector-png-image_12664533.png",
        stepNumber: "02",
        duration: "5 minutes",
        ctaText: "Browse Families",
        ctaLink: "/worker/search",
        benefits: [
            "Filter by location",
            "See budget ranges",
            "Match availability"
        ],
        badge: "Find Work",
        color: "#2196F3",
        averageMatches: "15-20 per week"
    },
    {
        id: 3,
        title: "Secure Communication",
        description: "Message parents safely without sharing personal details.",
        imgSrc: "https://thumbs.dreamstime.com/b/chat-bubble-message-communication-icon-dialogue-discussion-vector-design-generative-ai-versatile-symbolizing-messages-406998690.jpg",
        stepNumber: "03",
        duration: "Ongoing",
        ctaText: "View Messages",
        ctaLink: "/worker/messages",
        benefits: [
            "Protected identity",
            "Schedule interviews",
            "Share availability"
        ],
        badge: "Secure",
        color: "#FF9800",
        responseTimeTarget: "< 24 hours"
    },
];

// Footer items
export const FooterItems = [
    {
        title: "Company",
        items: [
            { name: "Home", link: "/" },
            { name: "About Us", link: "/about-us" },
            { name: "Find Babysitter", link: "/babysitters" },
            { name: "Pricing", link: "/pricing" },
            { name: "Contact", link: "/contact" }
        ],
    },
    {
        title: "Legal",
        items: [
            { name: "Cookies Policy", link: "/cookies-policy" },
            { name: "Privacy Policy", link: "/privacy-policy" },
            { name: "Terms of Service", link: "/terms-of-service" },
            { name: "Terms & Conditions", link: "/terms-conditions" },
        ],
    }
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
    { id: 101, user: "John Doe", sitter: "Sarah Ahmed", amount: "$50", status: "Completed" },
    { id: 102, user: "Michael", sitter: "Nusrat Jahan", amount: "$35", status: "Pending" },
    { id: 103, user: "Emily", sitter: "Ayesha Khan", amount: "$70", status: "Completed" },
];

export const fakeUsers = [
    { id: 1, name: "John Carter", email: "john@mail.com", role: "Parent", image: "https://img.freepik.com/free-photo/artist-white_1368-6282.jpg?semt=ais_user_personalization&w=740&q=80" },
    { id: 2, name: "Emily Stone", email: "emily@mail.com", role: "Parent", image: "https://img.freepik.com/free-photo/non-binary-person-with-glasses-smiling_23-2148760540.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: 3, name: "Daniel Lee", email: "daniel@mail.com", role: "Parent", image: "https://img.freepik.com/free-photo/modern-man-bench_23-2147961432.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: 4, name: "Ava Khan", email: "ava@mail.com", role: "Parent", image: "https://img.freepik.com/free-photo/clueless-confused-charming-woman-with-curly-hair-eyewear-raising-hand-questioned-gesture-sitting-table_176420-24660.jpg?semt=ais_hybrid&w=740&q=80" },
]

export const faqData = {
    parentFaqs: [
        {
            question: "How do I find a babysitter on JungleZone?",
            answer:
                "Simply create a free account, enter your postcode, and browse verified babysitters in your area. You can filter by availability, experience, and hourly rate to find the right match for your family."
        },
        {
            question: "Are the babysitters DBS checked?",
            answer:
                "Yes. All babysitters on our platform are required to complete identity verification. Premium-listed sitters have also undergone official DBS background screening, clearly indicated with a verified badge on their profile."
        },
        {
            question: "How do I pay my babysitter?",
            answer:
                "Payments are made directly between parents and babysitters. JungleZone does not process or handle payments — we simply connect you with the right person. You and the sitter agree on a rate and payment method between yourselves."
        },
        {
            question: "Can I cancel my subscription at any time?",
            answer:
                "Yes, you can cancel your subscription at any time from your account settings. You will retain full access to all Premium features until the end of your current billing period."
        },
        {
            question: "Is my personal data safe?",
            answer:
                "Absolutely. JungleZone is fully GDPR-compliant and your data is stored securely. We never share your personal information with third parties without your explicit consent."
        },
        {
            question: "What if I have a problem with a babysitter?",
            answer:
                "You can report any concerns directly through your account dashboard. Our support team will review all reports promptly. You can also leave an honest review to help other families in the community."
        }
    ],

    babysitterFaqs: [
        {
            question: "How do I join JungleZone as a babysitter?",
            answer:
                "Register for a free account, complete your profile with your experience and availability, and submit your verification documents. Once approved, your profile will be visible to families in your area."
        },
        {
            question: "Do I need a DBS check to join?",
            answer:
                "A DBS check is not mandatory to create a profile. However, sitters with a valid DBS certificate receive a verified badge, which significantly increases trust with parents and leads to higher booking rates."
        },
        {
            question: "Can I set my own hourly rate?",
            answer:
                "Yes. You are in full control of your hourly rate and availability. JungleZone does not take any commission from your earnings — payments are agreed and made directly between you and the family."
        },
        {
            question: "How will parents contact me?",
            answer:
                "Parents with a Premium subscription can message you directly through our secure platform. You will receive a notification and can respond at your convenience through your dashboard."
        },
        {
            question: "How much does it cost to list my profile?",
            answer:
                "Creating a basic profile is completely free. Our Pro plan at £4.99/month gives you priority listing visibility, a verified badge, and access to unlimited job requests from families across your area."
        },
        {
            question: "Can I cancel my Pro plan at any time?",
            answer:
                "Yes, you can cancel at any time from your account settings with no penalty. Your Pro features will remain active until the end of your current monthly billing period."
        }
    ]
};

export const verificationDocuments = [
    { id: 1, label: "Proof of Right to Work in the UK (if applicable)" },
    { id: 2, label: "Enhanced DBS Check / Criminal Background Check" },
    { id: 3, label: "Proof of Address or Legal Residency (if applicable)" },
    { id: 4, label: "National Insurance Number (if applicable)" },
    { id: 5, label: "Valid Passport or Government-issued Photo ID" },
    { id: 6, label: "Valid UK Work Visa / BRP (if applicable)" },
    { id: 7, label: "Childcare Certifications such as Pediatric First Aid or CPR (optional but highly recommended)" },
];