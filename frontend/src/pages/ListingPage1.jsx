import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';

const steps = ['Property Info', 'Category', 'Preview']

function StepBar({ current }) {
  return (
    <div className='flex items-center gap-0 mb-8'>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className='flex flex-col items-center gap-1'>
            <div className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all'
              style={{
                background: i <= current ? '#e11d48' : '#f0ece6',
                color: i <= current ? '#fff' : '#9c7a5a'
              }}>{i + 1}</div>
            <span className='text-xs hidden md:block'
              style={{ color: i === current ? '#1a0a00' : '#9c7a5a' }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className='flex-1 h-0.5 mx-2 mb-4'
              style={{ background: i < current ? '#e11d48' : '#f0ece6' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function ListingPage1() {
  let navigate = useNavigate()
  let { title, setTitle, description, setDescription,
    frontEndImage1, setFrontEndImage1,
    frontEndImage2, setFrontEndImage2,
    frontEndImage3, setFrontEndImage3,
    backEndImage1, setBackEndImage1,
    backEndImage2, setBackEndImage2,
    backEndImage3, setBackEndImage3,
    rent, setRent, city, setCity, landmark, setLandmark } = useContext(listingDataContext)

  const handleImg = (e, setFE, setBE) => {
    const f = e.target.files[0]
    if (!f) return
    setBE(f)
    setFE(URL.createObjectURL(f))
  }

  const canProceed = title && description && backEndImage1 && backEndImage2 && backEndImage3 && rent && city

  const inputStyle = {
    background: '#fff', border: '1.5px solid #e8ddd4',
    color: '#1a0a00', fontFamily: "'Georgia',serif",
    borderRadius: '12px', outline: 'none',
    padding: '10px 16px', width: '100%', fontSize: '14px'
  }
  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#9c7a5a', marginBottom: '6px'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Georgia',serif" }}>
      {/* Header */}
      <div className='flex items-center gap-3 px-4 md:px-8 py-4 sticky top-0 z-10'
        style={{ background: 'rgba(250,248,245,0.95)', borderBottom: '1px solid #f0ece6', backdropFilter: 'blur(8px)' }}>
        <button onClick={() => navigate("/")}
          className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0'
          style={{ background: '#f5f0eb', color: '#3d1a00' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className='font-bold text-base' style={{ color: '#1a0a00' }}>List your home</span>
        <span className='ml-auto text-xs px-3 py-1 rounded-full'
          style={{ background: '#f5f0eb', color: '#6b3a1f' }}>Step 1 of 3</span>
      </div>

      <div className='max-w-2xl mx-auto px-4 md:px-8 py-6'>
        <StepBar current={0} />

        <div className='rounded-2xl p-6 space-y-5' style={{ background: '#fff', border: '1px solid #f0ece6' }}>
          <h2 className='text-xl font-bold' style={{ color: '#1a0a00' }}>Tell us about your place</h2>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Cozy 2BHK with mountain view"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what makes your place special..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
          </div>

          {/* Images */}
          <div>
            <label style={labelStyle}>Photos (3 required)</label>
            <div className='grid grid-cols-3 gap-3'>
              {[
                { fe: frontEndImage1, setFE: setFrontEndImage1, setBE: setBackEndImage1, label: 'Main' },
                { fe: frontEndImage2, setFE: setFrontEndImage2, setBE: setBackEndImage2, label: '2nd' },
                { fe: frontEndImage3, setFE: setFrontEndImage3, setBE: setBackEndImage3, label: '3rd' },
              ].map((img, i) => (
                <label key={i} className='cursor-pointer'>
                  <div className='rounded-xl overflow-hidden flex items-center justify-center transition-all'
                    style={{
                      height: '100px', background: img.fe ? 'transparent' : '#faf8f5',
                      border: `1.5px dashed ${img.fe ? '#d97706' : '#e8ddd4'}`
                    }}>
                    {img.fe
                      ? <img src={img.fe} className='w-full h-full object-cover' alt="" />
                      : <div className='flex flex-col items-center gap-1'>
                        <span className='text-2xl'>📷</span>
                        <span className='text-xs' style={{ color: '#9c7a5a' }}>{img.label}</span>
                      </div>
                    }
                  </div>
                  <input type="file" accept="image/*" className='hidden'
                    onChange={e => handleImg(e, img.setFE, img.setBE)} />
                </label>
              ))}
            </div>
          </div>

          {/* Rent + City + Landmark */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label style={labelStyle}>Rent per night (₹)</label>
              <input type="number" value={rent}
                onChange={e => setRent(e.target.value)}
                placeholder="5000"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#d97706'}
                onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input type="text" value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Mumbai"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#d97706'}
                onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Landmark <span style={{ color: '#ccc', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input type="text" value={landmark}
              onChange={e => setLandmark(e.target.value)}
              placeholder="Near Juhu Beach"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
          </div>
        </div>

        <button
          onClick={() => navigate("/listingpage2")}
          disabled={!canProceed}
          className='w-full mt-5 py-3.5 rounded-xl font-semibold text-white text-sm transition-all'
          style={{
            background: canProceed ? 'linear-gradient(135deg, #e11d48, #be123c)' : '#d4c4b8',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            boxShadow: canProceed ? '0 4px 16px rgba(225,29,72,0.25)' : 'none'
          }}>
          Next → Choose Category
        </button>
      </div>
    </div>
  )
}

export default ListingPage1