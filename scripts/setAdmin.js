#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Admin from "../models/adminSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(envPath) {
  const data = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of data.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=").trim();
  }
  return env;
}

const envFile = path.join(__dirname, "..", ".env.local");
const loadedEnv = loadEnv(envFile);
if (!loadedEnv.MONGODB_URI) {
  throw new Error("MONGODB_URI missing in .env.local");
}
process.env.MONGODB_URI = loadedEnv.MONGODB_URI;

const email = "xavierjames701@gmail.com";
const fullName = "Xavier James";

async function upsertAdmin() {
  try {
    await connectDB();
    const update = { fullName, email, role: "admin", provider: "google" };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const admin = await Admin.findOneAndUpdate({ email }, update, options);
    console.log("Upserted admin:", admin);
    process.exit(0);
  } catch (err) {
    console.error("Failed to upsert admin:", err);
    process.exit(1);
  }
}

upsertAdmin();
