import { CartItem, Product, StoreSettings } from '../types';

/**
 * Clean and format phone number for WhatsApp wa.me link
 * Handles Bangladesh numbers like 01308513845 -> 8801308513845
 */
export function formatWhatsAppNumber(phone: string): string {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  if (!clean) return '8801308513845';
  
  // If 11 digits starting with 01 (e.g. 01308513845)
  if (clean.length === 11 && clean.startsWith('01')) {
    clean = `88${clean}`;
  }
  // If 10 digits starting with 1 (e.g. 1308513845)
  else if (clean.length === 10 && clean.startsWith('1')) {
    clean = `880${clean}`;
  }
  return clean;
}

/**
 * Get direct phone call tel: link
 */
export function getTelUrl(phone: string): string {
  const digits = (phone || '').replace(/[^0-9+]/g, '');
  if (!digits) return 'tel:01308513845';
  return `tel:${digits}`;
}

/**
 * Format phone display cleanly (e.g. 01308513845 / +880 1308-513845)
 */
export function getDisplayPhone(phone: string): string {
  if (!phone) return '01308513845';
  return phone;
}

/**
 * Format a single product direct inquiry / buy message
 */
export function buildProductWhatsAppUrl(
  product: Product,
  settings: StoreSettings,
  quantity = 1,
  customerName = '',
  customerNotes = ''
): { url: string; message: string; cleanPhone: string } {
  const cleanPhone = formatWhatsAppNumber(settings.whatsappNumber);
  const total = (product.price * quantity).toFixed(2);

  let message = `*অর্ডার রিকোয়েস্ট / Order Request — ${settings.storeName}*\n`;
  message += `─────────────────────────\n`;
  message += `Hello! I would like to order this item:\n\n`;
  message += `📦 *Item:* ${product.name}\n`;
  message += `🏷️ *SKU:* ${product.sku}\n`;
  message += `📂 *Category:* ${product.category}\n`;
  message += `🔢 *Quantity:* ${quantity}\n`;
  message += `💵 *Unit Price:* ${settings.currencySymbol}${product.price.toFixed(2)}\n`;
  message += `💰 *Total Price:* ${settings.currencySymbol}${total}\n`;

  if (customerName) {
    message += `\n👤 *Customer Name:* ${customerName}`;
  }
  if (customerNotes) {
    message += `\n📝 *Notes / Address:* ${customerNotes}`;
  }

  message += `\n─────────────────────────\n`;
  message += `Please confirm my order and send payment & delivery details. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return { url, message, cleanPhone };
}

/**
 * Format a multi-item cart WhatsApp checkout order message
 */
export function buildCartWhatsAppUrl(
  items: CartItem[],
  settings: StoreSettings,
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  }
): { url: string; message: string; cleanPhone: string } {
  const cleanPhone = formatWhatsAppNumber(settings.whatsappNumber);
  
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const total = subtotal + shipping;

  let message = `*নতুন অর্ডার / New Order — ${settings.storeName}*\n`;
  message += `─────────────────────────\n`;
  message += `*Customer Details / ক্রেতার বিবরণ:*\n`;
  message += `• *Name:* ${customer.name || 'Not provided'}\n`;
  message += `• *Phone / Mobile:* ${customer.phone || 'Same as WhatsApp'}\n`;
  message += `• *Delivery Address:* ${customer.address || 'To be confirmed in chat'}\n`;
  
  if (customer.notes) {
    message += `• *Special Notes:* ${customer.notes}\n`;
  }

  message += `\n*Order Items / নির্বাচিত পণ্যসমূহ:*\n`;
  items.forEach((item, index) => {
    const itemTotal = (item.product.price * item.quantity).toFixed(2);
    message += `${index + 1}. *${item.product.name}* (x${item.quantity})\n`;
    message += `   SKU: ${item.product.sku} | ${settings.currencySymbol}${item.product.price.toFixed(2)} = ${settings.currencySymbol}${itemTotal}\n`;
  });

  message += `\n─────────────────────────\n`;
  message += `*Subtotal:* ${settings.currencySymbol}${subtotal.toFixed(2)}\n`;
  message += `*Delivery Charge:* ${shipping === 0 ? 'FREE' : `${settings.currencySymbol}${shipping.toFixed(2)}`}\n`;
  message += `*Total Payable:* ${settings.currencySymbol}${total.toFixed(2)}\n`;
  message += `─────────────────────────\n`;
  message += `Please confirm this order. Hotline / Call: ${settings.whatsappNumber}`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return { url, message, cleanPhone };
}

/**
 * Format a general support/concierge inquiry message
 */
export function buildGeneralWhatsAppUrl(
  settings: StoreSettings,
  topic = 'General Inquiry',
  userName = '',
  userMessage = ''
): { url: string; message: string; cleanPhone: string } {
  const cleanPhone = formatWhatsAppNumber(settings.whatsappNumber);
  
  let message = `*Customer Support Inquiry — ${settings.storeName}*\n\n`;
  message += `*Topic:* ${topic}\n`;
  if (userName) {
    message += `*Name:* ${userName}\n`;
  }
  if (userMessage) {
    message += `*Message:* ${userMessage}\n\n`;
  } else {
    message += `\nHello! I have an inquiry regarding products and delivery. Please assist me.\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return { url, message, cleanPhone };
}

