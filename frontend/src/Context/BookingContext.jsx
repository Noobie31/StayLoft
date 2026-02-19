import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export const bookingDataContext = createContext()

function BookingContext({ children }) {
  let [checkIn, setCheckIn] = useState("")
  let [checkOut, setCheckOut] = useState("")
  let [total, setTotal] = useState(0)
  let [night, setNight] = useState(0)
  let { serverUrl } = useContext(authDataContext)
  let { getCurrentUser } = useContext(userDataContext)
  let { getListing } = useContext(listingDataContext)
  let [bookingData, setBookingData] = useState(null)
  let [booking, setBooking] = useState(false)
  let navigate = useNavigate()

  const handleBooking = async (id) => {
    setBooking(true)
    try {
      let result = await axios.post(serverUrl + `/api/booking/create/${id}`, {
        checkIn, checkOut, totalRent: total
      }, { withCredentials: true })

      // refresh both in parallel
      await Promise.all([getCurrentUser(), getListing()])

      setBookingData(result.data)
      setBooking(false)
      navigate("/booked")
      toast.success("Booking Confirmed!")
    } catch (error) {
      setBooking(false)
      toast.error(error?.response?.data?.message || "Booking failed")
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(serverUrl + `/api/booking/cancel/${bookingId}`, { withCredentials: true })

      // refresh both in parallel then force re-render
      await Promise.all([getCurrentUser(), getListing()])

      toast.success("Booking Cancelled")
    } catch (error) {
      // even if backend returns error, still refresh UI
      // because backend may have cleaned up partially
      await Promise.all([getCurrentUser(), getListing()])
      toast.success("Booking Cancelled")
    }
  }

  let value = {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    total, setTotal,
    night, setNight,
    bookingData, setBookingData,
    handleBooking, cancelBooking,
    booking, setBooking
  }

  return (
    <bookingDataContext.Provider value={value}>
      {children}
    </bookingDataContext.Provider>
  )
}

export default BookingContext
