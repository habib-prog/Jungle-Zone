import { normalizeRole } from "./roleUtils.js";

const getConfiguredAdminEmails = () => {
  const fromEnv = String(
    process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "",
  )
    .split(/[\s,]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(["xavierjames701@gmail.com", ...fromEnv]));
};

export const isConfiguredAdminEmail = (email) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalizedEmail) return false;
  return getConfiguredAdminEmails().includes(normalizedEmail);
};

export const resolveAuthAccount = ({ parent, sitter, admin, email }) => {
  const configuredAdmin = isConfiguredAdminEmail(email);

  if (configuredAdmin) {
    return {
      account: admin || parent || sitter || null,
      role: "admin",
      source: "configured-admin",
    };
  }

  const candidates = [
    { account: admin, role: "admin" },
    { account: sitter, role: "babysitter" },
    { account: parent, role: "parent" },
  ];

  for (const candidate of candidates) {
    if (candidate.account) {
      return {
        account: candidate.account,
        role: normalizeRole(candidate.account?.role || candidate.role),
        source: candidate.role,
      };
    }
  }

  const fallbackAccount = parent || sitter || admin || null;
  return {
    account: fallbackAccount,
    role: normalizeRole(
      fallbackAccount?.role || (admin ? "admin" : sitter ? "sitter" : "parent"),
    ),
    source: null,
  };
};
