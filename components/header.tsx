"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="container flex h-24 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          {/* Logo with increased size by 15px */}
          <span
            className="font-['Poppins'] font-bold text-white inline-flex items-baseline"
            style={{ fontSize: "calc(2.25rem + 15px)", lineHeight: "1.1" }}
          >
            homur
            <span className="relative inline-flex items-center">
              a
              <sup className="absolute -top-1 transform -translate-x-0" style={{ left: "100%", fontSize: "0.6em" }}>
                ®
              </sup>
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white font-medium">
            Menu
          </button>
          <Link href="/cart" className="text-white font-medium">
            Cart
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute w-full bg-black bg-opacity-90">
          <nav className="container flex flex-col space-y-4 p-6">
            <Link
              href="/"
              className="text-lg font-medium text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/collections"
              className="text-lg font-medium text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/products"
              className="text-lg font-medium text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-lg font-medium text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

