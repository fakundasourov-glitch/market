import React from 'react';
import { Product } from '../types';
import { Plus, Eye } from 'lucide-react';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12.031 0C5.385 0 0 5.386 0 12.032c0 2.128.552 4.195 1.6 6.007L.17 24l6.14-1.611c1.745.962 3.717 1.47 5.72 1.47 6.645 0 12.03-5.387 12.03-12.032C24.06 5.385 18.676 0 12.031 0zm0 21.84c-1.802 0-3.564-.485-5.111-1.4l-.366-.217-3.799.996.997-3.799-.217-.366c.915-1.547 1.4-3.309 1.4-5.11 0-5.525 4.492-10.018 10.017-10.018 5.524 0 10.016 4.493 10.016 10.018 0 5.525-4.492 10.017-10.016 10.017zm5.503-7.514c-.302-.151-1.785-.882-2.062-.983-.277-.101-.479-.151-.68.151-.202.302-.781.983-.958 1.184-.176.201-.353.226-.655.075-.302-.151-1.275-.47-2.428-1.5-.898-.802-1.504-1.792-1.68-2.094-.176-.302-.019-.465.132-.616.136-.136.302-.353.453-.53.151-.176.201-.302.302-.503.101-.202.05-.378-.025-.53-.075-.151-.68-1.642-.932-2.25-.246-.593-.496-.513-.68-.522-.176-.009-.378-.009-.579-.009-.201 0-.529.075-.806.377-.277.302-1.058 1.033-1.058 2.518s1.083 2.92 1.234 3.121c.151.201 2.128 3.25 5.155 4.557 2.164.935 3.033 1.018 4.148.857 1.258-.182 3.861-1.577 4.402-3.101.541-1.524.541-2.83.378-3.101-.163-.272-.566-.423-.868-.574z" />
  </svg>
);

interface ProductCardProps {
  product: Product;
  currencySymbol: string;
  onBuyWhatsApp: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol,
  onBuyWhatsApp,
  onSelectProduct,
  onAddToCart,
}) => {
  return (
    <article
      id={`product-card-${product.id}`}
      className="bg-white rounded-lg border border-[#EEEEEE] overflow-hidden product-card-shadow product-card-hover flex flex-col h-full group relative"
    >
      {/* Product Image Area */}
      <div 
        className="h-64 bg-[#f3f4f5] w-full relative overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.altText || product.name}
          className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Quick view / overlay badges */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="bg-white/95 text-[#191c1d] px-3.5 py-1.5 rounded-full text-xs font-medium shadow-md flex items-center gap-1.5 hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-200"
          >
            <Eye className="w-3.5 h-3.5 text-[#006d2f]" />
            <span>Details</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            title="Add to Cart Bag"
            className="bg-white/95 text-[#191c1d] p-1.5 rounded-full text-xs font-medium shadow-md hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-200"
          >
            <Plus className="w-4 h-4 text-[#006d2f]" />
          </button>
        </div>

        {/* Stock badge if low */}
        {!product.inStock ? (
          <span className="absolute top-3 left-3 bg-[#ba1a1a] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm">
            Sold Out
          </span>
        ) : product.stockCount <= 5 ? (
          <span className="absolute top-3 left-3 bg-[#e2dfde] text-[#191c1d] text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-sm">
            Only {product.stockCount} left
          </span>
        ) : null}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Label */}
        <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3c4a3d] uppercase mb-1">
          {product.category}
        </span>

        {/* Product Title */}
        <h2 
          onClick={() => onSelectProduct(product)}
          className="text-[20px] leading-[28px] font-semibold text-[#191c1d] mb-2 cursor-pointer hover:text-[#006d2f] transition-colors"
        >
          {product.name}
        </h2>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-[18px] leading-[24px] font-bold text-[#191c1d]">
            {currencySymbol}{product.price.toFixed(2)}
          </span>

          <button
            id={`buy-whatsapp-btn-${product.id}`}
            onClick={() => onBuyWhatsApp(product)}
            className="bg-[#25d366] text-white hover:bg-[#1ebd5b] active:bg-[#18a950] transition-colors px-4 py-2 rounded-full text-[12px] leading-[16px] tracking-[0.05em] font-semibold flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Buy via WhatsApp</span>
          </button>
        </div>
      </div>
    </article>
  );
};
