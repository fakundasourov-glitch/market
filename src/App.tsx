/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, ActiveTab, AuthUser } from './types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_ORDERS } from './data/initialData';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { AdminView } from './components/AdminView';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { WhatsAppDirectModal } from './components/WhatsAppDirectModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OwnerDetailsModal } from './components/OwnerDetailsModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CheckCircle2, Database } from 'lucide-react';
import {
  testFirestoreConnection,
  seedDefaultProductsIfEmpty,
  subscribeToProducts,
  saveOrderToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  mergeProductsWithDefaults,
  subscribeToAuth,
} from './firebase';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Persistence State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('minimalistshop_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeProductsWithDefaults(parsed);
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('minimalistshop_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.whatsappNumber || parsed.whatsappNumber === '+1234567890') {
          parsed.whatsappNumber = '01308513845';
        }
        return parsed;
      }
      return INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('minimalistshop_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('minimalistshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Drawer state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [selectedProductForWhatsApp, setSelectedProductForWhatsApp] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Initialize Firebase Firestore & subscribe to real-time updates
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsDbConnected(connected);
    });

    seedDefaultProductsIfEmpty();

    const unsubscribeProducts = subscribeToProducts((liveProducts) => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });

    const unsubscribeAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeAuth();
    };
  }, []);

  // Sync to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('minimalistshop_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('minimalistshop_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('minimalistshop_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('minimalistshop_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your bag.`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // WhatsApp direct order sent handler + Save to Firebase
  const handleDirectOrderSent = async (
    product: Product,
    quantity: number,
    customerName: string,
    customerNotes: string
  ) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `MS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'WhatsApp Customer',
      customerPhone: 'Via WhatsApp Direct',
      customerAddress: 'To be confirmed in chat',
      items: [{ product, quantity }],
      subtotal: product.price * quantity,
      shipping: 0,
      total: product.price * quantity,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent via WhatsApp',
      notes: customerNotes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedProductForWhatsApp(null);

    // Save to Firebase Firestore
    try {
      await saveOrderToFirestore(newOrder);
      showToast(`Order #${newOrder.orderNumber} saved to Firebase Firestore & WhatsApp!`);
    } catch (e) {
      showToast(`Order sent via WhatsApp!`);
    }
  };

  // Cart checkout order completed handler + Save to Firebase
  const handleCartCheckoutComplete = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes?: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
  }) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `MS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent via WhatsApp',
      notes: orderData.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firebase Firestore
    try {
      await saveOrderToFirestore(newOrder);
      showToast(`Order #${newOrder.orderNumber} saved to Firebase & WhatsApp!`);
    } catch (e) {
      showToast(`Order sent to WhatsApp!`);
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#191c1d] selection:bg-[#25d366]/20 selection:text-[#005523]">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        currentUser={currentUser}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Main View Area */}
      <main className="flex-grow">
        {activeTab === 'catalog' && (
          <CatalogView
            products={products}
            currencySymbol={settings.currencySymbol}
            onBuyWhatsApp={(prod) => setSelectedProductForWhatsApp(prod)}
            onSelectProduct={(prod) => setSelectedProductForDetails(prod)}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onOpenContact={() => setActiveTab('contact')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            products={products}
            settings={settings}
            onUpdateProducts={setProducts}
            onReturnToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView settings={settings} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenFaq={() => setActiveTab('contact')} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        settings={settings}
        currentUser={currentUser}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckoutComplete={handleCartCheckoutComplete}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currencySymbol={settings.currencySymbol}
        onSelectProduct={(prod) => setSelectedProductForDetails(prod)}
        onBuyWhatsApp={(prod) => setSelectedProductForWhatsApp(prod)}
      />

      {/* Direct WhatsApp Order Modal */}
      <WhatsAppDirectModal
        product={selectedProductForWhatsApp}
        settings={settings}
        currentUser={currentUser}
        onClose={() => setSelectedProductForWhatsApp(null)}
        onOrderSent={handleDirectOrderSent}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetails}
        settings={settings}
        onClose={() => setSelectedProductForDetails(null)}
        onBuyWhatsApp={(prod) => setSelectedProductForWhatsApp(prod)}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
      />

      {/* Owner Details Modal */}
      <OwnerDetailsModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Auth Modal (Login / Sign Up / Google Auth) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user, msg) => {
          setCurrentUser(user);
          showToast(msg);
        }}
      />

      {/* User Profile Modal (Account Details & Logout) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        user={currentUser}
        orders={orders}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Logged out successfully (সফলভাবে লগআউট হয়েছে)');
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191c1d] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#25d366] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
