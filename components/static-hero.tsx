export function StaticHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      <span className="font-['Poppins'] font-bold text-6xl md:text-8xl text-white inline-flex items-start">
        homu
        <span className="relative inline-block">
          r<sup className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">&reg;</sup>
        </span>
        a
      </span>
    </div>
  )
}

