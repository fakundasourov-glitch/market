import React, { useState } from 'react';
import { Product, StoreSettings } from '../types';
import { WhatsAppIcon } from './ProductCard';
import { X, Check, ShoppingBag, ShieldCheck, Truck, RefreshCw, PhoneCall } from 'lucide-react';
import { getTelUrl, getDisplayPhone } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onBuyWhatsApp: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose,
  onBuyWhatsApp,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const displayPhone = getDisplayPhone(settings.whatsappNumber);
  const telLink = getTelUrl(settings.whatsappNumber);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl border border-[#EEEEEE] max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Product Image */}
        <div className="md:w-1/2 bg-[#f3f4f5] relative min-h-[280px] md:min-h-full">
          <img
            src={product.image}
            alt={product.altText || product.name}
            className="w-full h-full object-cover absolute inset-0"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="md:hidden absolute top-3 right-3 p-1.5 rounded-full bg-white/80 text-[#191c1d] shadow-sm backdrop-blur-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header with Close */}
            <div className="hidden md:flex justify-between items-start mb-2">
              <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3c4a3d] uppercase">
                {product.category}
              </span>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1 rounded-md text-[#5f5e5e] hover:bg-[#edeeef] hover:text-[#191c1d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="md:hidden">
              <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3c4a3d] uppercase block mb-1">
                {product.category}
              </span>
            </div>

            <h2 className="text-[24px] md:text-[26px] font-bold text-[#191c1d] tracking-tight mb-2">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[22px] font-bold text-[#191c1d]">
                {settings.currencySymbol}{product.price.toFixed(2)}
              </span>
              <span className="text-xs text-[#6c7b6b]">SKU: {product.sku}</span>
            </div>

            <p className="text-sm text-[#3c4a3d] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Specifications list */}
            <div className="bg-[#f8f9fa] border border-[#EEEEEE] rounded-lg p-3.5 space-y-2 text-xs mb-6">
              {product.dimensions && (
                <div className="flex justify-between text-[#5f5e5e]">
                  <span className="font-medium text-[#191c1d]">Dimensions:</span>
                  <span>{product.dimensions}</span>
                </div>
              )}
              {product.materials && (
                <div className="flex justify-between text-[#5f5e5e]">
                  <span className="font-medium text-[#191c1d]">Materials:</span>
                  <span>{product.materials}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5f5e5e]">
                <span className="font-medium text-[#191c1d]">Availability:</span>
                <span className="text-[#006d2f] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock ({product.stockCount} units available)
                </span>
              </div>
            </div>

            {/* Micro perks */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5f5e5e] mb-6">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#006d2f]" />
                <span>Free shipping over {settings.currencySymbol}{settings.freeShippingThreshold}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#006d2f]" />
                <span>30-Day returns guaranteed</span>
              </div>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 border-t border-[#EEEEEE] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#191c1d]">Select Quantity</span>
              <div className="flex items-center border border-[#EEEEEE] bg-[#f8f9fa] rounded-lg px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-sm font-bold text-[#5f5e5e] hover:text-[#191c1d] px-2 py-0.5"
                >
                  -
                </button>
                <span className="text-xs font-semibold px-3 text-[#191c1d]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-sm font-bold text-[#5f5e5e] hover:text-[#191c1d] px-2 py-0.5"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id={`modal-buy-whatsapp-${product.id}`}
                onClick={() => {
                  onClose();
                  onBuyWhatsApp(product);
                }}
                className="flex-1 bg-[#25d366] hover:bg-[#1ebd5b] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Buy via WhatsApp</span>
              </button>

              <a
                href={telLink}
                id={`modal-call-btn-${product.id}`}
                className="flex-1 bg-[#191c1d] hover:bg-[#333333] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                title={`Call Hotline ${displayPhone}`}
              >
                <PhoneCall className="w-4 h-4 text-[#25d366]" />
                <span>Call ({displayPhone})</span>
              </a>

              <button
                onClick={handleAddToCart}
                className="sm:w-auto bg-[#f8f9fa] hover:bg-[#edeeef] text-[#191c1d] border border-[#EEEEEE] py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Add to Shopping Bag"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#006d2f]" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#006d2f]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
