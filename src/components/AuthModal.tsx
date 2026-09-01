import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { AuthUser } from '../types';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      onSuccess(user, `Welcome back, ${user.displayName || 'Customer'}!`);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in popup closed. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by browser. Please allow popups for this site.');
      } else {
        setErrorMsg(err?.message || 'Google sign-in failed. Please try email login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signin') {
        const user = await loginWithEmail(email, password);
        onSuccess(user, `Logged in successfully as ${user.displayName || user.email}!`);
      } else {
        const user = await registerWithEmail(email, password, name);
        onSuccess(user, `Account created successfully! Welcome, ${user.displayName}!`);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setErrorMsg('Incorrect email or password. Please verify and try again.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Try logging in.');
      } else if (err?.code === 'auth/invalid-email') {
        setErrorMsg('Please provide a valid email address.');
      } else {
        setErrorMsg(err?.message || 'Authentication error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick guest / demo login for easy testing
  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const demoEmail = 'customer.demo@minimalistshop.com';
      const demoPass = 'demo123456';
      try {
        const user = await loginWithEmail(demoEmail, demoPass);
        onSuccess(user, 'Logged in as Demo Customer!');
      } catch {
        const user = await registerWithEmail(demoEmail, demoPass, 'Demo Customer');
        onSuccess(user, 'Logged in as Demo Customer!');
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not launch demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-2xl border border-[#EEEEEE] max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#006d2f]/10 flex items-center justify-center text-[#006d2f]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191c1d]">
                {mode === 'signin' ? 'Sign In to MinimalistShop' : 'Create Customer Account'}
              </h3>
              <p className="text-[11px] text-[#5f5e5e]">
                {mode === 'signin'
                  ? 'Access your orders, favorites & fast WhatsApp checkout'
                  : 'Join us for streamlined shopping & order tracking'}
              </p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f5e5e] hover:bg-[#edeeef] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex bg-[#f3f4f5] p-1 rounded-xl mb-5">
          <button
            id="auth-tab-signin"
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#5f5e5e] hover:text-[#191c1d]'
            }`}
          >
            Sign In (লগইন)
          </button>
          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#5f5e5e] hover:text-[#191c1d]'
            }`}
          >
            Register (নতুন অ্যাকাউন্ট)
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] p-3 rounded-lg flex items-start gap-2 text-xs animate-in shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Google One-Click Login */}
        <button
          id="auth-google-login-btn"
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-[#f8f9fa] text-[#191c1d] border border-[#d1d5db] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#EEEEEE] w-full"></div>
          <span className="bg-white px-3 text-[11px] text-[#5f5e5e] uppercase tracking-wider font-semibold absolute">
            Or with Email
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                Full Name / আপনার নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Sourov Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fa] border border-[#EEEEEE] rounded-lg text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fa] border border-[#EEEEEE] rounded-lg text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fa] border border-[#EEEEEE] rounded-lg text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#006d2f] hover:bg-[#005523] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
          >
            {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Quick Demo Login Helper */}
        <div className="mt-4 pt-4 border-t border-[#EEEEEE] flex items-center justify-between">
          <span className="text-[11px] text-[#5f5e5e]">Testing quickly?</span>
          <button
            id="auth-demo-customer-btn"
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="text-[11px] font-bold text-[#006d2f] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#25d366]" />
            <span>1-Click Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
