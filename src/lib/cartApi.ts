// lib/cartApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app';

export interface NfcProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  cardType: 'standard' | 'premium' | 'enterprise';
  features: string[];
  image: string;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  product?: NfcProduct;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: NfcProduct;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentStatus: string;
  orderStatus: string;
}

// Fetch all NFC products
export async function fetchProducts(): Promise<NfcProduct[]> {
  try {
    const url = `${API_BASE_URL}/api/cart/products`;
    console.log('📡 Fetching from:', url);
    
    const response = await fetch(url);
    console.log('📥 Response status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (data.status === 'success') {
      console.log('✅ Success! Products:', data.data.length);
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch products');
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

// Get Stripe publishable key
export async function getStripeConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/config`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.publishableKey;
    }
    throw new Error('Failed to get Stripe config');
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    throw error;
  }
}

// Create payment intent
export async function createPaymentIntent(items: CartItem[], shippingAddress: ShippingAddress) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, shippingAddress }),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return data;
    }
    throw new Error(data.message || 'Failed to create payment intent');
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Get order details
export async function getOrder(orderId: string): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/order/${orderId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch order');
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
