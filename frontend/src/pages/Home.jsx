import React, { useContext } from 'react'
import Nav from '../Component/Nav'
import Card from '../Component/Card';
import { listingDataContext } from '../Context/ListingContext';

function Home() {
  let { newListData } = useContext(listingDataContext)

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>
      <Nav />

      {/* Main content - offset for fixed nav (top bar ~72px + mobile search ~52px + categories ~60px) */}
      <div className='pt-[195px] md:pt-[148px] px-4 md:px-8 pb-12'>
        {newListData.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='w-16 h-16 rounded-2xl flex items-center justify-center mb-4'
              style={{ background: '#f5f0eb' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9c7a5a" strokeWidth="1.5" className="w-8 h-8">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className='text-xl font-semibold mb-2' style={{ color: '#3d1a00' }}>No listings found</h3>
            <p className='text-sm' style={{ color: '#9c7a5a' }}>Try a different category or search term</p>
          </div>
        ) : (
          <>
            <p className='text-sm mb-6' style={{ color: '#9c7a5a' }}>
              {newListData.length} {newListData.length === 1 ? 'place' : 'places'} to stay
            </p>
            <div className='grid gap-6' style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
            }}>
              {newListData.map(list => (
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
          </>
        )}
      </div>
    </div>
  )
}

export default Home