import { create } from "zustand"
import type { Product } from "./productStore"

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  date: Date
}

interface CartStore {
  items: CartItem[]
  orders: Order[]
  isOpen: boolean
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  checkout: () => void
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orders: [],
  isOpen: false,

  addToCart: (product: Product, quantity: number) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        }
      } else {
        return {
          items: [...state.items, { product, quantity }],
        }
      }
    })
  },

  removeFromCart: (productId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    set((state) => ({
      items: state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  checkout: () => {
    const { items } = get()
    const order: Order = {
      id: Date.now().toString(),
      items: [...items],
      total: get().getTotalPrice(),
      date: new Date(),
    }

    set((state) => ({
      orders: [...state.orders, order],
      items: [],
    }))
  },

  getTotalPrice: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },
}))
