import React, { useState, useEffect } from 'react';
import { CartItem, StoreSettings, AuthUser } from '../types';
import { WhatsAppIcon } from './ProductCard';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, ExternalLink, PhoneCall } from 'lucide-react';
import { buildCartWhatsAppUrl, getTelUrl, getDisplayPhone } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  currentUser?: AuthUser | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutComplete: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes?: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutComplete,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName && !customerName) {
      setCustomerName(currentUser.displayName);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : settings.shippingFee;
  const grandTotal = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / settings.freeShippingThreshold) * 100);

  const handleCheckoutWhatsApp = () => {
    const { url } = buildCartWhatsAppUrl(items, settings, {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      notes: deliveryNotes,
    });

    // Record order in system
    onCheckoutComplete({
      customerName: customerName || 'Guest WhatsApp User',
      customerPhone: customerPhone || 'Via WhatsApp Chat',
      customerAddress: customerAddress || 'To be specified in chat',
      notes: deliveryNotes,
      items: [...items],
      subtotal,
      shipping,
      total: grandTotal,
    });

    // Launch WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EEEEEE] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#EEEEEE] flex items-center justify-between bg-[#f8f9fa]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#006d2f]" />
              <h2 className="text-base font-bold text-[#191c1d]">Shopping Bag</h2>
              <span className="text-xs text-[#5f5e5e] font-medium bg-[#edeeef] px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-md text-[#5f5e5e] hover:bg-[#e2dfde] hover:text-[#191c1d] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Free shipping banner */}
            {items.length > 0 && (
              <div className="bg-[#f8f9fa] border border-[#EEEEEE] p-3.5 rounded-lg text-xs">
                {isFreeShipping ? (
                  <p className="text-[#006d2f] font-semibold flex items-center gap-1.5">
                    <span>✨ You qualify for Free Domestic Shipping!</span>
                  </p>
                ) : (
                  <div>
                    <p className="text-[#3c4a3d] mb-1.5">
                      Add <strong className="text-[#191c1d]">{settings.currencySymbol}{amountToFreeShipping.toFixed(2)}</strong> more for Free Shipping
                    </p>
                    <div className="w-full bg-[#e2dfde] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#25d366] h-full rounded-full transition-all duration-300"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-[#f8f9fa] border border-[#EEEEEE] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5f5e5e]">
                  <ShoppingBag className="w-6 h-6 opacity-60" />
                </div>
                <h3 className="text-base font-semibold text-[#191c1d] mb-1">Your bag is empty</h3>
                <p className="text-xs text-[#5f5e5e] max-w-xs mx-auto mb-6">
                  Explore our curated essentials and add items to order together in a single WhatsApp chat.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#191c1d] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#333333] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 bg-[#f8f9fa] border border-[#EEEEEE] rounded-lg items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border border-[#EEEEEE] shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-semibold text-[#3c4a3d] block truncate">
                        {product.category}
                      </span>
                      <h4 className="text-xs font-semibold text-[#191c1d] truncate mb-1">
                        {product.name}
                      </h4>
                      <div className="text-xs font-bold text-[#191c1d]">
                        {settings.currencySymbol}{product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-[#EEEEEE] bg-white rounded-md px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                          className="text-xs font-bold text-[#5f5e5e] hover:text-[#191c1d] px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold px-1.5">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="text-xs font-bold text-[#5f5e5e] hover:text-[#191c1d] px-1"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-[#6c7b6b] hover:text-[#ba1a1a] p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Delivery details accordion toggle */}
                <div className="border border-[#EEEEEE] rounded-lg p-3.5 bg-white">
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#191c1d]"
                  >
                    <span>Delivery Info (Optional pre-fill)</span>
                    <span className="text-[#006d2f] text-[11px]">
                      {showAddressForm ? 'Hide' : 'Add Details'}
                    </span>
                  </button>

                  {showAddressForm && (
                    <div className="mt-3 space-y-2.5 pt-2.5 border-t border-[#EEEEEE]">
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-2.5 py-1.5 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number (for courier)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-2.5 py-1.5 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden"
                      />
                      <textarea
                        rows={2}
                        placeholder="Delivery Street Address, City, Postal Code"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-2.5 py-1.5 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden resize-none"
                      />
                      <input
                        type="text"
                        placeholder="Gate code, landmark, or specific instructions"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded px-2.5 py-1.5 text-xs text-[#191c1d] focus:border-[#25d366] focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer with checkout summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#EEEEEE] bg-[#f8f9fa] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5f5e5e]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#191c1d]">
                    {settings.currencySymbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#191c1d]">
                    {shipping === 0 ? 'FREE' : `${settings.currencySymbol}${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#191c1d] pt-2 border-t border-[#EEEEEE]">
                  <span>Grand Total</span>
                  <span className="text-base text-[#006d2f]">
                    {settings.currencySymbol}{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Order + Direct Call */}
              <div className="space-y-2">
                <button
                  id="cart-checkout-whatsapp-btn"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-[#25d366] hover:bg-[#1ebd5b] text-white py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Order via WhatsApp ({settings.currencySymbol}{grandTotal.toFixed(2)})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                <a
                  href={getTelUrl(settings.whatsappNumber)}
                  id="cart-direct-call-btn"
                  className="w-full bg-[#191c1d] hover:bg-[#333333] text-white py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  title={`Call Store Hotline: ${getDisplayPhone(settings.whatsappNumber)}`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#25d366]" />
                  <span>Call to Order ({getDisplayPhone(settings.whatsappNumber)})</span>
                </a>
              </div>

              <p className="text-[11px] text-center text-[#5f5e5e]">
                Instant connection to hotline & WhatsApp concierge • Fast checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
