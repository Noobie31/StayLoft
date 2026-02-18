import React, { useContext, useState } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { useNavigate } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { bookingDataContext } from '../Context/BookingContext';

function Card({ title, landMark, image1, rent, city, id, ratings, host, bookedDates = [], bookingId }) {
    let navigate = useNavigate()
    let { userData } = useContext(userDataContext)
    let { handleViewCard } = useContext(listingDataContext)
    let [popUp, setPopUp] = useState(false)
    let [hovered, setHovered] = useState(false)
    let { cancelBooking } = useContext(bookingDataContext)

    const isCurrentlyBooked = bookedDates && bookedDates.length > 0
    const isMyListing = userData && host === userData._id

    // ✅ Fix comma bug: only show landmark if non-empty
    const locationDisplay = landMark && landMark.trim()
        ? `${landMark}, ${city}`
        : city

    const handleClick = () => {
        if (!userData) { navigate("/login"); return }
        handleViewCard(id)
    }

    return (
        <div
            className='relative cursor-pointer'
            style={{ width: '300px', maxWidth: '90vw', fontFamily: "'Georgia', serif" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className='relative overflow-hidden rounded-2xl mb-3'
                style={{ height: '200px', background: '#f0ece6' }}
                onClick={handleClick}>
                <img src={image1} alt={title}
                    className='w-full h-full object-cover transition-transform duration-500'
                    style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />

                {isCurrentlyBooked && (
                    <div className='absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5'
                        style={{ background: 'rgba(0,0,0,0.65)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                        <div className='w-1.5 h-1.5 rounded-full bg-green-400'></div>
                        Booked
                    </div>
                )}
                {ratings > 0 && (
                    <div className='absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1'
                        style={{ background: 'rgba(255,255,255,0.95)', color: '#1a0a00' }}>
                        <FaStar className='text-amber-500' size={10} />
                        {ratings}
                    </div>
                )}
            </div>

            <div onClick={handleClick}>
                <p className='font-semibold text-sm truncate' style={{ color: '#1a0a00' }}>{locationDisplay}</p>
                <p className='text-xs truncate mt-0.5' style={{ color: '#9c7a5a' }}>{title}</p>
                <p className='mt-1 text-sm'>
                    <span className='font-semibold' style={{ color: '#1a0a00' }}>₹{rent?.toLocaleString()}</span>
                    <span style={{ color: '#9c7a5a' }}> / night</span>
                </p>
            </div>

            {isMyListing && isCurrentlyBooked && (
                <div className='mt-2'>
                    <button onClick={(e) => { e.stopPropagation(); setPopUp(true) }}
                        className='w-full py-1.5 rounded-lg text-xs font-semibold'
                        style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                        Cancel Booking
                    </button>
                </div>
            )}

            {popUp && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className='rounded-2xl p-6 shadow-2xl max-w-sm w-full'
                        style={{ background: '#fff', fontFamily: "'Georgia', serif" }}>
                        <h3 className='text-lg font-bold mb-2' style={{ color: '#1a0a00' }}>Cancel Booking?</h3>
                        <p className='text-sm mb-5' style={{ color: '#9c7a5a' }}>This will free up the dates for new bookings.</p>
                        <div className='flex gap-3'>
                            <button onClick={() => setPopUp(false)}
                                className='flex-1 py-2.5 rounded-xl text-sm font-semibold'
                                style={{ background: '#f5f0eb', color: '#3d1a00' }}>Keep it</button>
                            <button onClick={() => { cancelBooking(bookingId || id); setPopUp(false) }}
                                className='flex-1 py-2.5 rounded-xl text-sm font-semibold text-white'
                                style={{ background: '#dc2626' }}>Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Card