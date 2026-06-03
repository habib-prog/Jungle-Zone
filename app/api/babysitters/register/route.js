import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phoneNumber,
      password,
      profilePhoto,
      age,
      gender,
      location,
      zipCode,
      description,
      certifications,
      educationLevel,
      preferredBabysittingLocation,
      languages = [],
      yearsOfExperience,
      hourlyRate,
      comfortableWithAgeGroup,
      skills = [],
      availability = [],
      verificationDocs
    } = body;

    // basic validation
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !profilePhoto ||
      !age ||
      !gender ||
      !location ||
      !zipCode
    ) {
      return new Response(
        JSON.stringify({ error: "All required fields must be provided" }),
        { status: 400 },
      );
    }

    // email regex test
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
      });
    }

    //  password min 6 test
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await BabySitterRegistration.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBabysitter = new BabySitterRegistration({
      fullName,
      email,
      phoneNumber: Number(phoneNumber),
      password: hashedPassword,
      profilePhoto,
      age: Number(age),
      gender,
      location,
      zipCode: Number(zipCode),
      description,
      certifications,
      educationLevel,
      preferredBabysittingLocation,
      languages,
      yearsOfExperience: Number(yearsOfExperience),
      hourlyRate: Number(hourlyRate),
      comfortableWithAgeGroup,
      skills,
      availability,
      verificationDocs
    });

    const savedData = await newBabysitter.save();

    return new Response(
      JSON.stringify({
        message: "Registration successful",
        data: savedData,
      }),
      { status: 201 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      { status: 500 },
    );
  }
}
