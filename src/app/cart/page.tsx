'use client';

import type { NextPage } from 'next';
import { ShoppingCart, X, ArrowLeft, ChevronDown, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { fetchProducts, NfcProduct } from '@/lib/cartApi';

// Cart Item Interface
interface CartItemProps {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

// Product Card Props Interface
interface ProductCardProps {
  product: NfcProduct;
  onAddToCart: () => void;
}

// Recommended Products Props Interface
interface RecommendedProductsProps {
  products: NfcProduct[];
  onAddToCart: (product: NfcProduct) => void;
}

// Cart Item Component
const CartItem: React.FC<CartItemProps> = ({ productId, name, description, price, imageUrl, quantity, onQuantityChange, onRemove }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#1A2C47] p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 gap-4">
    <div className="flex items-center gap-4 sm:gap-6">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-700 rounded-md flex-shrink-0">
        <img src={imageUrl || 'https://placehold.co/80x80/1E293B/FFFFFF?text=NFC'} alt={name} className="w-full h-full object-contain rounded-md" />
      </div>
      
      {/* Product Details */}
      <div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="relative">
            <select 
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="bg-[#10233D] border border-gray-600 rounded-md py-2 pl-3 pr-8 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[60px] text-center"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* Delete Button */}
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    {/* Pricing */}
    <div className="text-right sm:text-right">
      <p className="text-xl font-bold text-white">${price.toFixed(2)}</p>
      <p className="text-sm text-gray-400">Qty: {quantity} = ${(price * quantity).toFixed(2)}</p>
    </div>
  </div>
);

// Empty Cart Message Component
const EmptyCartMessage = () => {
  const router = useRouter();
  
  return (
    <div className="text-white font-sans flex items-center justify-center p-8 sm:p-12 rounded-lg">
      <div className="text-center w-full max-w-lg mx-auto">
        {/* Icon Container - Perfectly Centered */}
        <div className="flex justify-center mb-8" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-800/50 border-2 border-slate-700 flex items-center justify-center shadow-lg" style={{ width: '8rem', height: '8rem', borderRadius: '50%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '2px solid rgb(51, 65, 85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart className="w-16 h-16 sm:w-18 sm:h-18 text-blue-500" style={{ width: '4rem', height: '4rem', color: '#3B82F6' }} />
          </div>
        </div>
        
        {/* Text Content - Centered */}
        <div className="text-center" style={{ textAlign: 'center' }}>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
            Your cart is empty
          </h3>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mx-auto max-w-sm mb-8" style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', maxWidth: '24rem', margin: '0 auto 2rem' }}>
            Your cart is currently empty. Browse products and add them when you&apos;re ready to purchase
          </p>
          
          {/* Browse Products Button */}
          <button
            onClick={() => router.push('/nfc-access')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
            }}
          >
            🔐 Browse NFC Cards
          </button>
        </div>
      </div>
    </div>
  );
};

// A single product card component for reusability
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="bg-[#1A2C47] rounded-lg p-6 flex flex-col items-center text-center" style={{ backgroundColor: '#1A2C47', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: '280px', margin: '0.5rem' }}>
    <div className="w-full h-40 bg-gray-700 rounded-md mb-4 flex items-center justify-center" style={{ width: '100%', height: '10rem', backgroundColor: '#374151', borderRadius: '0.375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={product.image || 'https://placehold.co/200x150/1E293B/FFFFFF?text=NFC'} alt={product.name} className="w-full h-full object-contain" />
    </div>
    <span className="text-xs px-2 py-1 bg-blue-600 rounded-full text-white mb-2">{product.cardType.toUpperCase()}</span>
    <h4 className="font-semibold text-white text-lg mb-2" style={{ fontWeight: '600', color: 'white', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{product.name}</h4>
    <p className="text-gray-300 mb-4 text-sm" style={{ color: '#D1D5DB', marginBottom: '1rem', fontSize: '0.875rem' }}>{product.description.substring(0, 60)}...</p>
    <p className="text-gray-300 mb-6 text-lg font-bold" style={{ color: '#D1D5DB', marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
    <button 
      onClick={onAddToCart}
      disabled={product.stock === 0}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
      style={{ width: '100%', backgroundColor: product.stock === 0 ? '#4B5563' : '#2563EB', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', marginTop: 'auto' }}
    >
      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'} <ShoppingCart className="w-4 h-4" />
    </button>
  </div>
);

// Recommended Products Component
const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products, onAddToCart }) => {
  const router = useRouter();
  const { getCartTotal } = useCart();

  if (products.length === 0) {
    return (
      <div className="bg-[#10233D] text-white font-sans p-6 sm:p-8 rounded-lg w-full max-w-5xl text-center" style={{ backgroundColor: '#10233D', color: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '80rem', margin: '0 auto' }}>
        <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recommended for you</h3>
        <p className="text-gray-400 mb-6">No products available at the moment. Please check back later.</p>
        <button
          onClick={() => router.push('/nfc-access')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
          style={{ background: '#2563EB', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          View All NFC Cards
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#10233D] text-white font-sans p-6 sm:p-8 rounded-lg w-full max-w-5xl" style={{ backgroundColor: '#10233D', color: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '80rem', margin: '0 auto' }}>
      <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Recommended for you</h3>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>
      
      {/* Cart Summary - Only show if cart has items */}
      {getCartTotal() > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-700" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgb(51, 65, 85)' }}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-300">Subtotal:</span>
            <span className="text-2xl font-bold">${getCartTotal().toFixed(2)}</span>
          </div>
          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl" 
            style={{ width: '100%', backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', border: 'none', cursor: 'pointer' }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

const CartPage: NextPage = () => {
  const router = useRouter();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState<NfcProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#10233D] text-white font-sans">
      {/* Header */}
      <Header />
      
      {/* Back Button - Under Header */}
      <div className="px-4 sm:px-6 py-4">
        <Link href="/">
          <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Back to Home</span>
          </button>
        </Link>
      </div>
      
      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Close Button - Top Right */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-all duration-300"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Cart Content */}
        {cartItems.length > 0 ? (
          <div className="mb-12 sm:mb-16 w-full max-w-4xl">
            <div className="bg-[#10233D] p-6 sm:p-8 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Your Cart ({cartItems.length} items)</h2>
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  productId={item.productId}
                  name={item.product.name}
                  description={item.product.description}
                  price={item.product.price}
                  imageUrl={item.product.image}
                  quantity={item.quantity}
                  onQuantityChange={(quantity) => updateQuantity(item.productId, quantity)}
                  onRemove={() => removeFromCart(item.productId)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-12 sm:mb-16 w-full max-w-3xl">
            <EmptyCartMessage />
          </div>
        )}

        {/* Recommended Products - Centered */}
        <div className="w-full flex justify-center">
          {loading ? (
            <div className="text-white text-center">Loading products...</div>
          ) : (
            <RecommendedProducts products={products} onAddToCart={addToCart} />
          )}
        </div>

      </div>
    </div>
  );
};

export default CartPage;
