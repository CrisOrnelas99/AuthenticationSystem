import mongoose from "mongoose";

    //schema - structure that tells mongoose what fields a document in the user collection should have
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ""},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: " "},
    resetOtpExpireAtl: {type: Number, default: 0}
})

    //checks if a model already exists, creates a new model if it doesn't exist yet
const userModel = mongoose.models.user || mongoose.model("user", UserSchema);

    //exports the model so other files can import it and use it to access the database
export default userModel;