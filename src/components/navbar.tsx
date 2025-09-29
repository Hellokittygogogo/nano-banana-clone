"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { useSession, signIn, signOut } from "next-auth/react"
import { Moon, Sun, Menu, X, User, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🍌</div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nano Banana
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#editor" className="text-foreground/80 hover:text-foreground transition-colors">
              Editor
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-full transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {session.user.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-2"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-muted transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => signIn('google')}
                  className="text-sm bg-muted hover:bg-muted/80 px-4 py-2 rounded-full transition-colors"
                >
                  Google
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border mt-2 pt-4 pb-4 space-y-4"
          >
            <a href="#features" className="block text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#editor" className="block text-foreground/80 hover:text-foreground transition-colors">
              Editor
            </a>
            <a href="#pricing" className="block text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
            {session ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block bg-muted hover:bg-muted/80 px-4 py-2 rounded-full text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/signin"
                  className="block w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-2 rounded-full font-medium text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    signIn('google')
                  }}
                  className="w-full bg-muted hover:bg-muted/80 px-4 py-2 rounded-full text-sm"
                >
                  Google Login
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}