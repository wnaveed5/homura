import { notFound } from "next/navigation"
import { getProduct } from "@/lib/shopify"
import ProductDetails from "@/components/product-details"
// Add the ProductRecommendations import
import { ProductRecommendations } from "@/components/product-recommendations"

export default async function ProductPage({
  params,
}: {
  params: { handle: string }
}) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  // Update the return statement to include recommendations
  return (
    <div className="container px-4 py-12 md:px-6">
      <ProductDetails product={product} />

      <div className="mt-16">
        <ProductRecommendations productId={product.id} />
      </div>
    </div>
  )
}

