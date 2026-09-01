import React, { useState } from 'react';
import { Product, StoreSettings } from '../types';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Search,
  RotateCcw,
  Sparkles,
  DollarSign,
  Layers,
  Database,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { saveProductToFirestore, deleteProductFromFirestore } from '../firebase';

interface AdminViewProps {
  products: Product[];
  settings: StoreSettings;
  onUpdateProducts: (products: Product[]) => void;
  onReturnToCatalog: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  settings,
  onUpdateProducts,
  onReturnToCatalog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New product form initial template
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Home Decor',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    altText: 'Minimalist product',
    description: 'Carefully curated quality product.',
    dimensions: '',
    materials: '',
    inStock: true,
    stockCount: 15,
    sku: `MS-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Add Product to Firestore & Local State
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price === undefined) return;

    setIsSaving(true);
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name.trim(),
      category: newProduct.category || 'Home Decor',
      price: Number(newProduct.price),
      image:
        newProduct.image?.trim() ||
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      altText: newProduct.altText || newProduct.name,
      description: newProduct.description?.trim() || 'Quality curated item.',
      dimensions: newProduct.dimensions || '',
      materials: newProduct.materials || '',
      inStock: newProduct.inStock ?? true,
      stockCount: Number(newProduct.stockCount || 10),
      sku: newProduct.sku?.trim() || `MS-${Date.now().toString().slice(-4)}`,
    };

    try {
      await saveProductToFirestore(created);
      onUpdateProducts([created, ...products.filter((p) => p.id !== created.id)]);
      showNotification(`Saved "${created.name}" to Firebase Firestore!`);
    } catch (err) {
      onUpdateProducts([created, ...products]);
      showNotification(`Added "${created.name}" (local & queued)`);
    } finally {
      setIsSaving(false);
      setIsAddProductOpen(false);
    }

    // Reset form
    setNewProduct({
      name: '',
      category: 'Home Decor',
      price: 25.0,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
      altText: '',
      description: '',
      dimensions: '',
      materials: '',
      inStock: true,
      stockCount: 15,
      sku: `MS-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  // Remove Product from Firestore & State
  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to remove "${product.name}" from the store and Firebase?`)) {
      try {
        await deleteProductFromFirestore(product.id);
        onUpdateProducts(products.filter((p) => p.id !== product.id));
        showNotification(`Deleted "${product.name}" from Firebase Firestore.`);
      } catch (err) {
        onUpdateProducts(products.filter((p) => p.id !== product.id));
        showNotification(`Removed "${product.name}".`);
      }
    }
  };

  // Save Edits to Firestore
  const handleSaveProduct = async (prod: Product) => {
    try {
      await saveProductToFirestore(prod);
      onUpdateProducts(products.map((p) => (p.id === prod.id ? prod : p)));
      setEditingProduct(null);
      showNotification(`Updated "${prod.name}" in Firebase Firestore.`);
    } catch (err) {
      onUpdateProducts(products.map((p) => (p.id === prod.id ? prod : p)));
      setEditingProduct(null);
      showNotification(`Updated "${prod.name}".`);
    }
  };

  // Toggle in stock
  const handleToggleStock = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, inStock: !target.inStock };
    try {
      await saveProductToFirestore(updated);
      onUpdateProducts(products.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      onUpdateProducts(products.map((p) => (p.id === id ? updated : p)));
    }
  };

  // Reset to default sample items
  const handleResetCatalog = async () => {
    if (window.confirm('Reset catalog back to initial default items in Firebase?')) {
      for (const p of INITIAL_PRODUCTS) {
        try {
          await saveProductToFirestore(p);
        } catch (e) {}
      }
      onUpdateProducts(INITIAL_PRODUCTS);
      showNotification('Catalog synced with initial sample items.');
    }
  };

  // Filter products
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#EEEEEE] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#006d2f] block">
              Admin Control Panel
            </span>
            <span className="bg-[#006d2f]/10 text-[#006d2f] text-[10px] font-bold px-2 py-0.5 rounded-full">
              Owner: Meshraf Ahmed
            </span>
            <span className="bg-[#25d366]/15 text-[#006d2f] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>Firebase Connected (my-website-a696f)</span>
            </span>
          </div>
          <h1 className="text-[22px] md:text-[26px] font-bold text-[#191c1d] tracking-tight mt-0.5">
            Product Management
          </h1>
          <p className="text-xs text-[#5f5e5e] mt-1">
            Add new products or remove existing items from your store catalog. All updates sync in real-time to Firebase Firestore.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onReturnToCatalog}
            className="text-xs font-semibold text-[#3c4a3d] hover:text-[#006d2f] bg-white border border-[#EEEEEE] px-3.5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            ← Live Shop
          </button>

          <button
            id="admin-add-product-btn"
            onClick={() => setIsAddProductOpen(true)}
            className="bg-[#006d2f] hover:bg-[#005523] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Quick overview metric */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        <div className="bg-white border border-[#EEEEEE] p-4 rounded-lg flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#5f5e5e] font-semibold uppercase tracking-wider block">
              Total Products
            </span>
            <span className="text-2xl font-bold text-[#191c1d]">{products.length}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#006d2f]/10 flex items-center justify-center text-[#006d2f]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#EEEEEE] p-4 rounded-lg flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#5f5e5e] font-semibold uppercase tracking-wider block">
              In Stock Items
            </span>
            <span className="text-2xl font-bold text-[#006d2f]">
              {products.filter((p) => p.inStock).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#25d366]/15 flex items-center justify-center text-[#006d2f]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#EEEEEE] p-4 rounded-lg flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#5f5e5e] font-semibold uppercase tracking-wider block">
              Categories
            </span>
            <span className="text-2xl font-bold text-[#191c1d]">
              {new Set(products.map((p) => p.category)).size}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f3f4f5] flex items-center justify-center text-[#5f5e5e]">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#EEEEEE] rounded-lg p-3.5 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5f5e5e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f8f9fa] border border-[#EEEEEE] rounded-md text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-[#5f5e5e] shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#006d2f] text-white'
                  : 'bg-[#f8f9fa] text-[#5f5e5e] hover:text-[#191c1d] hover:bg-[#edeeef] border border-[#EEEEEE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table (Add / Remove) */}
      <div className="bg-white border border-[#EEEEEE] rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 bg-[#f8f9fa] border-b border-[#EEEEEE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#006d2f]" />
            <span className="text-xs font-bold text-[#191c1d] uppercase tracking-wider">
              Store Products ({filteredProducts.length})
            </span>
          </div>

          <button
            onClick={handleResetCatalog}
            className="text-[11px] font-semibold text-[#5f5e5e] hover:text-[#006d2f] flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset to initial products in Firebase"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Products</span>
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#5f5e5e]">
            <Package className="w-8 h-8 text-[#9da59d] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[#191c1d]">No products found</p>
            <p className="text-xs text-[#5f5e5e] mt-1 mb-4">
              {searchQuery
                ? 'Try adjusting your search query or filter.'
                : 'Your catalog is empty. Click below to add your first product to Firebase.'}
            </p>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="bg-[#006d2f] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-[#5f5e5e] uppercase tracking-wider font-semibold border-b border-[#EEEEEE]">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Action (Remove / Edit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f8f9fa]/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md border border-[#EEEEEE] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-[#191c1d] block text-sm">{p.name}</span>
                          <span className="text-[11px] text-[#6c7b6b] line-clamp-1 max-w-sm">
                            {p.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#3c4a3d] font-medium">{p.category}</td>
                    <td className="py-3.5 px-4 text-[#6c7b6b] font-mono">{p.sku}</td>
                    <td className="py-3.5 px-4 font-bold text-[#191c1d] text-sm">
                      {settings.currencySymbol}
                      {p.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStock(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                          p.inStock
                            ? 'bg-[#25d366]/15 text-[#006d2f] hover:bg-[#25d366]/25'
                            : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffc6c2]'
                        }`}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-2 text-[#5f5e5e] hover:text-[#006d2f] hover:bg-[#edeeef] rounded-md transition-colors cursor-pointer"
                          title="Edit product info"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`admin-delete-prod-${p.id}`}
                          onClick={() => handleDeleteProduct(p)}
                          className="p-2 text-[#ba1a1a] hover:text-white hover:bg-[#ba1a1a] rounded-md transition-colors cursor-pointer"
                          title="Remove product from store & Firebase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191c1d] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-medium animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#25d366]" />
          <span>{notification}</span>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-xl border border-[#EEEEEE] max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#006d2f]/10 flex items-center justify-center text-[#006d2f]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#191c1d]">Add New Product</h3>
                  <p className="text-[11px] text-[#5f5e5e]">Fill in details to save to Firebase Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-[#5f5e5e] hover:bg-[#edeeef]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist Ceramic Cup"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  >
                    <option value="Home Decor">Home Decor</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Kitchen & Dining">Kitchen & Dining</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    Price ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="25.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                  Product Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="flex-1 bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 font-mono text-[11px] text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                    required
                  />
                  {newProduct.image && (
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="w-9 h-9 object-cover rounded border border-[#EEEEEE] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stockCount}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 font-mono text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe dimensions, craft materials, and design aesthetic..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EEEEEE]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f5e5e] hover:bg-[#edeeef] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#006d2f] hover:bg-[#005523] text-white px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSaving ? 'Saving to Firebase...' : 'Publish to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-xl border border-[#EEEEEE] max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] mb-4">
              <h3 className="text-base font-bold text-[#191c1d]">Edit Product Details</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-[#5f5e5e] hover:bg-[#edeeef]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(editingProduct);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    Price ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="flex-1 bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 font-mono text-[11px] text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                    required
                  />
                  {editingProduct.image && (
                    <img
                      src={editingProduct.image}
                      alt="Preview"
                      className="w-9 h-9 object-cover rounded border border-[#EEEEEE] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stockCount}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockCount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 font-mono text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#5f5e5e] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#EEEEEE] rounded-md px-3 py-2 text-xs text-[#191c1d] focus:border-[#006d2f] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EEEEEE]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f5e5e] hover:bg-[#edeeef] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#191c1d] hover:bg-[#333333] text-white px-5 py-2 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
