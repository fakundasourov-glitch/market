import React from 'react';
import { X, LogOut, User, Mail, Shield, ShoppingBag, CheckCircle2, Calendar } from 'lucide-react';
import { AuthUser, Order } from '../types';
import { logoutUser } from '../firebase';

interface UserProfileModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  orders: Order[];
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  orders,
  onClose,
  onLogout,
}) => {
  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const userInitial = (user.displayName || user.email || 'U')[0].toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-2xl border border-[#EEEEEE] max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006d2f] bg-[#006d2f]/10 px-2.5 py-0.5 rounded-full">
              Customer Account
            </span>
          </div>
          <button
            id="user-profile-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f5e5e] hover:bg-[#edeeef] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="flex items-center gap-4 bg-[#f8f9fa] border border-[#EEEEEE] p-4 rounded-xl mb-5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Avatar'}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#006d2f]/30"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#006d2f] text-white flex items-center justify-center text-xl font-bold shrink-0">
              {userInitial}
            </div>
          )}

          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-[#191c1d] truncate">
              {user.displayName || 'MinimalistShop Customer'}
            </h3>
            <p className="text-xs text-[#5f5e5e] truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 shrink-0 text-[#006d2f]" />
              <span>{user.email || 'No email associated'}</span>
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#006d2f] font-semibold mt-1 bg-[#25d366]/15 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Session</span>
            </span>
          </div>
        </div>

        {/* Account Details & Order Summary */}
        <div className="space-y-3 mb-6 text-xs text-[#3c4a3d]">
          <div className="bg-white border border-[#EEEEEE] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f3f4f5] flex items-center justify-center text-[#5f5e5e]">
                <ShoppingBag className="w-4 h-4 text-[#006d2f]" />
              </div>
              <div>
                <span className="font-bold text-[#191c1d] block">My Orders</span>
                <span className="text-[11px] text-[#5f5e5e]">Active WhatsApp & Store Orders</span>
              </div>
            </div>
            <span className="font-bold text-sm text-[#006d2f]">{orders.length}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#EEEEEE]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#f3f4f5] hover:bg-[#edeeef] text-[#191c1d] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Back to Shop
          </button>
          <button
            id="user-profile-logout-btn"
            type="button"
            onClick={handleLogout}
            className="flex-1 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout (লগআউট)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
