import React, { useContext, useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { toast } from 'react-toastify';

function SignUp() {
  let [show, setShow] = useState(false)
  let navigate = useNavigate()
  let { serverUrl, loading, setLoading } = useContext(authDataContext)
  let { setUserData } = useContext(userDataContext)
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        name, email, password
      }, { withCredentials: true })
      setLoading(false)
      setUserData(result.data)
      navigate("/")
      toast.success("Account created! Welcome to StayLoft")
    } catch (error) {
      setLoading(false)
      toast.error(error?.response?.data?.message || "Signup failed")
    }
  }

  const inputStyle = {
    background: '#fff',
    border: '2px solid #e8ddd4',
    color: '#1a0a00',
    fontFamily: "'Georgia', serif"
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif" }} className="min-h-screen w-full flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1a2e 0%, #1a3a5c 50%, #1f5a8b 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute"
              style={{
                width: `${(i + 1) * 100}px`, height: `${(i + 1) * 100}px`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                border: '1px solid rgba(147,197,253,0.4)',
                top: `${10 + i * 15}%`, left: `${5 + i * 8}%`,
              }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 rotate-12"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 -rotate-12">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '0.05em' }}>StayLoft</h1>
          <p className="text-blue-200 text-lg opacity-80 max-w-xs leading-relaxed">
            Join thousands of hosts and travelers across India
          </p>
          <div className="mt-10 space-y-3 w-full max-w-xs text-left">
            {[
              { icon: '🏡', text: 'List your property in minutes' },
              { icon: '🔒', text: 'Secure & verified bookings' },
              { icon: '💰', text: 'Earn from your space' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-blue-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: '#faf8f5' }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#0a1a2e' }}>StayLoft</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0a1a2e', letterSpacing: '-0.02em' }}>
              Create account
            </h2>
            <p style={{ color: '#6b7a8d' }} className="text-base">Start your journey with StayLoft today</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {[
              { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'John Doe' },
              { label: 'Email Address', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-semibold mb-2"
                  style={{ color: '#0a1a2e', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '11px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl outline-none text-base transition-all duration-200"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e8ddd4'}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-2"
                style={{ color: '#0a1a2e', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '11px' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 rounded-xl outline-none text-base transition-all duration-200"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e8ddd4'}
                />
                <button type="button" onClick={() => setShow(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#6b7a8d' }}>
                  {show ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 mt-2"
              style={{
                background: loading ? '#6b7a8d' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                letterSpacing: '0.03em',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(29,78,216,0.35)'
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span style={{ color: '#6b7a8d' }}>Already have an account? </span>
            <button onClick={() => navigate("/login")}
              className="font-semibold underline underline-offset-2"
              style={{ color: '#3b82f6' }}>
              Sign in
            </button>
          </div>

          <button onClick={() => navigate("/")}
            className="mt-6 flex items-center gap-2 text-sm mx-auto"
            style={{ color: '#6b7a8d' }}>
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

export default SignUp