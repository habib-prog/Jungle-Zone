import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Reads CLOUDINARY_URL from the environment automatically.
cloudinary.config();

export const isCloudinaryConfigured = () => Boolean(process.env.CLOUDINARY_URL);

/**
 * Saves an uploaded profile photo and returns a URL/path safe to store.
 * - If CLOUDINARY_URL is set: uploads to Cloudinary and returns a secure URL
 *   (persists across serverless invocations — required on Netlify).
 * - Otherwise: falls back to writing the file to the local disk (works in dev
 *   where the filesystem is writable; on a read-only FS it degrades to a
 *   default avatar so the record is still created).
 */
export async function saveProfilePhoto(file, folder) {
  if (!file || !file.buffer) return "/default-avatar.png";

  if (isCloudinaryConfigured()) {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `junglezone/${folder}`, resource_type: "image" },
          (error, res) => (error ? reject(error) : resolve(res))
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });
      return result.secure_url;
    } catch (err) {
      console.error("[imageUpload] Cloudinary upload failed:", err.message);
    }
  }

  // Local-disk fallback (dev / writable filesystem).
  try {
    const ext = path.extname(file.originalname || ".jpg");
    const filename = `${uuidv4()}${ext}`;
    const dir = path.join(process.cwd(), "profilePicture", folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), file.buffer);
    return `/api/profilePicture/${folder}/${filename}`;
  } catch (err) {
    console.error("[imageUpload] Local image save failed:", err.message);
    return "/default-avatar.png";
  }
}
