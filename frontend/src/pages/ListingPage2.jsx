import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { listingDataContext } from '../Context/ListingContext';

const steps = ['Property Info', 'Category', 'Preview']

function StepBar({ current }) {
  return (
    <div className='flex items-center gap-0 mb-8'>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className='flex flex-col items-center gap-1'>
            <div className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold'
              style={{ background: i <= current ? '#e11d48' : '#f0ece6', color: i <= current ? '#fff' : '#9c7a5a' }}>
              {i + 1}
            </div>
            <span className='text-xs hidden md:block' style={{ color: i === current ? '#1a0a00' : '#9c7a5a' }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className='flex-1 h-0.5 mx-2 mb-4' style={{ background: i < current ? '#e11d48' : '#f0ece6' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

const categories = [
  { key: 'villa', label: 'Villa', icon: GiFamilyHouse, desc: 'Luxury standalone home' },
  { key: 'farmHouse', label: 'Farm House', icon: FaTreeCity, desc: 'Rural escape with land' },
  { key: 'poolHouse', label: 'Pool House', icon: MdOutlinePool, desc: 'Private pool included' },
  { key: 'rooms', label: 'Rooms', icon: MdBedroomParent, desc: 'Private room rental' },
  { key: 'flat', label: 'Flat', icon: BiBuildingHouse, desc: 'Apartment or flat' },
  { key: 'pg', label: 'PG', icon: IoBedOutline, desc: 'Paying guest setup' },
  { key: 'cabin', label: 'Cabin', icon: GiWoodCabin, desc: 'Forest or hill retreat' },
  { key: 'shops', label: 'Shop / Commercial', icon: SiHomeassistantcommunitystore, desc: 'Commercial space' },
]

function ListingPage2() {
  let navigate = useNavigate()
  let { category, setCategory } = useContext(listingDataContext)

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Georgia',serif" }}>
      <div className='flex items-center gap-3 px-4 md:px-8 py-4 sticky top-0 z-10'
        style={{ background: 'rgba(250,248,245,0.95)', borderBottom: '1px solid #f0ece6', backdropFilter: 'blur(8px)' }}>
        <button onClick={() => navigate("/listingpage1")}
          className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0'
          style={{ background: '#f5f0eb', color: '#3d1a00' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className='font-bold text-base' style={{ color: '#1a0a00' }}>List your home</span>
        <span className='ml-auto text-xs px-3 py-1 rounded-full' style={{ background: '#f5f0eb', color: '#6b3a1f' }}>Step 2 of 3</span>
      </div>

      <div className='max-w-2xl mx-auto px-4 md:px-8 py-6'>
        <StepBar current={1} />

        <div className='rounded-2xl p-6' style={{ background: '#fff', border: '1px solid #f0ece6' }}>
          <h2 className='text-xl font-bold mb-1' style={{ color: '#1a0a00' }}>What type of place is it?</h2>
          <p className='text-sm mb-5' style={{ color: '#9c7a5a' }}>Pick the category that best describes your property</p>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {categories.map(cat => {
              const Icon = cat.icon
              const active = category === cat.key
              return (
                <button key={cat.key} onClick={() => setCategory(cat.key)}
                  className='flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all duration-200'
                  style={{
                    border: active ? '2px solid #e11d48' : '1.5px solid #f0ece6',
                    background: active ? '#fff5f7' : '#faf8f5',
                    color: active ? '#e11d48' : '#6b5a4e'
                  }}>
                  <Icon size={28} />
                  <div>
                    <p className='text-xs font-semibold' style={{ color: active ? '#e11d48' : '#1a0a00' }}>{cat.label}</p>
                    <p className='text-xs mt-0.5 leading-tight hidden md:block' style={{ color: '#9c7a5a' }}>{cat.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => navigate("/listingpage3")}
          disabled={!category}
          className='w-full mt-5 py-3.5 rounded-xl font-semibold text-white text-sm transition-all'
          style={{
            background: category ? 'linear-gradient(135deg, #e11d48, #be123c)' : '#d4c4b8',
            cursor: category ? 'pointer' : 'not-allowed',
            boxShadow: category ? '0 4px 16px rgba(225,29,72,0.25)' : 'none'
          }}>
          Next → Preview
        </button>
      </div>
    </div>
  )
}

export default ListingPage2