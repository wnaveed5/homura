import { Suspense } from "react"
import { getProducts } from "@/lib/shopify"
import ProductGrid from "@/components/product-grid"
import { Search } from "@/components/search"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""
  const products = query ? await getProducts({ first: 24, query }) : []

  return (
    <div className="container px-4 py-12 md:px-6">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Search Products</h1>
        <div className="max-w-md">
          <Search />
        </div>
      </div>

      {query ? (
        <>
          <h2 className="text-xl font-medium mb-6">
            {products.length === 0
              ? "No products found"
              : `Found ${products.length} product${products.length === 1 ? "" : "s"} for "${query}"`}
          </h2>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid products={products} />
          </Suspense>
        </>
      ) : (
        <p className="text-muted-foreground">Enter a search term to find products.</p>
      )}
    </div>
  )
}

