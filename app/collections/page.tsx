import Link from "next/link"
import Image from "next/image"
import { getCollections } from "@/lib/shopify"
import { Card, CardContent } from "@/components/ui/card"

export default async function CollectionsPage() {
  const collections = await getCollections({ first: 20 })

  return (
    <div className="container px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Collections</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection: any) => (
          <Link key={collection.id} href={`/collections/${collection.handle}`}>
            <Card className="overflow-hidden h-full transition-colors hover:bg-muted/50">
              <div className="aspect-[16/9] w-full bg-muted">
                {collection.image ? (
                  <Image
                    src={collection.image.url || "/placeholder.svg?height=225&width=400"}
                    alt={collection.image.altText || collection.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary">
                    <span className="text-lg font-medium">{collection.title}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{collection.title}</h2>
                {collection.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

