import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext';
import Card from '../Component/Card';
import { FaStar } from 'react-icons/fa';

export default function MyListing() {
  const navigate = useNavigate()
  const { userData } = useContext(userDataContext)
  const listings = userData?.listing || []

  const totalRevenue = listings.reduce((sum, l) => sum + (l.rent || 0), 0)
  const bookedCount = listings.filter(l => l.bookedDates?.length > 0).length
  const avgRating = listings.filter(l => l.ratings > 0).length > 0
    ? (listings.reduce((s, l) => s + (l.ratings || 0), 0) / listings.filter(l => l.ratings > 0).length).toFixed(1)
    : 0

  const stats = [
    { label: 'Total Properties', value: listings.length, suffix: '' },
    { label: 'Currently Booked', value: bookedCount, suffix: '' },
    { label: 'Avg. Rating', value: avgRating, suffix: '★' },
    { label: 'Est. Daily Value', value: `₹${totalRevenue.toLocaleString()}`, suffix: '' },
  ]

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate("/")} style={{
            width: '36px', height: '36px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease', color: '#9898B8'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px' }}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '500', color: '#E8E8F0' }}>My Listings</h1>
            <p style={{ fontSize: '10px', color: '#6B6B8A', letterSpacing: '0.06em' }}>{listings.length} {listings.length === 1 ? 'property' : 'properties'}</p>
          </div>
        </div>
        <button onClick={() => navigate("/listingpage1")} style={{
          padding: '10px 24px', borderRadius: '4px',
          background: 'linear-gradient(135deg, #C9A96E, #A07840)',
          border: 'none', color: '#0A0A0F', fontSize: '10px', fontWeight: '700',
          letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.3s ease', fontFamily: "'Montserrat', sans-serif",
          boxShadow: '0 4px 20px rgba(201,169,110,0.2)'
        }}>+ Add Property</button>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Analytics stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '40px', animation: 'fadeUp 0.6s ease forwards'
        }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{
              background: '#1A1A24', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '24px', position: 'relative', overflow: 'hidden',
              animation: 'fadeUp 0.5s ease forwards', animationDelay: `${i * 0.08}s`, opacity: 0
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)'
              }} />
              <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B8A', marginBottom: '12px' }}>
                {stat.label}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '500',
                background: 'linear-gradient(135deg, #E8D5A3, #C9A96E)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {stat.value}{stat.suffix}
              </p>
            </div>
          ))}
        </div>

        {/* Listings grid */}
        {listings.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 0', textAlign: 'center',
            animation: 'fadeUp 0.6s ease forwards'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
            }}>
              <span style={{ fontSize: '32px' }}>🏠</span>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '400', color: '#E8E8F0', marginBottom: '8px' }}>
              No properties yet
            </h3>
            <p style={{ fontSize: '13px', color: '#6B6B8A', marginBottom: '32px' }}>Start earning by listing your first property</p>
            <button onClick={() => navigate("/listingpage1")} style={{
              padding: '14px 36px', borderRadius: '4px',
              background: 'linear-gradient(135deg, #C9A96E, #A07840)',
              border: 'none', color: '#0A0A0F', fontSize: '11px', fontWeight: '700',
              letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif", boxShadow: '0 8px 32px rgba(201,169,110,0.25)'
            }}>List a Property</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B6B8A', marginBottom: '20px' }}>
              Your Portfolio
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {listings.map((list, i) => (
                <div key={list._id} style={{ animation: 'fadeUp 0.5s ease forwards', animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                  <Card
                    title={list.title} landMark={list.landMark} city={list.city}
                    image1={list.image1} rent={list.rent} id={list._id}
                    ratings={list.ratings} bookedDates={list.bookedDates} host={list.host}
                    bookingId={list.bookedDates?.[0]?.bookingId}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
