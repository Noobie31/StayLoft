import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext';
import Card from '../Component/Card';

function MyListing() {
  let navigate = useNavigate()
  let { userData } = useContext(userDataContext)

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
      <div className='sticky top-0 z-10 px-4 md:px-8 py-4 border-b flex items-center gap-4'
        style={{ background: '#fff', borderColor: '#f0ece6' }}>
        <button onClick={() => navigate("/")}
          className='w-9 h-9 rounded-full flex items-center justify-center transition-colors'
          style={{ background: '#f5f0eb', color: '#3d1a00' }}
          onMouseEnter={e => e.currentTarget.style.background = '#e8ddd4'}
          onMouseLeave={e => e.currentTarget.style.background = '#f5f0eb'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className='text-lg font-bold' style={{ color: '#1a0a00' }}>My Listings</h1>
          <p className='text-xs' style={{ color: '#9c7a5a' }}>
            {userData?.listing?.length || 0} {userData?.listing?.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <button onClick={() => navigate("/listingpage1")}
          className='ml-auto px-4 py-2 rounded-xl text-sm font-semibold text-white'
          style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}>
          + Add New
        </button>
      </div>

      <div className='px-4 md:px-8 py-8'>
        {userData?.listing?.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='text-5xl mb-4'>🏠</div>
            <h3 className='text-xl font-semibold mb-2' style={{ color: '#3d1a00' }}>No listings yet</h3>
            <p className='text-sm mb-6' style={{ color: '#9c7a5a' }}>Start earning by listing your property</p>
            <button onClick={() => navigate("/listingpage1")}
              className='px-6 py-3 rounded-xl text-sm font-semibold text-white'
              style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}>
              List a Property
            </button>
          </div>
        ) : (
          <div className='grid gap-6' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {Array.isArray(userData?.listing) && userData.listing.map(list => (
              <Card
                key={list._id}
                title={list.title}
                landMark={list.landMark}
                city={list.city}
                image1={list.image1}
                image2={list.image2}
                image3={list.image3}
                rent={list.rent}
                id={list._id}
                ratings={list.ratings}
                bookedDates={list.bookedDates}
                host={list.host}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListing