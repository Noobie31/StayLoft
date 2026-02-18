import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    rent: { type: Number, required: true },
    city: { type: String, required: true },
    landMark: { type: String, default: "" },   // ✅ optional - no required
    category: { type: String, required: true },
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    bookedDates: [{
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }
    }]
}, { timestamps: true })

const Listing = mongoose.model("Listing", listingSchema)
export default Listing