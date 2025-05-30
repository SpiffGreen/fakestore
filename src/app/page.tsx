"use client"

import { useEffect } from "react"
import { useProductStore } from "@/store/productStore"
import { useCartStore } from "@/store/cartStore"
import ProductGrid from "@/components/ProductGrid"
import SearchAndFilters from "@/components/SearchAndFilters"
import Cart from "@/components/Cart"
import { Loader2, ShoppingCart } from "lucide-react"

export default function Home() {
  const { fetchProducts, loading } = useProductStore()
  const { items, toggleCart } = useCartStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">FakeStore</h1>
            <button onClick={toggleCart} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters />
        <ProductGrid />
      </main>

      {/* Cart Sidebar */}
      <Cart />
    </div>
  )
}
