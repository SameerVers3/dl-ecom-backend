import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false
    },

    createAt: {
        type: Date,
        default: Date.now()
    }
})

const OtpModel = mongoose.model("otp", OtpSchema)
export default OtpModel