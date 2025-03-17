import { notFound } from "next/navigation"
import { getCollectionProducts } from "@/lib/shopify"
import ProductGrid from "@/components/product-grid"

export default async function CollectionPage({
  params,
}: {
  params: { handle: string }
}) {
  const { title, products } = await getCollectionProducts(params.handle)

  if (!title) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found in this collection.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}

