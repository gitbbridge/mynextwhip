import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialTab,
    registerCustomer,
    loginCustomer,
    allUsers,
    switchUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalInitialTab || 'login');

  // Form states - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form states - Register
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('80202');
  const [city, setCity] = useState('Denver');
  const [role, setRole] = useState<'BUYER' | 'SELLER' | 'DEALER'>('BUYER');
  const [dealerName, setDealerName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [registerError, setRegisterError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or phone number.');
      return;
    }

    const success = loginCustomer(loginIdentifier.trim());
    if (success) {
      setIsAuthModalOpen(false);
    } else {
      setLoginError('No user found with that email or phone. Try signing up below or pick a demo profile.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setRegisterError('Please provide your full legal or display name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setRegisterError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setRegisterError('Please provide your phone number for meetup & SMS verification.');
      return;
    }
    if (!agreeTerms) {
      setRegisterError('You must agree to the Honest Over Pretty disclosure standards.');
      return;
    }

    registerCustomer({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim() || 'Denver',
      state: 'CO',
      role,
      isDealer: role === 'DEALER',
      dealerName: role === 'DEALER' ? dealerName.trim() : undefined,
    });

    setIsAuthModalOpen(false);
  };

  const handleQuickDemoSelect = (userId: string) => {
    switchUser(userId);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-orange-400">
              Verified Marketplace Access
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight font-heading">
            {activeTab === 'login' ? 'Welcome Back to MyNextWhip' : 'Create Your Customer Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {activeTab === 'login'
              ? 'Sign in to place bids, make offers, schedule inspections, and manage your whips.'
              : 'Join the Denver Front Range community for transparent, honest peer-to-peer car trades.'}
          </p>

          {/* Tab Selector */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl mt-5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegisterError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <X className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="mike@example.com or (303) 555-0123"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-[#C2410C] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Quick Switchers */}
              {allUsers.length > 0 && (
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Or Quick Sign In with Demo Account:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {allUsers.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickDemoSelect(u.id)}
                        className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-left flex items-center gap-2 cursor-pointer"
                      >
                        <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-800 truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {registerError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <X className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{registerError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal or Display Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Mitchell"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="jordan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (for meetup SMS)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="(303) 555-0145"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Denver Metro ZIP Code
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="80202"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Denver / Lakewood / Boulder"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('BUYER')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                      role === 'BUYER'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('SELLER')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                      role === 'SELLER'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Private Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DEALER')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                      role === 'DEALER'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Dealer
                  </button>
                </div>
              </div>

              {role === 'DEALER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Licensed Dealership Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Mile High Motors LLC"
                      value={dealerName}
                      onChange={(e) => setDealerName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Honest Pledge Checkbox */}
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I commit to MyNextWhip's <strong>"Honest Over Pretty"</strong> standards: disclosing all known mechanical defects, honoring scheduled meetups, and upholding peer-to-peer verification.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>Create Verified Account</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
