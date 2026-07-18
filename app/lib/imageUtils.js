/**
 * Downscales and re-compresses an image File in the browser so the upload
 * payload stays small. Hosts (e.g. Netlify) reject bodies over their limit
 * with a 413, which is why the raw camera photo must be shrunk before POST.
 */
export async function compressImageFile(file, {
  maxSize = 1024,
  maxBytes = 800 * 1024,
  jpegQuality = 0.8,
} = {}) {
  if (typeof window === "undefined" || !window.createObjectURL) return file;

  // Already small enough? Skip the expensive canvas work.
  if (file.size && file.size <= maxBytes && /jpe?g|png|webp/i.test(file.type)) {
    return file;
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });

    let { width, height } = img;
    if (width > height && width > maxSize) {
      height = Math.round((height * maxSize) / width);
      width = maxSize;
    } else if (height >= width && height > maxSize) {
      width = Math.round((width * maxSize) / height);
      height = maxSize;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // Default to JPEG for photos, but keep transparency/animation-free
    // sources as PNG when the original wasn't a JPEG-type image.
    const isJpegLike = /jpe?g/i.test(file.type);
    const outMime = isJpegLike ? "image/jpeg" : "image/png";

    // Iteratively lower quality until the blob fits the byte budget.
    let quality = jpegQuality;
    let blob = null;
    for (let i = 0; i < 6; i++) {
      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, outMime, outMime === "image/png" ? undefined : quality),
      );
      if (!blob || blob.size <= maxBytes || quality <= 0.3) break;
      quality = Math.max(0.3, quality - 0.1);
    }
    if (!blob) return file;

    const ext = outMime === "image/png" ? "png" : "jpg";
    const filename = (file.name || "profile").replace(/\.[^.]+$/, "") + "." + ext;
    return new File([blob], filename, { type: outMime });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

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
