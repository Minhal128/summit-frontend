import React from 'react';

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  balance: number
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  quantity: number
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface AuthFormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  change: number;
  icon?: React.ReactNode;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    [key: string]: unknown;
  }>;
  label?: string;
}

export interface Network {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
}