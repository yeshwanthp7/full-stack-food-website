import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://foodtech:food123@ac-oxkkz9x-shard-00-00.zzjjtvc.mongodb.net:27017,ac-oxkkz9x-shard-00-01.zzjjtvc.mongodb.net:27017,ac-oxkkz9x-shard-00-02.zzjjtvc.mongodb.net:27017/?ssl=true&replicaSet=atlas-1311xw-shard-0&authSource=admin&appName=Cluster0';
    try {
        await mongoose.connect(mongoUri);
        console.log("DB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
    }
}