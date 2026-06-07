export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (typeof imagePath !== "string") return null;

  const trimmed = imagePath.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/profilePicture/")) {
    return `/api${trimmed}`;
  }

  if (trimmed.startsWith("/img/") || trimmed.startsWith("/default-avatar.png")) {
    return trimmed;
  }

  return `/api/${trimmed.replace(/^\/+/, "")}`;
}
