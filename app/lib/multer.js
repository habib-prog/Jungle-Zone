import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, png, webp allowed"), false);
  }
};

// Memory storage: keeps the file in a Buffer so we never write to the
// (read-only) serverless filesystem. Files are uploaded to Cloudinary
// (or a writable local path in dev) by the route handlers.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});
