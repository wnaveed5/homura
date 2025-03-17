"use server"

import { cookies } from "next/headers"
import { kv } from "@vercel/kv"
import { revalidatePath } from "next/cache"

// Create or get cart ID from cookies
async function getCartId() {
  const cookieStore = cookies()
  let cartId = cookieStore.get("cartId")?.value

  if (!cartId) {
    cartId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    cookieStore.set("cartId", cartId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  }

  return cartId
}

// Add item to cart
export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string
  quantity: number
}) {
  const cartId = await getCartId()
  const cartKey = `cart:${cartId}`

  // Get current cart
  const cart = (await kv.get(cartKey)) || { items: [] }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex((item: any) => item.variantId === variantId)

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item if it doesn't exist
    cart.items.push({
      variantId,
      quantity,
      addedAt: new Date().toISOString(),
    })
  }

  // Save cart to Redis with 30-day expiration
  await kv.set(cartKey, cart, { ex: 60 * 60 * 24 * 30 })

  revalidatePath("/cart")
}

// Remove item from cart
export async function removeFromCart({ variantId }: { variantId: string }) {
  const cartId = await getCartId()
  const cartKey = `cart:${cartId}`

  // Get current cart
  const cart = await kv.get(cartKey)

  if (!cart) {
    return
  }

  // Filter out the item to remove
  cart.items = cart.items.filter((item: any) => item.variantId !== variantId)

  // Save updated cart
  await kv.set(cartKey, cart, { ex: 60 * 60 * 24 * 30 })

  revalidatePath("/cart")
}

// Update item quantity in cart
export async function updateCartItemQuantity({
  variantId,
  quantity,
}: {
  variantId: string
  quantity: number
}) {
  if (quantity < 1) {
    return removeFromCart({ variantId })
  }

  const cartId = await getCartId()
  const cartKey = `cart:${cartId}`

  // Get current cart
  const cart = await kv.get(cartKey)

  if (!cart) {
    return
  }

  // Find and update the item
  const itemIndex = cart.items.findIndex((item: any) => item.variantId === variantId)

  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity = quantity

    // Save updated cart
    await kv.set(cartKey, cart, { ex: 60 * 60 * 24 * 30 })

    revalidatePath("/cart")
  }
}

// Get cart contents
export async function getCart() {
  const cartId = await getCartId()
  const cartKey = `cart:${cartId}`

  // Get cart from Redis
  const cart = await kv.get(cartKey)

  if (!cart || !cart.items || cart.items.length === 0) {
    return { items: [] }
  }

  return cart
}

// Create a Shopify checkout
export async function createCheckout(cartId: string) {
  const cartKey = `cart:${cartId}`
  const cart = await kv.get(cartKey)

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty")
  }

  // Create line items for Shopify checkout
  const lineItems = cart.items.map((item: any) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }))

  // Create checkout with Shopify Storefront API
  const query = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      lineItems,
    },
  }

  const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
    },
    body: JSON.stringify({ query, variables }),
  })

  const { data } = await response.json()

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message)
  }

  return data.checkoutCreate.checkout.webUrl
}

