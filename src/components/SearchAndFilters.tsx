"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useProductStore } from "@/store/productStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SearchAndFilters() {
  const { searchTerm, priceRange, maxPrice, setSearchTerm, setPriceRange } = useProductStore()
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  useEffect(() => {
    setLocalPriceRange(priceRange)
  }, [priceRange])

  const handlePriceChange = (index: number, value: string) => {
    const newRange = [...localPriceRange] as [number, number]
    newRange[index] = Number.parseFloat(value) || 0
    setLocalPriceRange(newRange)
    setPriceRange(newRange)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={localPriceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="w-24"
              min="0"
              max={maxPrice}
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={localPriceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="w-24"
              min="0"
              max={maxPrice}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-end">
          <div className="text-sm text-gray-600">
            <ProductCount />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCount() {
  const { filteredProducts } = useProductStore()
  return <span>{filteredProducts.length} products found</span>
}
