import mongoose from "mongoose";

let cached = (global).mongoose || { conn: null, promise: null };

export const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("MONGODB_URI missing in env");

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }
    
    cached.conn = await cached.promise;
    (global).mongoose = cached;
    return cached.conn;
};
