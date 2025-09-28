import { Product, User, Order } from '@/types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bitcoin',
    description: 'The world\'s first cryptocurrency',
    price: 45000,
    image: '/images/bitcoin.png',
    category: 'cryptocurrency',
    inStock: true,
    quantity: 100
  },
  {
    id: '2',
    name: 'Ethereum',
    description: 'Smart contract platform',
    price: 3200,
    image: '/images/ethereum.png',
    category: 'cryptocurrency',
    inStock: true,
    quantity: 150
  },
  {
    id: '3',
    name: 'Gold ETF',
    description: 'Gold exchange-traded fund',
    price: 180,
    image: '/images/gold.png',
    category: 'commodities',
    inStock: true,
    quantity: 200
  },
  {
    id: '4',
    name: 'Apple Stock',
    description: 'Apple Inc. shares',
    price: 175,
    image: '/images/apple.png',
    category: 'stocks',
    inStock: true,
    quantity: 50
  },
  {
    id: '5',
    name: 'Tesla Stock',
    description: 'Tesla Inc. shares',
    price: 250,
    image: '/images/tesla.png',
    category: 'stocks',
    inStock: true,
    quantity: 75
  }
]

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: '/images/avatar.png',
  balance: 10000,
  createdAt: '2024-01-15T10:30:00Z'
}

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        id: '1',
        product: mockProducts[0],
        quantity: 0.1
      }
    ],
    total: 4500,
    status: 'delivered',
    createdAt: '2024-01-10T14:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  }
]
