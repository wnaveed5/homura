import { getProducts } from "@/lib/shopify"
import ProductGrid from "@/components/product-grid"
import { VideoHeroAlt } from "@/components/video-hero-alt"
import { StaticHero } from "@/components/static-hero"
import { Suspense } from "react"

export default async function Home() {
  const products = await getProducts({ first: 8 })

  return (
    <div>
      {/* Use the VideoHeroAlt component which might work better with MP4 */}
      <Suspense fallback={<StaticHero />}>
        <VideoHeroAlt />
      </Suspense>

      <div className="container px-4 py-16 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Products</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  )
}

