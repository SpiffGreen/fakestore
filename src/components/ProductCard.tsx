"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Plus, Minus } from "lucide-react"
import type { Product } from "@/store/productStore"
import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCartStore()

  const handleAddToCart = () => {
    if (quantity <= product.stock) {
      addToCart(product, quantity)
      setQuantity(1)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-contain p-4"
          crossOrigin="anonymous"
        />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">{product.title}</h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>

        {product.stock > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{quantity}</span>
              <Button variant="outline" size="sm" onClick={incrementQuantity} disabled={quantity >= product.stock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleAddToCart} className="w-full bg-blue-900 hover:bg-blue-900/80 cursor-pointer" disabled={quantity > product.stock}>
              Add to Cart
            </Button>
          </div>
        ) : (
          <Button disabled className="w-full bg-blue-900/80">
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  )
}
