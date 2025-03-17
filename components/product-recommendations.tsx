import { getProductRecommendations } from "@/lib/shopify"
import ProductGrid from "@/components/product-grid"

export async function ProductRecommendations({ productId }: { productId: string }) {
  const recommendations = await getProductRecommendations(productId)

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">You might also like</h2>
      <ProductGrid products={recommendations} />
    </div>
  )
}

