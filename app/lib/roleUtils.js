export const normalizeRole = (role) => {
  if (role === "sitter" || role === "babySitter") return "babysitter";
  return role;
};
