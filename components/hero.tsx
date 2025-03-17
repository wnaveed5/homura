import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative bg-muted py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Discover Our Premium Collection
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Explore our handpicked products designed to enhance your lifestyle. Quality meets affordability.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-background/30 sm:h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/0"></div>
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground/50">Featured Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

