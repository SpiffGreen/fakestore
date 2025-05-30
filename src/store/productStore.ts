import { create } from "zustand"
import axios from "axios"

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
  stock: number
}

interface ProductStore {
  products: Product[]
  filteredProducts: Product[]
  loading: boolean
  error: string | null
  searchTerm: string
  priceRange: [number, number]
  maxPrice: number
  fetchProducts: () => Promise<void>
  setSearchTerm: (term: string) => void
  setPriceRange: (range: [number, number]) => void
  filterProducts: () => void
  updateProductStock: (productId: number, quantity: number) => void
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  searchTerm: "",
  priceRange: [0, 1000],
  maxPrice: 1000,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get("https://fakestoreapi.com/products")
      const productsWithStock = response.data.map((product: Product) => ({
        ...product,
        price: product.price * 1.022, // Add 2.2% to price
        stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-59
      }))

      const maxPrice = Math.max(...productsWithStock.map((p: Product) => p.price))

      set({
        products: productsWithStock,
        filteredProducts: productsWithStock,
        loading: false,
        maxPrice,
        priceRange: [0, maxPrice],
      })
    } catch {
      set({ error: "Failed to fetch products", loading: false })
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term })
    get().filterProducts()
  },

  setPriceRange: (range: [number, number]) => {
    set({ priceRange: range })
    get().filterProducts()
  },

  filterProducts: () => {
    const { products, searchTerm, priceRange } = get()

    const filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesPrice
    })

    set({ filteredProducts: filtered })
  },

  updateProductStock: (productId: number, quantity: number) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock - quantity) } : product,
      ),
      filteredProducts: state.filteredProducts.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock - quantity) } : product,
      ),
    }))
  },
}))
