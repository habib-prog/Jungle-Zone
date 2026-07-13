import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

const getMongoOptions = () => ({
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  maxPoolSize: 10,
});

export const connectDB = async (attempt = 0) => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB_URI missing in env");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, getMongoOptions())
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        global.mongoose = cached;
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        if (attempt < 2) {
          return new Promise((resolve, reject) => {
            setTimeout(
              () => {
                connectDB(attempt + 1)
                  .then(resolve)
                  .catch(reject);
              },
              1000 * (attempt + 1),
            );
          });
        }
        throw error;
      });
  }

  try {
    return await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
};
