import React, { useState, useMemo, useEffect } from 'react';
import { Product, StoreSettings, AuthUser } from '../types';
import { WhatsAppIcon } from './ProductCard';
import { X, Copy, Check, ExternalLink, ShieldCheck, MessageSquare, PhoneCall } from 'lucide-react';
import { buildProductWhatsAppUrl, getTelUrl, getDisplayPhone } from '../utils/whatsapp';

interface WhatsAppDirectModalProps {
  product: Product | null;
  settings: StoreSettings;
  currentUser?: AuthUser | null;
  onClose: () => void;
  onOrderSent: (product: Product, quantity: number, customerName: string, customerNotes: string) => void;
}

export const WhatsAppDirectModal: React.FC<WhatsAppDirectModalProps> = ({
  product,
  settings,
  currentUser,
  onClose,
  onOrderSent,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName && !customerName) {
      setCustomerName(currentUser.displayName);
    }
  }, [currentUser]);

  const { url, message, cleanPhone } = useMemo(() => {
    if (!product) return { url: '', message: '', cleanPhone: '' };
    return buildProductWhatsAppUrl(product, settings, quantity, customerName, customerNotes);
  }, [product, settings, quantity, customerName, customerNotes]);

  if (!product) return null;

  const total = (product.price * quantity).toFixed(2);
  const displayPhone = getDisplayPhone(settings.whatsappNumber);
  const telLink = getTelUrl(settings.whatsappNumber);

  const handleOpenWhatsApp = () => {
    // Open in WhatsApp (Message Asbe / Order message sent)
    window.open(url, '_blank', 'noopener,noreferrer');
    onOrderSent(product, quantity, customerName, customerNotes);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl border border-[#EEEEEE] max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EEEEEE] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-white shadow-xs">
              <WhatsAppIcon className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191c1d]">Instant WhatsApp & Call Order</h3>
              <p className="text-[11px] text-[#5f5e5e] flex items-center gap-1.5">
                <span>Hotline:</span>
                <a href={telLink} className="font-semibold text-[#006d2f] hover:underline">
                  {displayPhone}
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5f5e5e] hover:bg-[#e2dfde] hover:text-[#191c1d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Selected Product mini card */}
          <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#EEEEEE] p-3 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-md object-cover border border-[#EEEEEE] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-grow min-w-0">
              <span className="text-[10px] font-semibold text-[#006d2f] uppercase tracking-wider block">
                {product.category}
              </span>
              <h4 className="font-semibold text-sm text-[#191c1d] truncate">{product.name}</h4>
              <p className="text-xs text-[#5f5e5e]">
                {settings.currencySymbol}{product.price.toFixed(2)} each
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center border border-[#EEEEEE] bg-white rounded-lg px-2 py-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-xs font-bold text-[#5f5e5e] hover:text-[#191c1d] px-1.5 py-0.5"
              >
                -
              </button>
              <span className="text-xs font-semibold px-2">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-xs font-bold text-[#5f5e5e] hover:text-[#191c1d] px-1.5 py-0.5"
              >
                +
              </button>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5f5e5e] mb-1">
                Your Name / আপনার নাম (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sourov / Maya"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5f5e5e] mb-1">
                Delivery Address & Notes / ঠিকানা (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Formatted Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f5e5e] flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-[#006d2f]" />
                WhatsApp Message Preview (Message Asbe)
              </span>
              <button
                onClick={handleCopyMessage}
                className="text-[11px] text-[#006d2f] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#25d366]" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <pre className="bg-[#f3f4f5] border border-[#EEEEEE] p-3 rounded-lg text-[11px] leading-relaxed text-[#191c1d] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
              {message}
            </pre>
          </div>

          {/* Safety note */}
          <div className="flex items-center gap-2 text-[11px] text-[#5f5e5e] bg-[#f8f9fa] p-2.5 rounded-md border border-[#EEEEEE]">
            <ShieldCheck className="w-4 h-4 text-[#006d2f] shrink-0" />
            <span>Clicking WhatsApp opens pre-filled order. You can also call directly to confirm right away.</span>
          </div>
        </div>

        {/* Footer Actions: Send WhatsApp Message OR Direct Call */}
        <div className="px-6 py-4 border-t border-[#EEEEEE] bg-[#f8f9fa] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] text-[#5f5e5e] uppercase tracking-wider block">Estimated Total</span>
            <span className="text-base font-bold text-[#191c1d]">{settings.currencySymbol}{total}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <a
              href={telLink}
              id="direct-call-modal-btn"
              className="bg-[#191c1d] hover:bg-[#333333] text-white px-3.5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title={`Call Hotline: ${displayPhone}`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Call ({displayPhone})</span>
            </a>

            <button
              id="send-whatsapp-modal-btn"
              onClick={handleOpenWhatsApp}
              className="bg-[#25d366] hover:bg-[#1ebd5b] text-white px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Order via WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
