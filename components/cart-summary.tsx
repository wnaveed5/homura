"use client"
\
"// Update the imports at the top to include the createCheckout function
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { createCheckout } from "@/lib/actions"
import { getCookie } from "cookies-next"

export function CartSummary({ cart }: { cart: any }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      // Get the cart ID from cookies
      const cartId = getCookie("cartId") as string

      if (!cartId) {
        throw new Error("No cart found")
      }

      // Create a checkout and get the checkout URL
      const checkoutUrl = await createCheckout(cartId)

      // Redirect to the Shopify checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Checkout error:", error)
      setIsCheckingOut(false)
    }
  }

  const totalPrice = cart.items.reduce((acc: number, item: any) => {
    return acc + Number.parseFloat(item.product?.price?.amount || 0) * item.quantity
  }, 0)

  return (
    <div className="rounded-lg border bg-background p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between py-2">
        <span>Subtotal</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="flex justify-between py-2">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between border-t pt-4 mt-4 font-medium">
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <Button className="w-full mt-6" onClick={handleCheckout} disabled={isCheckingOut}>
        {isCheckingOut ? "Processing..." : "Checkout"}
      </Button>
    </div>
  )
}

