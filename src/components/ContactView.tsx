import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { WhatsAppIcon } from './ProductCard';
import { FAQ_LIST } from '../data/initialData';
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ExternalLink,
  Send,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { buildGeneralWhatsAppUrl, getTelUrl, getDisplayPhone } from '../utils/whatsapp';
import { saveInquiryToFirestore } from '../firebase';

interface ContactViewProps {
  settings: StoreSettings;
  onSelectCategory?: (category: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [userName, setUserName] = useState('');
  const [topic, setTopic] = useState('Product Question');
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { url } = buildGeneralWhatsAppUrl(settings, topic, userName, userMessage);
  const displayPhone = getDisplayPhone(settings.whatsappNumber);
  const telLink = getTelUrl(settings.whatsappNumber);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setIsSubmitting(true);
    try {
      // Save message/inquiry to Firebase Firestore
      await saveInquiryToFirestore({
        userName: userName || 'Customer',
        topic,
        message: userMessage,
        source: 'contact_form',
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.warn('Saved locally, forwarding to WhatsApp...', err);
    } finally {
      setIsSubmitting(false);
    }

    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <section className="text-center mb-12 max-w-2xl mx-auto">
        <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#006d2f] uppercase block mb-1">
          Concierge & Support Hotline
        </span>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#191c1d] tracking-tight mb-3">
          We’re Here for You on WhatsApp & Call
        </h1>
        <p className="text-[16px] text-[#3c4a3d]">
          Have questions regarding dimensions, product availability, or order status? Chat or call our team directly at <strong className="text-[#006d2f]">{displayPhone}</strong>.
        </p>
      </section>

      {/* Main Grid: Direct Chat Box + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Direct WhatsApp Concierge Hero Card */}
        <div className="lg:col-span-5 bg-white border border-[#EEEEEE] rounded-xl p-6 sm:p-8 product-card-shadow flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center text-white mb-6 shadow-xs">
              <WhatsAppIcon className="w-6 h-6 fill-white" />
            </div>

            <h2 className="text-xl font-bold text-[#191c1d] mb-2">
              Direct WhatsApp & Phone Hotline
            </h2>
            <p className="text-sm text-[#5f5e5e] mb-6 leading-relaxed">
              Connect directly with our studio team on WhatsApp or over phone call for instant assistance, orders, and personalized advice.
            </p>

            {/* Quick Details */}
            <div className="space-y-4 text-xs text-[#3c4a3d] border-t border-[#EEEEEE] pt-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-[#EEEEEE] flex items-center justify-center text-[#006d2f] shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#191c1d] block">Hotline Number (WhatsApp & Call)</span>
                  <a href={telLink} className="text-[#006d2f] font-mono font-bold hover:underline">
                    {displayPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-[#EEEEEE] flex items-center justify-center text-[#006d2f] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#191c1d] block">Studio & Hotline Hours</span>
                  <span className="text-[#5f5e5e]">{settings.businessHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-[#EEEEEE] flex items-center justify-center text-[#006d2f] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#191c1d] block">Email Inquiries</span>
                  <span className="text-[#5f5e5e]">{settings.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-[#EEEEEE] flex items-center justify-center text-[#006d2f] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#191c1d] block">Studio Location</span>
                  <span className="text-[#5f5e5e]">{settings.studioAddress}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25d366] hover:bg-[#1ebd5b] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={telLink}
              className="flex-1 bg-[#191c1d] hover:bg-[#333333] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Inquiry Builder */}
        <div className="lg:col-span-7 bg-white border border-[#EEEEEE] rounded-xl p-6 sm:p-8 product-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006d2f]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#006d2f]">
                Quick Message Builder
              </span>
            </div>
            <span className="text-[11px] bg-[#006d2f]/10 text-[#006d2f] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <Database className="w-3 h-3" />
              <span>Firebase Synced</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#191c1d] mb-1">Compose Your Inquiry</h2>
          <p className="text-xs text-[#5f5e5e] mb-6">
            Fill in your question and we'll save it to our database and open direct WhatsApp chat.
          </p>

          {savedSuccess && (
            <div className="mb-4 bg-[#25d366]/15 border border-[#25d366]/30 text-[#006d2f] px-3.5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-medium animate-in fade-in-50">
              <CheckCircle2 className="w-4 h-4 text-[#006d2f]" />
              <span>Message saved to Firebase Firestore & forwarded to WhatsApp!</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                Your Name / আপনার নাম
              </label>
              <input
                type="text"
                placeholder="e.g. Sourov / Julian"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-3 py-2 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                Subject Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-3 py-2 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden"
              >
                <option value="Product Question">Product Inquiry & Dimensions</option>
                <option value="Custom Order / Bulk Order">Custom Order / Bulk Order</option>
                <option value="Shipping & Delivery">Shipping & Delivery Status</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="General Question">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                Message or Question *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Type your question or request here..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-3 py-2 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#25d366] hover:bg-[#1ebd5b] text-white px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>{isSubmitting ? 'Saving to Database...' : 'Send via WhatsApp & Save'}</span>
              </button>

              <a
                href={telLink}
                className="bg-[#191c1d] hover:bg-[#333333] text-white px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" />
                <span>Call Hotline ({displayPhone})</span>
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#191c1d] text-center mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#EEEEEE] rounded-lg overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-sm text-[#191c1d] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5f5e5e] transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#006d2f]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-[#3c4a3d] leading-relaxed border-t border-[#EEEEEE] pt-3 bg-[#f8f9fa]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
