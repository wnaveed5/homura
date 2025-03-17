"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { addToCart } from "@/lib/actions"

interface ProductVariant {
  id: string
  title: string
  price: {
    amount: string
    currencyCode: string
  }
  availableForSale: boolean
}

interface Product {
  id: string
  title: string
  description: string
  featuredImage: {
    url: string
    altText: string
  }
  images: {
    id: string
    url: string
    altText: string
  }[]
  variants: ProductVariant[]
}

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
      })
      router.push("/cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.featuredImage?.url || "/placeholder.svg?height=600&width=600"}
            alt={product.featuredImage?.altText || product.title}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
              <button
                key={image.id}
                className="overflow-hidden rounded-md bg-muted"
                onClick={() => {
                  // In a real implementation, this would update the main image
                }}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.altText || ""}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-3 text-2xl font-medium text-primary">
            {formatPrice(Number.parseFloat(selectedVariant.price.amount), selectedVariant.price.currencyCode)}
          </p>
        </div>

        {product.variants.length > 1 && (
          <div className="space-y-2">
            <h3 className="font-medium">Variants</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant.id === variant.id ? "default" : "outline"}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={!variant.availableForSale}
                >
                  {variant.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-medium">Quantity</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              +
            </Button>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant.availableForSale}
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <h3>Description</h3>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  )
}

