import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext';
import { bookingDataContext } from '../Context/BookingContext';

function BookingHistoryCard({ booking }) {
  const { cancelBooking } = useContext(bookingDataContext)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const listing = booking.listing || {}
  const checkIn = booking.checkIn ? new Date(booking.checkIn) : null
  const checkOut = booking.checkOut ? new Date(booking.checkOut) : null
  const nights = checkIn && checkOut
    ? Math.round((checkOut - checkIn) / (24 * 60 * 60 * 1000))
    : 0

  const fmt = (d) => d?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const isUpcoming = checkIn && checkIn > new Date()
  const isPast = checkOut && checkOut < new Date()
  const isActive = !isUpcoming && !isPast

  const statusColor = isUpcoming
    ? { bg: '#f0fdf4', text: '#16a34a', label: 'Upcoming' }
    : isPast
      ? { bg: '#f5f0eb', text: '#9c7a5a', label: 'Completed' }
      : { bg: '#fff5f5', text: '#e11d48', label: 'Active' }

  const locationDisplay = listing.landMark?.trim()
    ? `${listing.landMark}, ${listing.city}`
    : listing.city

  return (
    <div className='rounded-2xl overflow-hidden' style={{ background: '#fff', border: '1px solid #f0ece6', fontFamily: "'Georgia',serif" }}>
      <div className='flex gap-4 p-4'>
        {/* Thumbnail */}
        <div className='w-20 h-20 rounded-xl overflow-hidden flex-shrink-0'
          style={{ background: '#f0ece6' }}>
          {listing.image1 && <img src={listing.image1} className='w-full h-full object-cover' alt="" />}
        </div>

        {/* Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <p className='font-semibold text-sm truncate' style={{ color: '#1a0a00' }}>
                {locationDisplay || 'Property'}
              </p>
              <p className='text-xs truncate' style={{ color: '#9c7a5a' }}>{listing.title}</p>
            </div>
            <span className='text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-semibold'
              style={{ background: statusColor.bg, color: statusColor.text }}>
              {statusColor.label}
            </span>
          </div>

          {/* Dates */}
          <div className='mt-2 flex items-center gap-2 flex-wrap'>
            <div className='text-xs px-3 py-1.5 rounded-lg' style={{ background: '#faf8f5', color: '#1a0a00' }}>
              📅 {fmt(checkIn)}
            </div>
            <span style={{ color: '#d4c4b8', fontSize: '12px' }}>→</span>
            <div className='text-xs px-3 py-1.5 rounded-lg' style={{ background: '#faf8f5', color: '#1a0a00' }}>
              {fmt(checkOut)}
            </div>
            <span className='text-xs' style={{ color: '#9c7a5a' }}>
              {nights} night{nights !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Total */}
          {booking.totalRent && (
            <p className='mt-1.5 text-xs font-semibold' style={{ color: '#3d1a00' }}>
              Total paid: ₹{Number(booking.totalRent).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Cancel button - only for upcoming bookings */}
      {isUpcoming && (
        <div className='px-4 pb-4'>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className='w-full py-2 rounded-xl text-xs font-semibold transition-colors'
              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
              Cancel Booking
            </button>
          ) : (
            <div className='flex gap-2'>
              <button onClick={() => setShowConfirm(false)}
                className='flex-1 py-2 rounded-xl text-xs font-semibold'
                style={{ background: '#f5f0eb', color: '#3d1a00' }}>
                Keep it
              </button>
              <button onClick={() => { cancelBooking(booking._id); setShowConfirm(false) }}
                className='flex-1 py-2 rounded-xl text-xs font-semibold text-white'
                style={{ background: '#dc2626' }}>
                Yes, Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MyBooking() {
  let navigate = useNavigate()
  let { userData } = useContext(userDataContext)
  const bookings = Array.isArray(userData?.booking) ? userData.booking : []

  // Sort: upcoming first, then active, then past
  const sorted = [...bookings].sort((a, b) => {
    const aIn = new Date(a.checkIn), bIn = new Date(b.checkIn)
    return aIn - bIn
  })

  const upcoming = Array.isArray(sorted) ? sorted.filter(b => b.checkIn && new Date(b.checkIn) > new Date()) : []
  const past = Array.isArray(sorted) ? sorted.filter(b => b.checkOut && new Date(b.checkOut) < new Date()) : []

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className='sticky top-0 z-10 px-4 md:px-8 py-4 border-b flex items-center gap-4'
        style={{ background: '#fff', borderColor: '#f0ece6' }}>
        <button onClick={() => navigate("/")}
          className='w-9 h-9 rounded-full flex items-center justify-center'
          style={{ background: '#f5f0eb', color: '#3d1a00' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className='text-lg font-bold' style={{ color: '#1a0a00' }}>My Bookings</h1>
          <p className='text-xs' style={{ color: '#9c7a5a' }}>
            {upcoming.length} upcoming · {past.length} completed
          </p>
        </div>
      </div>

      <div className='px-4 md:px-8 py-8 max-w-2xl mx-auto'>
        {bookings.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='text-5xl mb-4'>🏡</div>
            <h3 className='text-xl font-semibold mb-2' style={{ color: '#3d1a00' }}>No bookings yet</h3>
            <p className='text-sm mb-6' style={{ color: '#9c7a5a' }}>Start exploring amazing places to stay</p>
            <button onClick={() => navigate("/")}
              className='px-6 py-3 rounded-xl text-sm font-semibold text-white'
              style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}>
              Explore Listings
            </button>
          </div>
        ) : (
          <div className='space-y-8'>
            {upcoming.length > 0 && (
              <section>
                <h2 className='text-sm font-semibold mb-3 uppercase tracking-wider' style={{ color: '#9c7a5a', fontSize: '11px' }}>
                  Upcoming
                </h2>
                <div className='space-y-3'>
                  {Array.isArray(upcoming) && upcoming.map(b => <BookingHistoryCard key={b._id} booking={b} />)}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className='text-sm font-semibold mb-3 uppercase tracking-wider' style={{ color: '#9c7a5a', fontSize: '11px' }}>
                  Past Stays
                </h2>
                <div className='space-y-3'>
                  {Array.isArray(past) && past.map(b => <BookingHistoryCard key={b._id} booking={b} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBooking