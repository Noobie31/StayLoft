import express from "express"
import isAuth from "../middleware/isAuth.js"
import { cancelBooking, createBooking } from "../controllers/booking.controller.js"

let bookingRouter = express.Router()

bookingRouter.post("/create/:id", isAuth, createBooking)       // :id = listingId
bookingRouter.delete("/cancel/:id", isAuth, cancelBooking)     // :id = bookingId

export default bookingRouter