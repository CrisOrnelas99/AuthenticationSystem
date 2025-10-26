import mongoose from "mongoose";

const connectDB = async ()=> {

        mongoose.connection.on("connected", ()=> {
            console.log("Database Connected");
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/Authentication_System`);

};

export default connectDB;