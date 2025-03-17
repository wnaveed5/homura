import { kv } from "@vercel/kv"

// Define types for Shopify data
type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: {
    url: string
    altText: string
  }
  images: {
    edges: {
      node: {
        id: string
        url: string
        altText: string
      }
    }[]
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    edges: {
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
      }
    }[]
  }
}

// Shopify GraphQL API endpoint
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "your-store.myshopify.com"
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "your-access-token"
const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`

// Helper function to make GraphQL requests to Shopify
async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching from Shopify:", error)
    throw error
  }
}

// Get products with Redis caching
export async function getProducts({ first = 10, query = "" }: { first?: number; query?: string }) {
  const cacheKey = `products:${first}:${query || "all"}`

  // Try to get from cache first
  const cachedProducts = await kv.get(cacheKey)
  if (cachedProducts) {
    return cachedProducts
  }

  // If not in cache, fetch from Shopify
  const graphqlQuery = `
    query Products($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `

  const response = await shopifyFetch({
    query: graphqlQuery,
    variables: { first, query },
  })

  const products = response.data.products.edges.map(({ node }: { node: ShopifyProduct }) => ({
    id: node.id,
    handle: node.handle,
    title: node.title,
    featuredImage: node.featuredImage,
    priceRange: node.priceRange,
  }))

  // Cache the products for 5 minutes (300 seconds)
  await kv.set(cacheKey, products, { ex: 300 })

  return products
}

// Get a single product by handle with Redis caching
export async function getProduct(handle: string) {
  const cacheKey = `product:${handle}`

  // Try to get from cache first
  const cachedProduct = await kv.get(cacheKey)
  if (cachedProduct) {
    return cachedProduct
  }

  // If not in cache, fetch from Shopify
  const graphqlQuery = `
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `

  const response = await shopifyFetch({
    query: graphqlQuery,
    variables: { handle },
  })

  if (!response.data.productByHandle) {
    return null
  }

  const shopifyProduct = response.data.productByHandle

  const product = {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    featuredImage: shopifyProduct.featuredImage,
    images: shopifyProduct.images.edges.map(({ node }: any) => ({
      id: node.id,
      url: node.url,
      altText: node.altText,
    })),
    variants: shopifyProduct.variants.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      price: node.price,
      availableForSale: node.availableForSale,
    })),
  }

  // Cache the product for 5 minutes (300 seconds)
  await kv.set(cacheKey, product, { ex: 300 })

  return product
}

// Get collections with Redis caching
export async function getCollections({ first = 10 }: { first?: number } = {}) {
  const cacheKey = `collections:${first}`

  // Try to get from cache first
  const cachedCollections = await kv.get(cacheKey)
  if (cachedCollections) {
    return cachedCollections
  }

  // If not in cache, fetch from Shopify
  const graphqlQuery = `
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `

  const response = await shopifyFetch({
    query: graphqlQuery,
    variables: { first },
  })

  const collections = response.data.collections.edges.map(({ node }: any) => ({
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    image: node.image,
  }))

  // Cache the collections for 5 minutes (300 seconds)
  await kv.set(cacheKey, collections, { ex: 300 })

  return collections
}

// Get products in a collection with Redis caching
export async function getCollectionProducts(handle: string, { first = 20 }: { first?: number } = {}) {
  const cacheKey = `collection:${handle}:products:${first}`

  // Try to get from cache first
  const cachedProducts = await kv.get(cacheKey)
  if (cachedProducts) {
    return cachedProducts
  }

  // If not in cache, fetch from Shopify
  const graphqlQuery = `
    query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        title
        products(first: $first) {
          edges {
            node {
              id
              handle
              title
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await shopifyFetch({
    query: graphqlQuery,
    variables: { handle, first },
  })

  if (!response.data.collection) {
    return { title: "", products: [] }
  }

  const collection = {
    title: response.data.collection.title,
    products: response.data.collection.products.edges.map(({ node }: any) => ({
      id: node.id,
      handle: node.handle,
      title: node.title,
      featuredImage: node.featuredImage,
      priceRange: node.priceRange,
    })),
  }

  // Cache the collection products for 5 minutes (300 seconds)
  await kv.set(cacheKey, collection, { ex: 300 })

  return collection
}

// Get product recommendations with Redis caching
export async function getProductRecommendations(productId: string) {
  const cacheKey = `product:${productId}:recommendations`

  // Try to get from cache first
  const cachedRecommendations = await kv.get(cacheKey)
  if (cachedRecommendations) {
    return cachedRecommendations
  }

  // If not in cache, fetch from Shopify
  const graphqlQuery = `
    query ProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        id
        handle
        title
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `

  const response = await shopifyFetch({
    query: graphqlQuery,
    variables: { productId },
  })

  const recommendations = response.data.productRecommendations || []

  // Cache the recommendations for 5 minutes (300 seconds)
  await kv.set(cacheKey, recommendations, { ex: 300 })

  return recommendations
}

