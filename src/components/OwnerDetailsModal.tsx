import React from 'react';
import { X, UserCheck, PhoneCall, Mail, Award, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './ProductCard';
import { getTelUrl, getDisplayPhone, formatWhatsAppNumber } from '../utils/whatsapp';

interface OwnerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export const OwnerDetailsModal: React.FC<OwnerDetailsModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
}) => {
  if (!isOpen) return null;

  const displayPhone = getDisplayPhone(whatsappNumber);
  const telLink = getTelUrl(whatsappNumber);
  const cleanWA = formatWhatsAppNumber(whatsappNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-2xl border border-[#EEEEEE] max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
        {/* Background accent badge */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#006d2f]/5 rounded-bl-full pointer-events-none" />

        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#5f5e5e] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Owner Profile Card */}
        <div className="flex items-center gap-4 mb-5 pt-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#006d2f] to-[#25d366] p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#006d2f] font-bold text-xl">
              MA
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-[#191c1d] tracking-tight">
                Meshraf Ahmed
              </h3>
              <span title="Verified Store Owner">
                <CheckCircle2 className="w-4 h-4 text-[#006d2f] fill-[#25d366]/20" />
              </span>
            </div>
            <span className="text-xs font-semibold text-[#006d2f] bg-[#006d2f]/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
              Store Founder & Owner
            </span>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#EEEEEE] mb-5 text-xs text-[#3c4a3d]">
          <div className="flex items-start gap-3">
            <UserCheck className="w-4 h-4 text-[#006d2f] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#191c1d] block">Owner Information</span>
              <span>Meshraf Ahmed (Founder of MinimalistShop)</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <PhoneCall className="w-4 h-4 text-[#25d366] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#191c1d] block">Direct Hotline & WhatsApp</span>
              <a href={telLink} className="font-mono text-[#006d2f] font-bold hover:underline">
                {displayPhone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="w-4 h-4 text-[#006d2f] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#191c1d] block">Store Commitment</span>
              <span className="text-[#5f5e5e]">
                Dedicated to providing premium curated minimalist home aesthetics and instant order support.
              </span>
            </div>
          </div>
        </div>

        {/* Direct Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <a
            href={`https://wa.me/${cleanWA}?text=${encodeURIComponent(
              'Hello Meshraf Ahmed! I am reaching out regarding MinimalistShop.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25d366] hover:bg-[#1ebd5b] text-white py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={telLink}
            className="flex-1 bg-[#191c1d] hover:bg-[#333333] text-white py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" />
            <span>Call Owner</span>
          </a>
        </div>
      </div>
    </div>
  );
};
