import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

interface Product {
  id: string
  handle: string
  title: string
  featuredImage: {
    url: string
    altText: string
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.handle}`}
          className="group overflow-hidden rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50"
        >
          <div className="aspect-square overflow-hidden rounded-md bg-muted">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url || "/placeholder.svg"}
                alt={product.featuredImage.altText || product.title}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <span className="text-sm text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <div className="pt-3">
            <h3 className="font-medium text-sm group-hover:underline">{product.title}</h3>
            <p className="mt-1 text-sm font-medium text-primary">
              {formatPrice(
                Number.parseFloat(product.priceRange.minVariantPrice.amount),
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

