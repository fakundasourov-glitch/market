import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, Shield, MessageCircle, PhoneCall, UserCheck, User, LogIn, LogOut } from 'lucide-react';
import { ActiveTab, AuthUser } from '../types';
import { getTelUrl, getDisplayPhone, formatWhatsAppNumber } from '../utils/whatsapp';
import { WhatsAppIcon } from './ProductCard';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenOwnerModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  currentUser: AuthUser | null;
  whatsappNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenOwnerModal,
  onOpenAuthModal,
  onOpenProfileModal,
  currentUser,
  whatsappNumber,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayPhone = getDisplayPhone(whatsappNumber);
  const telLink = getTelUrl(whatsappNumber);
  const cleanWA = formatWhatsAppNumber(whatsappNumber);

  const userInitial = currentUser
    ? (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()
    : null;

  return (
    <header className="bg-[#f8f9fa] font-['Inter',sans-serif] text-base sticky top-0 h-[72px] border-b border-[#e1e3e4] z-40 transition-colors">
      <div className="flex justify-between items-center px-4 md:px-6 w-full max-w-[1200px] mx-auto h-full">
        {/* Brand Logo & Hotline */}
        <div className="flex items-center gap-4">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('catalog')}
            className="text-[19px] md:text-[20px] leading-[28px] font-bold text-[#006d2f] tracking-tight hover:opacity-90 transition-opacity text-left flex items-center gap-2 cursor-pointer"
          >
            <span>MinimalistShop</span>
          </button>

          {/* Quick Hotline Pill */}
          <div className="hidden lg:flex items-center bg-white border border-[#EEEEEE] rounded-full pl-3 pr-1.5 py-1 text-xs shadow-xs gap-2">
            <span className="text-[#5f5e5e] text-[11px] font-medium">Hotline:</span>
            <a
              href={telLink}
              id="header-hotline-call-btn"
              className="font-bold text-[#191c1d] hover:text-[#006d2f] transition-colors flex items-center gap-1"
              title={`Call Store Hotline ${displayPhone}`}
            >
              <PhoneCall className="w-3 h-3 text-[#25d366]" />
              <span>{displayPhone}</span>
            </a>
            <a
              href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello MinimalistShop! I would like assistance with an order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] hover:bg-[#1ebd5b] text-white p-1 rounded-full text-[10px] flex items-center justify-center transition-colors"
              title="WhatsApp Chat"
            >
              <WhatsAppIcon className="w-3 h-3 fill-white" />
            </a>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-7 items-center text-sm font-medium">
          <button
            id="nav-catalog-btn"
            onClick={() => setActiveTab('catalog')}
            className={`pb-1 cursor-pointer transition-all ${
              activeTab === 'catalog'
                ? 'text-[#006d2f] font-bold border-b-2 border-[#006d2f]'
                : 'text-[#3c4a3d] hover:text-[#006d2f]'
            }`}
          >
            Catalog
          </button>
          <button
            id="nav-admin-btn"
            onClick={() => setActiveTab('admin')}
            className={`pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'text-[#006d2f] font-bold border-b-2 border-[#006d2f]'
                : 'text-[#3c4a3d] hover:text-[#006d2f]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 opacity-70" />
            <span>Admin</span>
          </button>
          <button
            id="nav-contact-btn"
            onClick={() => setActiveTab('contact')}
            className={`pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'text-[#006d2f] font-bold border-b-2 border-[#006d2f]'
                : 'text-[#3c4a3d] hover:text-[#006d2f]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 opacity-70" />
            <span>Contact</span>
          </button>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-2.5 text-[#006d2f]">
          {/* User Auth Login / Profile Trigger */}
          {currentUser ? (
            <button
              id="header-user-profile-btn"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 bg-white border border-[#25d366]/40 hover:border-[#006d2f] bg-linear-to-r from-white to-[#25d366]/10 text-[#191c1d] px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
              title={`Logged in as ${currentUser.displayName || currentUser.email}`}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Avatar'}
                  className="w-5 h-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#006d2f] text-white flex items-center justify-center text-[10px] font-bold">
                  {userInitial}
                </div>
              )}
              <span className="hidden sm:inline text-[11px] font-bold text-[#191c1d] max-w-[90px] truncate">
                {currentUser.displayName || 'Account'}
              </span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-[#006d2f] hover:bg-[#005523] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              title="Sign In / Register Account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="text-[11px]">Login</span>
            </button>
          )}

          {/* Owner Profile Icon Button */}
          <button
            id="header-owner-profile-btn"
            onClick={onOpenOwnerModal}
            className="flex items-center gap-1.5 bg-white border border-[#EEEEEE] hover:border-[#006d2f]/40 hover:bg-[#edeeef] text-[#191c1d] px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="View Owner Details (Meshraf Ahmed)"
          >
            <div className="w-5 h-5 rounded-full bg-[#006d2f] text-white flex items-center justify-center text-[10px] font-bold">
              M
            </div>
            <span className="hidden sm:inline text-[11px] font-bold text-[#006d2f]">Owner</span>
          </button>

          {/* Quick Call icon for Mobile */}
          <a
            href={telLink}
            id="header-mobile-call-btn"
            className="md:hidden p-2 rounded-full hover:bg-[#edeeef] text-[#006d2f] transition-colors cursor-pointer"
            title={`Call Hotline: ${displayPhone}`}
          >
            <PhoneCall className="w-5 h-5 text-[#25d366] stroke-[2]" />
          </a>

          {/* Search Trigger */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            title="Search products"
            aria-label="Search catalog"
            className="p-2 rounded-full hover:bg-[#edeeef] text-[#006d2f] transition-colors cursor-pointer active:scale-95"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Cart Trigger */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            title="Shopping Cart"
            aria-label="View shopping bag"
            className="p-2 rounded-full hover:bg-[#edeeef] text-[#006d2f] transition-colors cursor-pointer relative active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#25d366] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            id="header-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-full hover:bg-[#edeeef] text-[#006d2f] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e1e3e4] px-6 py-4 shadow-lg animate-in slide-in-from-top-2 space-y-4">
          <div className="flex flex-col gap-3 font-medium text-sm">
            {/* User Auth in Mobile Menu */}
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfileModal();
                }}
                className="text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between bg-[#25d366]/10 border border-[#25d366]/30 text-[#006d2f] font-bold"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>My Account ({currentUser.displayName || currentUser.email})</span>
                </div>
                <span className="text-xs text-[#006d2f] underline">View</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between bg-[#006d2f] text-white font-bold"
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register (লগইন)</span>
                </div>
                <span className="text-xs">→</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('catalog');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-md transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-[#25d366]/10 text-[#006d2f] font-bold'
                  : 'text-[#3c4a3d] hover:bg-[#f8f9fa]'
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-md transition-colors flex items-center justify-between ${
                activeTab === 'admin'
                  ? 'bg-[#25d366]/10 text-[#006d2f] font-bold'
                  : 'text-[#3c4a3d] hover:bg-[#f8f9fa]'
              }`}
            >
              <span>Admin (Add/Remove Products)</span>
              <Shield className="w-4 h-4 opacity-70" />
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-md transition-colors flex items-center justify-between ${
                activeTab === 'contact'
                  ? 'bg-[#25d366]/10 text-[#006d2f] font-bold'
                  : 'text-[#3c4a3d] hover:bg-[#f8f9fa]'
              }`}
            >
              <span>Contact & WhatsApp Concierge</span>
              <MessageCircle className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOwnerModal();
              }}
              className="text-left py-2 px-3 rounded-md transition-colors flex items-center justify-between bg-[#f8f9fa] border border-[#EEEEEE] text-[#006d2f] font-semibold"
            >
              <span>Owner: Meshraf Ahmed</span>
              <UserCheck className="w-4 h-4 text-[#006d2f]" />
            </button>
          </div>

          <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-between">
            <span className="text-xs text-[#5f5e5e]">Hotline / Call:</span>
            <a
              href={telLink}
              className="text-xs font-bold text-[#006d2f] flex items-center gap-1.5 bg-[#f8f9fa] border border-[#EEEEEE] px-3 py-1.5 rounded-full"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" />
              <span>{displayPhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
