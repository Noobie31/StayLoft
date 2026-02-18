import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';
import { userDataContext } from '../Context/UserContext';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { FaStar } from "react-icons/fa";
import { bookingDataContext } from '../Context/BookingContext';
import { toast } from 'react-toastify';

// ─── Mini availability calendar ───────────────────────────────────────────────
function AvailabilityCalendar({ bookedDates, checkIn, checkOut }) {
    const [viewMonth, setViewMonth] = useState(() => {
        const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }
    })

    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
    const firstDay = (y, m) => new Date(y, m, 1).getDay()

    const isBooked = (date) => bookedDates?.some(b => {
        const ci = new Date(b.checkIn), co = new Date(b.checkOut)
        ci.setHours(0, 0, 0, 0); co.setHours(0, 0, 0, 0); date.setHours(0, 0, 0, 0)
        return date >= ci && date < co
    })

    const isSelected = (date) => {
        if (!checkIn && !checkOut) return false
        const d = new Date(date); d.setHours(0, 0, 0, 0)
        const ci = checkIn ? new Date(checkIn) : null
        const co = checkOut ? new Date(checkOut) : null
        if (ci) ci.setHours(0, 0, 0, 0)
        if (co) co.setHours(0, 0, 0, 0)
        if (ci && co) return d >= ci && d <= co
        if (ci) return d.getTime() === ci.getTime()
        return false
    }

    const isPast = (date) => {
        const today = new Date(); today.setHours(0, 0, 0, 0)
        return date < today
    }

    const { year, month } = viewMonth
    const days = daysInMonth(year, month)
    const startDay = firstDay(year, month)
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })

    const prevMonth = () => setViewMonth(v => {
        if (v.month === 0) return { year: v.year - 1, month: 11 }
        return { year: v.year, month: v.month - 1 }
    })
    const nextMonth = () => setViewMonth(v => {
        if (v.month === 11) return { year: v.year + 1, month: 0 }
        return { year: v.year, month: v.month + 1 }
    })

    return (
        <div className='rounded-2xl p-4' style={{ background: '#faf8f5', border: '1px solid #e8ddd4' }}>
            <div className='flex items-center justify-between mb-3'>
                <button onClick={prevMonth}
                    className='w-7 h-7 rounded-full flex items-center justify-center hover:bg-amber-50 transition-colors'
                    style={{ color: '#3d1a00' }}>‹</button>
                <span className='text-sm font-semibold' style={{ color: '#1a0a00' }}>{monthName} {year}</span>
                <button onClick={nextMonth}
                    className='w-7 h-7 rounded-full flex items-center justify-center hover:bg-amber-50 transition-colors'
                    style={{ color: '#3d1a00' }}>›</button>
            </div>

            <div className='grid grid-cols-7 gap-0.5 mb-1'>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className='text-center text-xs py-1' style={{ color: '#9c7a5a' }}>{d}</div>
                ))}
            </div>

            <div className='grid grid-cols-7 gap-0.5'>
                {[...Array(startDay)].map((_, i) => <div key={`e${i}`} />)}
                {[...Array(days)].map((_, i) => {
                    const date = new Date(year, month, i + 1)
                    const booked = isBooked(new Date(date))
                    const selected = isSelected(new Date(date))
                    const past = isPast(new Date(date))

                    let bg = 'transparent', color = '#1a0a00', textDeco = 'none'
                    if (past) { color = '#ccc'; }
                    if (booked) { bg = '#fee2e2'; color = '#dc2626'; textDeco = 'line-through' }
                    if (selected && !booked) { bg = '#fef3c7'; color = '#92400e' }

                    return (
                        <div key={i} className='flex items-center justify-center rounded-lg text-xs py-1.5'
                            style={{ background: bg, color, textDecoration: textDeco, fontSize: '12px' }}>
                            {i + 1}
                        </div>
                    )
                })}
            </div>

            <div className='flex items-center gap-4 mt-3 pt-3' style={{ borderTop: '1px solid #e8ddd4' }}>
                <div className='flex items-center gap-1.5 text-xs' style={{ color: '#9c7a5a' }}>
                    <div className='w-3 h-3 rounded' style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}></div>
                    Unavailable
                </div>
                <div className='flex items-center gap-1.5 text-xs' style={{ color: '#9c7a5a' }}>
                    <div className='w-3 h-3 rounded' style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}></div>
                    Your selection
                </div>
            </div>
        </div>
    )
}

// ─── Main ViewCard ─────────────────────────────────────────────────────────────
function ViewCard() {
    let navigate = useNavigate()
    let { cardDetails, setCardDetails, updating, setUpdating, deleting, setDeleting } = useContext(listingDataContext)
    let { userData } = useContext(userDataContext)
    let { serverUrl } = useContext(authDataContext)
    let { checkIn, setCheckIn, checkOut, setCheckOut, total, setTotal, night, setNight, handleBooking, booking } = useContext(bookingDataContext)

    const [tab, setTab] = useState('details') // 'details' | 'book' | 'edit'
    const [activeImg, setActiveImg] = useState(0)
    const [minDate] = useState(() => new Date().toISOString().split('T')[0])

    // Update form state
    const [uTitle, setUTitle] = useState(cardDetails?.title || '')
    const [uDesc, setUDesc] = useState(cardDetails?.description || '')
    const [uRent, setURent] = useState(cardDetails?.rent || '')
    const [uCity, setUCity] = useState(cardDetails?.city || '')
    const [uLandmark, setULandmark] = useState(cardDetails?.landMark || '')
    const [uImg1, setUImg1] = useState(null)
    const [uImg2, setUImg2] = useState(null)
    const [uImg3, setUImg3] = useState(null)

    const images = [cardDetails?.image1, cardDetails?.image2, cardDetails?.image3].filter(Boolean)
    const isOwner = userData?._id === cardDetails?.host
    const locationDisplay = cardDetails?.landMark?.trim()
        ? `${cardDetails.landMark}, ${cardDetails.city}`
        : cardDetails?.city

    // Date conflict check
    const hasConflict = useMemo(() => {
        if (!checkIn || !checkOut || !cardDetails?.bookedDates) return false
        const inD = new Date(checkIn), outD = new Date(checkOut)
        return cardDetails.bookedDates.some(b => {
            const ci = new Date(b.checkIn), co = new Date(b.checkOut)
            return inD < co && outD > ci
        })
    }, [checkIn, checkOut, cardDetails?.bookedDates])

    // Recalculate total
    useEffect(() => {
        if (checkIn && checkOut) {
            const n = (new Date(checkOut) - new Date(checkIn)) / (24 * 60 * 60 * 1000)
            setNight(n > 0 ? n : 0)
            if (n > 0) {
                const tax = cardDetails.rent * 0.07
                setTotal(cardDetails.rent * n + tax * 2)
            } else setTotal(0)
        }
    }, [checkIn, checkOut])

    const handleUpdate = async () => {
        setUpdating(true)
        try {
            const existing = cardDetails
            let formData = new FormData()
            formData.append("title", uTitle)
            formData.append("description", uDesc)
            formData.append("rent", uRent)
            formData.append("city", uCity)
            formData.append("landMark", uLandmark)
            if (uImg1) formData.append("image1", uImg1)
            if (uImg2) formData.append("image2", uImg2)
            if (uImg3) formData.append("image3", uImg3)

            const res = await axios.post(serverUrl + `/api/listing/update/${cardDetails._id}`, formData, { withCredentials: true })
            setCardDetails(res.data)
            setUpdating(false)
            setTab('details')
            toast.success("Listing updated!")
        } catch (e) {
            setUpdating(false)
            toast.error(e?.response?.data?.message || "Update failed")
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Delete this listing permanently?")) return
        setDeleting(true)
        try {
            await axios.delete(serverUrl + `/api/listing/delete/${cardDetails._id}`, { withCredentials: true })
            navigate("/")
            toast.success("Listing deleted")
        } catch (e) {
            setDeleting(false)
            toast.error("Delete failed")
        }
    }

    if (!cardDetails) { navigate("/"); return null }

    const inputCls = 'w-full px-4 py-2.5 rounded-xl outline-none text-sm transition-all'
    const inputStyle = { background: '#fff', border: '1.5px solid #e8ddd4', color: '#1a0a00', fontFamily: "'Georgia',serif" }

    return (
        <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Georgia', serif" }}>

            {/* ── Header ── */}
            <div className='sticky top-0 z-20 flex items-center gap-3 px-4 md:px-8 py-4'
                style={{ background: 'rgba(250,248,245,0.95)', borderBottom: '1px solid #f0ece6', backdropFilter: 'blur(8px)' }}>
                <button onClick={() => navigate("/")}
                    className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0'
                    style={{ background: '#f5f0eb', color: '#3d1a00' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className='flex-1 min-w-0'>
                    <h1 className='font-bold text-base truncate' style={{ color: '#1a0a00' }}>{locationDisplay}</h1>
                    <p className='text-xs truncate' style={{ color: '#9c7a5a' }}>{cardDetails.category}</p>
                </div>
                {/* Tab switcher */}
                <div className='flex gap-1 rounded-xl p-1' style={{ background: '#f0ece6' }}>
                    {[
                        { key: 'details', label: 'Details' },
                        ...(!isOwner ? [{ key: 'book', label: 'Book' }] : []),
                        ...(isOwner ? [{ key: 'edit', label: 'Edit' }] : []),
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className='px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200'
                            style={{
                                background: tab === t.key ? '#fff' : 'transparent',
                                color: tab === t.key ? '#1a0a00' : '#9c7a5a',
                                boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className='max-w-5xl mx-auto px-4 md:px-8 py-6'>

                {/* ── Image gallery ── */}
                <div className='mb-6'>
                    <div className='rounded-2xl overflow-hidden mb-2' style={{ height: '320px', background: '#e8ddd4' }}>
                        <img src={images[activeImg]} alt="" className='w-full h-full object-cover' />
                    </div>
                    <div className='flex gap-2'>
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setActiveImg(i)}
                                className='flex-1 rounded-xl overflow-hidden transition-all duration-200'
                                style={{ height: '72px', border: activeImg === i ? '2.5px solid #d97706' : '2.5px solid transparent' }}>
                                <img src={img} alt="" className='w-full h-full object-cover' />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─────────── DETAILS TAB ─────────── */}
                {tab === 'details' && (
                    <div className='grid md:grid-cols-3 gap-6'>
                        <div className='md:col-span-2 space-y-4'>
                            <div>
                                <h2 className='text-2xl font-bold mb-1' style={{ color: '#1a0a00' }}>
                                    {cardDetails.title}
                                </h2>
                                <div className='flex items-center gap-3 flex-wrap'>
                                    <span className='text-sm px-3 py-1 rounded-full'
                                        style={{ background: '#f5f0eb', color: '#6b3a1f' }}>
                                        {cardDetails.category}
                                    </span>
                                    {cardDetails.ratings > 0 && (
                                        <span className='flex items-center gap-1 text-sm'
                                            style={{ color: '#9c7a5a' }}>
                                            <FaStar className='text-amber-500' size={12} />
                                            {cardDetails.ratings} rating
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className='text-sm leading-relaxed' style={{ color: '#6b5a4e' }}>
                                {cardDetails.description}
                            </p>

                            {/* Availability summary */}
                            <div className='rounded-2xl p-4' style={{ background: '#fff', border: '1px solid #f0ece6' }}>
                                <h3 className='text-sm font-semibold mb-3' style={{ color: '#1a0a00' }}>
                                    Availability
                                </h3>
                                {cardDetails.bookedDates?.length > 0 ? (
                                    <div className='space-y-2'>
                                        {Array.isArray(cardDetails.bookedDates) && cardDetails.bookedDates.map((b, i) => {
                                            const ci = new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            const co = new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            return (
                                                <div key={i} className='flex items-center gap-2 text-xs px-3 py-2 rounded-lg'
                                                    style={{ background: '#fff5f5', color: '#dc2626' }}>
                                                    <div className='w-1.5 h-1.5 rounded-full bg-red-400'></div>
                                                    Booked: {ci} → {co}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2 text-xs px-3 py-2 rounded-lg'
                                        style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                        <div className='w-1.5 h-1.5 rounded-full bg-green-400'></div>
                                        Fully available — no existing bookings
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price card */}
                        <div className='rounded-2xl p-5' style={{ background: '#fff', border: '1px solid #f0ece6', height: 'fit-content' }}>
                            <p className='text-2xl font-bold mb-1' style={{ color: '#1a0a00' }}>
                                ₹{cardDetails.rent?.toLocaleString()}
                            </p>
                            <p className='text-xs mb-4' style={{ color: '#9c7a5a' }}>per night + taxes</p>
                            {!isOwner && (
                                <button onClick={() => setTab('book')}
                                    className='w-full py-3 rounded-xl font-semibold text-white text-sm transition-all'
                                    style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)', boxShadow: '0 4px 16px rgba(225,29,72,0.3)' }}>
                                    Reserve
                                </button>
                            )}
                            {isOwner && (
                                <button onClick={() => setTab('edit')}
                                    className='w-full py-3 rounded-xl font-semibold text-sm transition-all'
                                    style={{ background: '#f5f0eb', color: '#3d1a00' }}>
                                    Edit Listing
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ─────────── BOOK TAB ─────────── */}
                {tab === 'book' && (
                    <div className='grid md:grid-cols-2 gap-6'>

                        {/* Left: date picker + conflict warning */}
                        <div className='space-y-4'>
                            <h2 className='text-xl font-bold' style={{ color: '#1a0a00' }}>Choose your dates</h2>

                            {/* Calendar */}
                            <AvailabilityCalendar
                                bookedDates={cardDetails.bookedDates}
                                checkIn={checkIn}
                                checkOut={checkOut}
                            />

                            {/* Date inputs */}
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                                        style={{ color: '#9c7a5a', fontSize: '10px' }}>Check-in</label>
                                    <input type="date" min={minDate} value={checkIn}
                                        onChange={e => setCheckIn(e.target.value)}
                                        className='w-full px-3 py-2.5 rounded-xl outline-none text-sm'
                                        style={{ ...inputStyle }} />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                                        style={{ color: '#9c7a5a', fontSize: '10px' }}>Check-out</label>
                                    <input type="date" min={checkIn || minDate} value={checkOut}
                                        onChange={e => setCheckOut(e.target.value)}
                                        className='w-full px-3 py-2.5 rounded-xl outline-none text-sm'
                                        style={{ ...inputStyle }} />
                                </div>
                            </div>

                            {/* Conflict warning — shown BEFORE booking */}
                            {hasConflict && (
                                <div className='flex items-start gap-3 px-4 py-3 rounded-xl'
                                    style={{ background: '#fff5f5', border: '1px solid #fca5a5' }}>
                                    <span className='text-lg flex-shrink-0'>⚠️</span>
                                    <div>
                                        <p className='text-sm font-semibold' style={{ color: '#dc2626' }}>
                                            These dates are already booked
                                        </p>
                                        <p className='text-xs mt-0.5' style={{ color: '#ef4444' }}>
                                            Please choose different dates. Red dates on the calendar show unavailable periods.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Good dates feedback */}
                            {checkIn && checkOut && night > 0 && !hasConflict && (
                                <div className='flex items-center gap-2 px-4 py-3 rounded-xl'
                                    style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                                    <span>✅</span>
                                    <p className='text-sm' style={{ color: '#16a34a' }}>
                                        {night} night{night > 1 ? 's' : ''} — dates are available!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: price summary + book button */}
                        <div className='space-y-4'>
                            <h2 className='text-xl font-bold' style={{ color: '#1a0a00' }}>Price breakdown</h2>

                            <div className='rounded-2xl p-5 space-y-3' style={{ background: '#fff', border: '1px solid #f0ece6' }}>
                                {/* Listing thumbnail */}
                                <div className='flex gap-3 pb-3' style={{ borderBottom: '1px solid #f0ece6' }}>
                                    <div className='w-16 h-16 rounded-xl overflow-hidden flex-shrink-0'>
                                        <img src={cardDetails.image1} className='w-full h-full object-cover' alt="" />
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='text-sm font-semibold truncate' style={{ color: '#1a0a00' }}>{locationDisplay}</p>
                                        <p className='text-xs truncate' style={{ color: '#9c7a5a' }}>{cardDetails.title}</p>
                                        {cardDetails.ratings > 0 && (
                                            <span className='flex items-center gap-1 text-xs mt-1' style={{ color: '#9c7a5a' }}>
                                                <FaStar className='text-amber-500' size={10} />{cardDetails.ratings}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Line items */}
                                {[
                                    { label: `₹${cardDetails.rent?.toLocaleString()} × ${night} night${night !== 1 ? 's' : ''}`, value: cardDetails.rent * night },
                                    { label: 'StayLoft service fee (7%)', value: Math.round(cardDetails.rent * 0.07) },
                                    { label: 'Taxes (7%)', value: Math.round(cardDetails.rent * 0.07) },
                                ].map((row, i) => (
                                    <div key={i} className='flex justify-between items-center text-sm'>
                                        <span style={{ color: '#6b5a4e' }}>{row.label}</span>
                                        <span style={{ color: '#1a0a00' }}>₹{row.value?.toLocaleString()}</span>
                                    </div>
                                ))}

                                <div className='flex justify-between items-center pt-3 text-base font-bold'
                                    style={{ borderTop: '1.5px solid #f0ece6', color: '#1a0a00' }}>
                                    <span>Total</span>
                                    <span>₹{total?.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleBooking(cardDetails._id)}
                                disabled={booking || hasConflict || !checkIn || !checkOut || night <= 0}
                                className='w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all'
                                style={{
                                    background: (booking || hasConflict || !checkIn || !checkOut || night <= 0)
                                        ? '#d4c4b8'
                                        : 'linear-gradient(135deg, #e11d48, #be123c)',
                                    cursor: (hasConflict || !checkIn || !checkOut || night <= 0) ? 'not-allowed' : 'pointer',
                                    boxShadow: (!hasConflict && checkIn && checkOut && night > 0 && !booking)
                                        ? '0 4px 16px rgba(225,29,72,0.3)' : 'none'
                                }}>
                                {booking ? 'Booking...' : hasConflict ? 'Dates unavailable' : 'Confirm Booking'}
                            </button>

                            <p className='text-xs text-center' style={{ color: '#9c7a5a' }}>
                                You won't be charged until you confirm
                            </p>
                        </div>
                    </div>
                )}

                {/* ─────────── EDIT TAB ─────────── */}
                {tab === 'edit' && isOwner && (
                    <div className='max-w-2xl space-y-5'>
                        <h2 className='text-xl font-bold' style={{ color: '#1a0a00' }}>Edit Listing</h2>

                        {[
                            { label: 'Title', value: uTitle, setter: setUTitle, type: 'text', placeholder: 'e.g. 3BHK Villa with Pool' },
                            { label: 'Rent per night (₹)', value: uRent, setter: setURent, type: 'number', placeholder: '5000' },
                            { label: 'City', value: uCity, setter: setUCity, type: 'text', placeholder: 'Mumbai' },
                            { label: 'Landmark', value: uLandmark, setter: setULandmark, type: 'text', placeholder: 'Near Marine Drive' },
                        ].map(field => (
                            <div key={field.label}>
                                <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                                    style={{ color: '#9c7a5a', fontSize: '10px' }}>{field.label}</label>
                                <input type={field.type} value={field.value}
                                    onChange={e => field.setter(e.target.value)}
                                    placeholder={field.placeholder}
                                    className={inputCls}
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#d97706'}
                                    onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
                            </div>
                        ))}

                        <div>
                            <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                                style={{ color: '#9c7a5a', fontSize: '10px' }}>Description</label>
                            <textarea value={uDesc} onChange={e => setUDesc(e.target.value)}
                                rows={4} placeholder="Describe your property..."
                                className={inputCls}
                                style={{ ...inputStyle, resize: 'vertical' }}
                                onFocus={e => e.target.style.borderColor = '#d97706'}
                                onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
                        </div>

                        {/* Optional image replacement */}
                        <div className='rounded-2xl p-4 space-y-3' style={{ background: '#fff', border: '1px solid #f0ece6' }}>
                            <p className='text-xs font-semibold uppercase tracking-wider' style={{ color: '#9c7a5a', fontSize: '10px' }}>
                                Replace images (optional — leave blank to keep current)
                            </p>
                            {[
                                { label: 'Image 1', setter: setUImg1 },
                                { label: 'Image 2', setter: setUImg2 },
                                { label: 'Image 3', setter: setUImg3 },
                            ].map(f => (
                                <div key={f.label}>
                                    <label className='block text-xs mb-1' style={{ color: '#6b5a4e' }}>{f.label}</label>
                                    <input type="file" accept="image/*"
                                        onChange={e => f.setter(e.target.files[0])}
                                        className='w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700' />
                                </div>
                            ))}
                        </div>

                        <div className='flex gap-3'>
                            <button onClick={handleUpdate} disabled={updating}
                                className='flex-1 py-3 rounded-xl font-semibold text-white text-sm'
                                style={{ background: updating ? '#9c7a5a' : 'linear-gradient(135deg, #d97706, #b45309)' }}>
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={handleDelete} disabled={deleting}
                                className='px-6 py-3 rounded-xl font-semibold text-sm'
                                style={{ background: '#fee2e2', color: '#dc2626' }}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewCard