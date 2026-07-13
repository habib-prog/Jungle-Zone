import test from "node:test";
import assert from "node:assert/strict";
import { resolveAuthAccount } from "./authAccountResolver.js";

test("prefers an admin account over a parent account with the same email", () => {
  const result = resolveAuthAccount({
    parent: { role: "parent", fullName: "Parent User" },
    sitter: null,
    admin: { role: "admin", fullName: "Admin User" },
  });

  assert.equal(result.role, "admin");
  assert.equal(result.account.fullName, "Admin User");
});

test("uses a sitter account when no admin account exists", () => {
  const result = resolveAuthAccount({
    parent: { role: "parent", fullName: "Parent User" },
    sitter: { role: "sitter", fullName: "Sitter User" },
    admin: null,
  });

  assert.equal(result.role, "babysitter");
  assert.equal(result.account.fullName, "Sitter User");
});
