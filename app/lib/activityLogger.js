import ActivityLog from "@/models/activityLogSchema";
import { connectDB } from "@/config/db";

const ACTIVITY_RETENTION_DAYS = 30;

function getHeader(headersLike, name) {
  if (!headersLike) return "";
  if (typeof headersLike.get === "function") {
    return headersLike.get(name) || "";
  }
  if (headersLike.headers && typeof headersLike.headers === "object") {
    const lower = name.toLowerCase();
    const key = Object.keys(headersLike.headers).find(
      (k) => k.toLowerCase() === lower,
    );
    return key ? headersLike.headers[key] || "" : "";
  }
  if (typeof headersLike === "object") {
    const lower = name.toLowerCase();
    const key = Object.keys(headersLike).find(
      (k) => k.toLowerCase() === lower,
    );
    return key ? headersLike[key] || "" : "";
  }
  return "";
}

function parseDevice(ua = "") {
  if (!ua) return "Unknown";

  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Windows NT 10/.test(ua)) os = "Windows";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  if (browser === "Unknown" && os === "Unknown") return "Unknown";
  return `${browser} on ${os}`;
}

function deriveRegion(headersLike, fallbackTimezone = "") {
  const country =
    getHeader(headersLike, "x-vercel-ip-country") ||
    getHeader(headersLike, "cf-ipcountry") ||
    getHeader(headersLike, "x-country") ||
    "";
  const city =
    getHeader(headersLike, "x-vercel-ip-city") ||
    getHeader(headersLike, "cf-ipcity") ||
    getHeader(headersLike, "x-city") ||
    "";

  if (city && country) return `${city}, ${country}`;
  if (country) return country;
  if (fallbackTimezone) return fallbackTimezone;
  return "Unknown";
}

function getIp(headersLike) {
  const forwarded = getHeader(headersLike, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    getHeader(headersLike, "x-real-ip") ||
    getHeader(headersLike, "x-client-ip") ||
    ""
  );
}

export async function recordActivity(
  req,
  { action, user = {}, userAgent, timezone } = {},
) {
  try {
    await connectDB();
    const reqHeaders = req?.headers;

    const finalDevice =
      parseDevice(userAgent || getHeader(reqHeaders, "user-agent"));
    const finalRegion =
      timezone ||
      (reqHeaders ? deriveRegion(reqHeaders, timezone) : "Unknown") ||
      "Unknown";

    await ActivityLog.create({
      userId: user.id || null,
      email: user.email || "",
      name: user.name || "",
      role: user.role || "",
      action,
      device: finalDevice,
      region: finalRegion,
      ip: reqHeaders ? getIp(reqHeaders) : "",
    });
  } catch (error) {
    console.error("Failed to record activity:", error);
  }
}

export async function cleanupOldActivity(days = ACTIVITY_RETENTION_DAYS) {
  try {
    await connectDB();
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await ActivityLog.deleteMany({ createdAt: { $lt: cutoff } });
    return result.deletedCount || 0;
  } catch (error) {
    console.error("Failed to cleanup old activity:", error);
    return 0;
  }
}

export { ACTIVITY_RETENTION_DAYS };
