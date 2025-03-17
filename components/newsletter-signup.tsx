"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { kv } from "@vercel/kv"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")

    try {
      // Store the email in Redis with a 'newsletter:' prefix
      const timestamp = new Date().toISOString()
      await kv.set(`newsletter:${email}`, { timestamp })

      // In a real implementation, you would integrate with your email marketing provider

      setStatus("success")
      setMessage("Thank you for subscribing!")
      setEmail("")

      // Reset the success message after 3 seconds
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 3000)
    } catch (error) {
      console.error("Newsletter signup error:", error)
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Subscribe to our newsletter</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="min-w-0"
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {message && <p className={`text-sm ${status === "error" ? "text-destructive" : "text-green-600"}`}>{message}</p>}
    </div>
  )
}

