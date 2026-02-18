import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';
import { FaStar } from 'react-icons/fa';

const steps = ['Property Info', 'Category', 'Preview']

function StepBar({ current }) {
    return (
        <div className='flex items-center gap-0 mb-8'>
            {steps.map((s, i) => (
                <React.Fragment key={s}>
                    <div className='flex flex-col items-center gap-1'>
                        <div className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold'
                            style={{ background: i <= current ? '#e11d48' : '#f0ece6', color: i <= current ? '#fff' : '#9c7a5a' }}>
                            {i < current ? '✓' : i + 1}
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

function ListingPage3() {
    let navigate = useNavigate()
    let { title, description, frontEndImage1, frontEndImage2, frontEndImage3,
        rent, city, landmark, category, handleAddListing, adding } = useContext(listingDataContext)

    const [activeImg, setActiveImg] = useState(0)
    const images = [frontEndImage1, frontEndImage2, frontEndImage3].filter(Boolean)

    // Fix comma display here too
    const locationDisplay = landmark?.trim() ? `${landmark}, ${city}` : city

    return (
        <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Georgia',serif" }}>
            <div className='flex items-center gap-3 px-4 md:px-8 py-4 sticky top-0 z-10'
                style={{ background: 'rgba(250,248,245,0.95)', borderBottom: '1px solid #f0ece6', backdropFilter: 'blur(8px)' }}>
                <button onClick={() => navigate("/listingpage2")}
                    className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0'
                    style={{ background: '#f5f0eb', color: '#3d1a00' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <span className='font-bold text-base' style={{ color: '#1a0a00' }}>Preview your listing</span>
                <span className='ml-auto text-xs px-3 py-1 rounded-full' style={{ background: '#f5f0eb', color: '#6b3a1f' }}>Step 3 of 3</span>
            </div>

            <div className='max-w-2xl mx-auto px-4 md:px-8 py-6'>
                <StepBar current={2} />

                {/* Preview card — looks like a real listing */}
                <div className='rounded-2xl overflow-hidden' style={{ background: '#fff', border: '1px solid #f0ece6' }}>

                    {/* Image gallery */}
                    {images.length > 0 && (
                        <div>
                            <div style={{ height: '260px', background: '#f0ece6' }}>
                                <img src={images[activeImg]} className='w-full h-full object-cover' alt="" />
                            </div>
                            {images.length > 1 && (
                                <div className='flex gap-2 p-3'>
                                    {images.map((img, i) => (
                                        <button key={i} onClick={() => setActiveImg(i)}
                                            className='flex-1 rounded-xl overflow-hidden'
                                            style={{ height: '60px', border: activeImg === i ? '2px solid #e11d48' : '2px solid transparent' }}>
                                            <img src={img} className='w-full h-full object-cover' alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Details */}
                    <div className='p-5 space-y-3'>
                        <div className='flex items-start justify-between gap-3'>
                            <div>
                                <h2 className='text-lg font-bold' style={{ color: '#1a0a00' }}>{locationDisplay}</h2>
                                <p className='text-sm mt-0.5' style={{ color: '#9c7a5a' }}>{title}</p>
                            </div>
                            <span className='flex items-center gap-1 text-sm flex-shrink-0' style={{ color: '#9c7a5a' }}>
                                <FaStar className='text-amber-400' size={12} /> New
                            </span>
                        </div>

                        <div className='flex items-center gap-2'>
                            <span className='text-xs px-3 py-1 rounded-full' style={{ background: '#f5f0eb', color: '#6b3a1f' }}>
                                {category}
                            </span>
                        </div>

                        <p className='text-sm leading-relaxed' style={{ color: '#6b5a4e' }}>{description}</p>

                        <div className='flex items-center justify-between pt-3' style={{ borderTop: '1px solid #f0ece6' }}>
                            <div>
                                <span className='text-xl font-bold' style={{ color: '#1a0a00' }}>₹{Number(rent)?.toLocaleString()}</span>
                                <span className='text-sm' style={{ color: '#9c7a5a' }}> / night</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notice */}
                <div className='mt-4 px-4 py-3 rounded-xl text-sm flex items-start gap-2'
                    style={{ background: '#fef9ec', border: '1px solid #fcd34d', color: '#92400e' }}>
                    <span className='flex-shrink-0'>💡</span>
                    <span>This is how guests will see your listing. Once published, you can edit it anytime from My Listing.</span>
                </div>

                <div className='flex gap-3 mt-5'>
                    <button onClick={() => navigate("/listingpage2")}
                        className='px-6 py-3 rounded-xl font-semibold text-sm'
                        style={{ background: '#f5f0eb', color: '#3d1a00' }}>
                        Edit
                    </button>
                    <button onClick={handleAddListing} disabled={adding}
                        className='flex-1 py-3.5 rounded-xl font-semibold text-white text-sm transition-all'
                        style={{
                            background: adding ? '#9c7a5a' : 'linear-gradient(135deg, #e11d48, #be123c)',
                            boxShadow: adding ? 'none' : '0 4px 16px rgba(225,29,72,0.25)'
                        }}>
                        {adding ? 'Publishing...' : '🚀 Publish Listing'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ListingPage3