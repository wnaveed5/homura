import { getCart } from "@/lib/actions"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"

export default async function CartPage() {
  const cart = await getCart()

  return (
    <div className="container px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <a href="/products" className="text-primary hover:underline">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <CartItems cart={cart} />
          </div>
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </div>
  )
}

