import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb://foodtech:food123@ac-oxkkz9x-shard-00-00.zzjjtvc.mongodb.net:27017,ac-oxkkz9x-shard-00-01.zzjjtvc.mongodb.net:27017,ac-oxkkz9x-shard-00-02.zzjjtvc.mongodb.net:27017/?ssl=true&replicaSet=atlas-1311xw-shard-0&authSource=admin&appName=Cluster0"').then(()=>console.log("DB Connected"));
   
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.