import { normalizeRole } from "./roleUtils.js";

export const resolveAuthAccount = ({ parent, sitter, admin }) => {
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
