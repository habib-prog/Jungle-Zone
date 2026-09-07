import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Blog from "@/models/blogSchema";

export const runtime = "nodejs";

// Initial seed data to populate if database has no blogs
const INITIAL_BLOGS = [
  {
    title: "10 Essential Tips for Finding the Right Babysitter for Your Child",
    slug: "10-essential-tips-finding-right-babysitter",
    excerpt: "Finding a trusted babysitter can feel overwhelming. Here are 10 key guidelines to ensure your peace of mind and your child's happiness.",
    content: `Finding a reliable and trustworthy babysitter is one of the most important decisions a parent can make. Whether you need coverage for a date night, regular after-school care, or emergency situations, having the right person in your corner makes all the difference.

### 1. Define Your Specific Needs
Before starting your search, list your requirements. Do you need someone with first aid certification? Help with homework? Light housekeeping? Clear expectations will help filter candidates faster.

### 2. Conduct Background & Reference Checks
Always request references and check previous employment history. Speaking with other parents who have hired the babysitter provides invaluable insights into their punctuality, patience, and handling of tricky situations.

### 3. Arrange an In-Person Interview & Trial Run
Invite the candidate for an initial meeting while you are home. Observe how they interact with your children. A short trial run allows your child to build rapport and gives you confidence in your choice.

### 4. Create a Clear Emergency & Contact Plan
Ensure your babysitter knows emergency contact details, medical information, house rules, bedtime routines, and allergy warnings. Communication is key to a smooth experience for everyone!`,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    category: "Parenting",
    tags: ["Babysitting", "Parenting Advice", "Safety"],
    author: "Sarah Jenkins",
    readTime: "5 min read",
    isPublished: true,
  },
  {
    title: "How to Prepare Your Child for Their First Time with a New Babysitter",
    slug: "prepare-child-first-time-new-babysitter",
    excerpt: "Separation anxiety is normal for both parents and kids. Discover proven strategies to make the transition smooth and stress-free.",
    content: `Leaving your child with a new babysitter for the first time can trigger anxiety for both parents and kids. With thoughtful preparation, you can turn anxiety into excitement!

### Talk About the Babysitter in Advance
Introduce the concept early. Share positive stories about how much fun they will have together playing games or reading books.

### Keep Goodbyes Warm but Short
Prolonged goodbyes tend to heighten anxiety. Give your child a warm hug, reassure them that you will return, and leave confidently.

### Leave a Comfort Item
A favorite blanket, stuffed animal, or familiar activity book gives your child a sense of security while you are away.`,
    image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80",
    category: "Childcare Advice",
    tags: ["Child Development", "Separation Anxiety", "Tips"],
    author: "Dr. Mark Thorne",
    readTime: "4 min read",
    isPublished: true,
  },
  {
    title: "Top Creative Indoor Activities for Rainy Days with Toddlers",
    slug: "top-creative-indoor-activities-rainy-days",
    excerpt: "Keep kids engaged and entertained indoors with these fun, low-prep crafts, games, and learning activities.",
    content: `Rainy days don't have to mean endless screen time! Here are quick, creative indoor activities that boost imagination and keep young kids happily occupied.

### Build an Indoor Obstacle Course
Use sofa cushions, painter's tape, and soft toys to build a mini adventure trail. It encourages physical movement and problem-solving skills!

### DIY Sensory Bins
Fill a plastic tub with rice, dry pasta, or water and add scoopers, small plastic animals, and measuring cups. Sensory play keeps toddlers focused for hours.

### Storybook Drama Night
Read a favorite picture book aloud and act out the characters together using simple props or costumes.`,
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
    category: "Activities & Fun",
    tags: ["Indoor Play", "Toddler Crafts", "Creative"],
    author: "Emma Watson",
    readTime: "6 min read",
    isPublished: true,
  },
  {
    title: "Safety Checklist Every Professional Babysitter Should Follow",
    slug: "safety-checklist-every-professional-babysitter-should-follow",
    excerpt: "Safety is the highest priority in childcare. Here is an essential safety guide for babysitters and parents alike.",
    content: `Safety comes first in any childcare environment. Whether you are a seasoned sitter or starting out, following a structured safety checklist guarantees a secure setting.

### Know the Emergency Numbers & Medical Info
Always have quick access to local emergency numbers, poison control, parental contact details, and any specific medical needs or allergies.

### Home & Kitchen Safety Rules
Keep medication, cleaning supplies, and sharp objects completely out of reach. Double-check window latches and outdoor gates.

### First Aid Knowledge
Possessing Paediatric First Aid and CPR knowledge gives parents confidence and equips you to handle unexpected minor injuries promptly.`,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    category: "Safety & First Aid",
    tags: ["Safety", "Checklist", "Babysitting"],
    author: "JungleZone Safety Team",
    readTime: "5 min read",
    isPublished: true,
  },
  {
    title: "Understanding Fair Pay & Hourly Rates for UK Babysitters in 2026",
    slug: "understanding-fair-pay-hourly-rates-uk-babysitters",
    excerpt: "A comprehensive guide on current hourly rates, factors influencing pay, and setting fair terms for childcare services.",
    content: `Determining fair compensation for babysitters depends on several factors, including location, experience, number of children, and special certifications.

### Key Factors Influencing Rates
- **Location**: Major cities like London often command higher rates due to living costs.
- **Experience & Certifications**: First aid qualifications, childcare degrees, or years of experience merit higher rates.
- **Overnight & Holiday Care**: Rates may vary during late-night hours or bank holidays.

Fair compensation fosters long-term, positive relationships between parents and sitters!`,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    category: "Platform & News",
    tags: ["Childcare Rates", "Babysitter Pay", "UK Guide"],
    author: "David Miller",
    readTime: "7 min read",
    isPublished: true,
  },
  {
    title: "Healthy Snack Ideas Kids and Babysitters Will Both Love",
    slug: "healthy-snack-ideas-kids-and-babysitters-love",
    excerpt: "Delicious, nutritious, and easy-to-prepare snacks that fuel kids without sugar crashes.",
    content: `Preparing snacks for children can be simple, nutritious, and fun. Here are easy recipes that kids love helping with!

### Fruit Skewers with Yogurt Dip
Thread grapes, strawberries, and banana slices onto wooden sticks and serve with honey-sweetened Greek yogurt.

### Mini Homemade English Muffin Pizzas
Top whole-wheat English muffins with tomato sauce, mozzarella cheese, and sweet bell peppers, then toast for 5 minutes.

### Apple Slices with Peanut / Seed Butter
Classic, high-protein snack that keeps energy levels steady through active play sessions.`,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    category: "Nutrition & Health",
    tags: ["Recipes", "Healthy Kids", "Snacks"],
    author: "Rachel Green",
    readTime: "4 min read",
    isPublished: true,
  },
  {
    title: "Establishing Healthy Bedtime Routines for Toddlers",
    slug: "establishing-healthy-bedtime-routines-for-toddlers",
    excerpt: "End night-time struggles with a relaxing, predictable bedtime routine that helps toddlers drift off peacefully.",
    content: `Consistency is the secret ingredient to smooth bedtimes. Establishing a relaxing routine signals to your toddler's body that it's time to sleep.

### 1. Consistent Schedule
Maintain the same sleep schedule even on weekends. Predictability lowers evening anxiety.

### 2. Wind Down Environment
Dim lights, turn off screens at least an hour before bed, and switch to calm stories or gentle lullabies.`,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    category: "Parenting",
    tags: ["Sleep", "Toddler Health", "Routine"],
    author: "Sarah Jenkins",
    readTime: "5 min read",
    isPublished: true,
  },
  {
    title: "Building Trust: Communication Best Practices for Parents and Sitters",
    slug: "building-trust-communication-best-practices",
    excerpt: "Clear and open communication creates a successful partnership between parents and childcare providers.",
    content: `Great childcare relies on transparent communication. Share daily logs, child preferences, and feedback regularly to keep everyone on the same page.`,
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
    category: "Childcare Advice",
    tags: ["Communication", "Trust", "Partnership"],
    author: "JungleZone Team",
    readTime: "4 min read",
    isPublished: true,
  }
];

// Helper to generate a unique slug
function generateSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${baseSlug}-${Date.now().toString().slice(-4)}`;
}

// GET /api/blogs
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const includeDrafts = searchParams.get("admin") === "true";

    // Auto-seed if database is completely empty
    const count = await Blog.countDocuments();
    if (count === 0) {
      console.log("[Blog API] Seeding initial blog posts...");
      await Blog.insertMany(INITIAL_BLOGS);
    }

    const filter = {};
    if (!includeDrafts) {
      filter.isPublished = true;
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("[Blog API GET Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/blogs
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, content, excerpt, image, category, tags, author, readTime, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and Content are required" },
        { status: 400 }
      );
    }

    const slug = body.slug ? body.slug.toLowerCase().replace(/\s+/g, "-") : generateSlug(title);

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      excerpt: excerpt || title,
      image: image || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
      category: category || "Parenting",
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((t) => t.trim()) : [],
      author: author || "JungleZone Team",
      readTime: readTime || "4 min read",
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog post created successfully",
        blog: newBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Blog API POST Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}
