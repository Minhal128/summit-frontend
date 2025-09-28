'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'quantity'>) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    // Sample products for demonstration
    {
      id: '1',
      name: 'Summit Flex',
      variant: 'Matte Black',
      price: 400.50,
      imageUrl: 'https://placehold.co/100x100/1E293B/FFFFFF?text=SF',
      quantity: 1
    },
    {
      id: '2',
      name: 'Summit Flex',
      variant: 'Matte Black',
      price: 400.50,
      imageUrl: 'https://placehold.co/100x100/1E293B/FFFFFF?text=SF',
      quantity: 1
    }
  ]);

  const addProduct = (product: Omit<Product, 'quantity'>) => {
    setProducts(prev => {
      const existingProduct = prev.find(p => p.id === product.id);
      if (existingProduct) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, quantity } : p
      )
    );
  };

  const clearCart = () => {
    setProducts([]);
  };

  const getTotalPrice = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const getTotalItems = () => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  const value: CartContextType = {
    products,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
