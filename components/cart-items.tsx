"use client"

import Image from "next/image"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateCartItemQuantity, removeFromCart } from "@/lib/actions"
import { formatPrice } from "@/lib/utils"

interface CartItem {
  variantId: string
  quantity: number
  product?: {
    title: string
    featuredImage: {
      url: string
      altText: string
    }
    price: {
      amount: string
      currencyCode: string
    }
  }
}

interface CartItemsProps {
  cart: {
    items: CartItem[]
  }
}

export function CartItems({ cart }: CartItemsProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleUpdateQuantity = async (variantId: string, quantity: number) => {
    setLoading((prev) => ({ ...prev, [variantId]: true }))
    await updateCartItemQuantity({ variantId, quantity })
    setLoading((prev) => ({ ...prev, [variantId]: false }))
  }

  const handleRemoveItem = async (variantId: string) => {
    setLoading((prev) => ({ ...prev, [variantId]: true }))
    await removeFromCart({ variantId })
    setLoading((prev) => ({ ...prev, [variantId]: false }))
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div key={item.variantId} className="flex items-center space-x-4 rounded-lg border p-4">
          <div className="h-16 w-16 rounded bg-muted">
            {item.product?.featuredImage ? (
              <Image
                src={item.product.featuredImage.url || "/placeholder.svg"}
                alt={item.product.featuredImage.altText || ""}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium">{item.product?.title || "Product"}</h3>
            <p className="text-sm text-muted-foreground">
              {item.product?.price
                ? formatPrice(
                    Number.parseFloat(item.product.price.amount) * item.quantity,
                    item.product.price.currencyCode,
                  )
                : "Price unavailable"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              disabled={loading[item.variantId]}
              onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={loading[item.variantId]}
              onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
            >
              +
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={loading[item.variantId]}
            onClick={() => handleRemoveItem(item.variantId)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
    </div>
  )
}

