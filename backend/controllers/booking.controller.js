import Booking from "../model/booking.model.js"
import Listing from "../model/listing.model.js"
import User from "../model/user.model.js"

export const createBooking = async (req, res) => {
    try {
        let { id } = req.params
        let { checkIn, checkOut, totalRent } = req.body

        let listing = await Listing.findById(id)
        if (!listing) {
            return res.status(404).json({ message: "Listing is not found" })
        }

        let inDate = new Date(checkIn)
        let outDate = new Date(checkOut)

        if (inDate >= outDate) {
            return res.status(400).json({ message: "Invalid checkIn/checkOut date" })
        }

        // Check for date conflicts with existing bookings
        const hasConflict = listing.bookedDates.some(booking => {
            return inDate < new Date(booking.checkOut) &&
                outDate > new Date(booking.checkIn)
        })

        if (hasConflict) {
            return res.status(400).json({
                message: "These dates are already booked. Please choose different dates."
            })
        }

        let booking = await Booking.create({
            checkIn,
            checkOut,
            totalRent,
            host: listing.host,
            guest: req.userId,
            listing: listing._id
        })

        await booking.populate("host", "email")

        // Add booked dates to listing
        listing.bookedDates.push({
            checkIn: inDate,
            checkOut: outDate,
            guest: req.userId,
            bookingId: booking._id
        })
        await listing.save()

        // Push booking _id (not listing) to user's booking array
        await User.findByIdAndUpdate(req.userId, {
            $push: { booking: booking._id }
        }, { new: true })

        return res.status(201).json(booking)

    } catch (error) {
        return res.status(500).json({ message: `booking error ${error}` })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        let { id } = req.params

        let booking = await Booking.findById(id)

        if (!booking) {
            // Booking already gone — just clean up stale references
            await Listing.updateMany(
                { "bookedDates.bookingId": id },
                { $pull: { bookedDates: { bookingId: id } } }
            )
            await User.updateMany(
                { booking: id },
                { $pull: { booking: id } }
            )
            return res.status(200).json({ message: "Booking cancelled successfully" })
        }

        await Listing.findByIdAndUpdate(booking.listing, {
            $pull: { bookedDates: { bookingId: booking._id } }
        })

        await User.findByIdAndUpdate(booking.guest, {
            $pull: { booking: booking._id }
        })

        await Booking.findByIdAndDelete(id)

        return res.status(200).json({ message: "Booking cancelled successfully" })

    } catch (error) {
        return res.status(500).json({ message: `booking cancel error ${error}` })
    }
}
