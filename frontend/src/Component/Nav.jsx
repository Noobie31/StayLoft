import React, { useContext, useEffect, useRef, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdWhatshot, MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';

const categories = [
    { key: 'trending', label: 'Trending', icon: MdWhatshot },
    { key: 'villa', label: 'Villa', icon: GiFamilyHouse },
    { key: 'farmHouse', label: 'Farm House', icon: FaTreeCity },
    { key: 'poolHouse', label: 'Pool House', icon: MdOutlinePool },
    { key: 'rooms', label: 'Rooms', icon: MdBedroomParent },
    { key: 'flat', label: 'Flat', icon: BiBuildingHouse },
    { key: 'pg', label: 'PG', icon: IoBedOutline },
    { key: 'cabin', label: 'Cabins', icon: GiWoodCabin },
    { key: 'shops', label: 'Shops', icon: SiHomeassistantcommunitystore },
]

function Nav() {
    let [showPopup, setShowPopup] = useState(false)
    let { userData, setUserData } = useContext(userDataContext)
    let navigate = useNavigate()
    let { serverUrl } = useContext(authDataContext)
    let [activeCategory, setActiveCategory] = useState('trending')
    let { listingData, setNewListData, searchData, handleSearch, handleViewCard, setSearchData } = useContext(listingDataContext)
    let [input, setInput] = useState("")
    let searchRef = useRef(null)

    const handleLogOut = async () => {
        try {
            await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true })
            setUserData(null)
            setShowPopup(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCategory = (key) => {
        setActiveCategory(key)
        if (key === 'trending') {
            setNewListData(listingData)
        } else {
            setNewListData(listingData.filter(l => l.category === key))
        }
    }

    const handleSearchClick = (id) => {
        setSearchData([])
        setInput("")
        if (userData) handleViewCard(id)
        else navigate("/login")
    }

    useEffect(() => {
        const timer = setTimeout(() => handleSearch(input), 300)
        return () => clearTimeout(timer)
    }, [input])

    // Close search on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchData([])
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className='fixed top-0 w-full z-20' style={{ background: '#fff', fontFamily: "'Georgia', serif" }}>
            {/* Top bar */}
            <div className='w-full border-b px-4 md:px-8 flex items-center justify-between gap-4'
                style={{ height: '72px', borderColor: '#f0ece6' }}>

                {/* Logo */}
                <button onClick={() => navigate("/")}
                    className='flex items-center gap-2 flex-shrink-0'
                    style={{ color: '#e11d48' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className='text-xl font-bold hidden sm:block' style={{ color: '#e11d48', letterSpacing: '-0.01em' }}>
                        StayLoft
                    </span>
                </button>

                {/* Search bar */}
                <div className='flex-1 max-w-md relative hidden md:block' ref={searchRef}>
                    <div className='flex items-center rounded-full border-2 px-4 py-2 transition-all duration-200'
                        style={{ borderColor: input ? '#e11d48' : '#e8ddd4', background: '#faf8f5' }}>
                        <FiSearch style={{ color: '#9c7a5a' }} size={16} className='flex-shrink-0' />
                        <input
                            type="text"
                            className='flex-1 bg-transparent outline-none px-3 text-sm'
                            style={{ color: '#1a0a00', fontFamily: "'Georgia', serif" }}
                            placeholder='Search by city, landmark, or title...'
                            onChange={e => setInput(e.target.value)}
                            value={input}
                        />
                        {input && (
                            <button onClick={() => { setInput(""); setSearchData([]) }}
                                style={{ color: '#9c7a5a' }} className='text-lg leading-none'>×</button>
                        )}
                    </div>

                    {/* Search results dropdown */}
                    {searchData?.length > 0 && (
                        <div className='absolute top-full mt-2 w-full rounded-2xl shadow-xl border overflow-hidden'
                            style={{ background: '#fff', borderColor: '#f0ece6', zIndex: 50 }}>
                            {searchData.map(item => (
                                <button key={item._id}
                                    onClick={() => handleSearchClick(item._id)}
                                    className='w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-amber-50 transition-colors border-b last:border-b-0'
                                    style={{ borderColor: '#f0ece6' }}>
                                    <div className='w-10 h-10 rounded-lg overflow-hidden flex-shrink-0'>
                                        <img src={item.image1} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='text-sm font-semibold truncate' style={{ color: '#1a0a00' }}>{item.title}</p>
                                        <p className='text-xs truncate' style={{ color: '#9c7a5a' }}>{item.landMark}, {item.city}</p>
                                    </div>
                                    <span className='ml-auto text-xs font-semibold flex-shrink-0' style={{ color: '#e11d48' }}>
                                        ₹{item.rent?.toLocaleString()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right actions */}
                <div className='flex items-center gap-3 relative'>
                    <button
                        onClick={() => navigate("/listingpage1")}
                        className='hidden md:block text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200'
                        style={{ color: '#3d1a00' }}
                        onMouseEnter={e => e.target.style.background = '#f5f0eb'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        List your home
                    </button>

                    <button
                        onClick={() => setShowPopup(p => !p)}
                        className='flex items-center gap-2.5 px-3 py-2 rounded-full border-2 transition-all duration-200 hover:shadow-md'
                        style={{ borderColor: '#e8ddd4' }}>
                        <GiHamburgerMenu size={16} style={{ color: '#1a0a00' }} />
                        {userData
                            ? <div className='w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white'
                                style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}>
                                {userData.name?.slice(0, 1).toUpperCase()}
                            </div>
                            : <CgProfile size={20} style={{ color: '#1a0a00' }} />
                        }
                    </button>

                    {/* Dropdown menu */}
                    {showPopup && (
                        <div className='absolute top-full right-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden'
                            style={{ background: '#fff', borderColor: '#f0ece6', zIndex: 50 }}>
                            {userData && (
                                <div className='px-4 py-3 border-b' style={{ borderColor: '#f0ece6' }}>
                                    <p className='text-sm font-semibold' style={{ color: '#1a0a00' }}>{userData.name}</p>
                                    <p className='text-xs truncate' style={{ color: '#9c7a5a' }}>{userData.email}</p>
                                </div>
                            )}
                            <div className='py-1'>
                                {!userData && (
                                    <MenuBtn label="Login" onClick={() => { navigate("/login"); setShowPopup(false) }} />
                                )}
                                {userData && (
                                    <MenuBtn label="Logout" onClick={handleLogOut} danger />
                                )}
                                <div style={{ height: '1px', background: '#f0ece6', margin: '4px 0' }} />
                                <MenuBtn label="List your Home" onClick={() => { navigate("/listingpage1"); setShowPopup(false) }} />
                                <MenuBtn label="My Listing" onClick={() => { navigate("/mylisting"); setShowPopup(false) }} />
                                <MenuBtn label="My Bookings" onClick={() => { navigate("/mybooking"); setShowPopup(false) }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile search */}
            <div className='md:hidden px-4 py-2 border-b' style={{ borderColor: '#f0ece6' }} ref={searchRef}>
                <div className='flex items-center rounded-full border-2 px-4 py-2'
                    style={{ borderColor: input ? '#e11d48' : '#e8ddd4', background: '#faf8f5' }}>
                    <FiSearch style={{ color: '#9c7a5a' }} size={16} />
                    <input
                        type="text"
                        className='flex-1 bg-transparent outline-none px-3 text-sm'
                        style={{ color: '#1a0a00', fontFamily: "'Georgia', serif" }}
                        placeholder='Search city, landmark...'
                        onChange={e => setInput(e.target.value)}
                        value={input}
                    />
                </div>
                {searchData?.length > 0 && (
                    <div className='mt-1 rounded-2xl shadow-xl border overflow-hidden'
                        style={{ background: '#fff', borderColor: '#f0ece6' }}>
                        {searchData.map(item => (
                            <button key={item._id}
                                onClick={() => handleSearchClick(item._id)}
                                className='w-full px-4 py-2.5 text-left flex items-center gap-3 border-b last:border-b-0'
                                style={{ borderColor: '#f0ece6' }}>
                                <p className='text-sm' style={{ color: '#1a0a00' }}>{item.title} — {item.city}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Category bar */}
            <div className='w-full overflow-x-auto border-b' style={{ borderColor: '#f0ece6' }}>
                <div className='flex items-center gap-1 px-4 md:px-8 py-2 min-w-max'>
                    {categories.map(cat => {
                        const Icon = cat.icon
                        const isActive = activeCategory === cat.key
                        return (
                            <button key={cat.key}
                                onClick={() => handleCategory(cat.key)}
                                className='flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0'
                                style={{
                                    background: isActive ? '#fff5f5' : 'transparent',
                                    color: isActive ? '#e11d48' : '#6b5a4e',
                                    borderBottom: isActive ? '2px solid #e11d48' : '2px solid transparent'
                                }}>
                                <Icon size={22} />
                                <span className='text-xs font-medium whitespace-nowrap'>{cat.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function MenuBtn({ label, onClick, danger }) {
    return (
        <button onClick={onClick}
            className='w-full px-4 py-2.5 text-left text-sm transition-colors duration-150'
            style={{ color: danger ? '#dc2626' : '#1a0a00', fontFamily: "'Georgia', serif" }}
            onMouseEnter={e => e.currentTarget.style.background = '#faf8f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {label}
        </button>
    )
}

export default Nav