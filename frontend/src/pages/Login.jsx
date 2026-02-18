import React, { useContext, useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../Context/UserContext';
import { toast } from 'react-toastify';

function Login() {
    let [show, setShow] = useState(false)
    let { serverUrl, loading, setLoading } = useContext(authDataContext)
    let { setUserData } = useContext(userDataContext)
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(serverUrl + "/api/auth/login", {
                email, password
            }, { withCredentials: true })   // ✅ fixed: withCredentials inside config object
            setLoading(false)
            setUserData(result.data)
            navigate("/")
            toast.success("Welcome back!")
        } catch (error) {
            setLoading(false)
            toast.error(error?.response?.data?.message || "Login failed")
        }
    }

    return (
        <div style={{ fontFamily: "'Georgia', serif" }} className="min-h-screen w-full flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #6b3a1f 100%)' }}>
                <div className="absolute inset-0 opacity-20">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="absolute rounded-full border border-amber-400"
                            style={{
                                width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`,
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.3 - i * 0.04
                            }} />
                    ))}
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '0.05em' }}>StayLoft</h1>
                    <p className="text-amber-200 text-lg opacity-80 max-w-xs leading-relaxed">
                        Discover extraordinary stays in remarkable places
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
                        {['Villas', 'Cabins', 'Pool Houses', 'Farm Stays'].map(tag => (
                            <div key={tag} className="px-3 py-2 rounded-lg text-sm text-amber-100 text-center"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: '#faf8f5' }}>
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold" style={{ color: '#3d1a00' }}>StayLoft</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2" style={{ color: '#1a0a00', letterSpacing: '-0.02em' }}>
                            Welcome back
                        </h2>
                        <p style={{ color: '#9c7a5a' }} className="text-base">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3d1a00', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '11px' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl outline-none text-base transition-all duration-200"
                                style={{
                                    background: '#fff',
                                    border: '2px solid #e8ddd4',
                                    color: '#1a0a00',
                                    fontFamily: "'Georgia', serif"
                                }}
                                onFocus={e => e.target.style.borderColor = '#d97706'}
                                onBlur={e => e.target.style.borderColor = '#e8ddd4'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3d1a00', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '11px' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={show ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl outline-none text-base transition-all duration-200"
                                    style={{
                                        background: '#fff',
                                        border: '2px solid #e8ddd4',
                                        color: '#1a0a00',
                                        fontFamily: "'Georgia', serif"
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#d97706'}
                                    onBlur={e => e.target.style.borderColor = '#e8ddd4'}
                                />
                                <button type="button" onClick={() => setShow(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                    style={{ color: '#9c7a5a' }}>
                                    {show ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 mt-2"
                            style={{
                                background: loading ? '#9c7a5a' : 'linear-gradient(135deg, #d97706, #b45309)',
                                letterSpacing: '0.03em',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(180,83,9,0.35)'
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span style={{ color: '#9c7a5a' }}>Don't have an account? </span>
                        <button onClick={() => navigate("/signup")}
                            className="font-semibold underline underline-offset-2"
                            style={{ color: '#d97706' }}>
                            Create one
                        </button>
                    </div>

                    <button onClick={() => navigate("/")}
                        className="mt-6 flex items-center gap-2 text-sm mx-auto"
                        style={{ color: '#9c7a5a' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login