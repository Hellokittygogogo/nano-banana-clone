"use client"

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 检查是否已登录
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-background/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🍌</div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Nano Banana
              </span>
            </h1>
            <p className="text-foreground/60">
              Sign in to start editing images with AI
            </p>
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-2xl border border-gray-300 flex items-center justify-center space-x-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <Chrome className="w-5 h-5" />
            )}
            <span>
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </motion.button>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-foreground/60">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Free credits to get started</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-foreground/60">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Save your editing history</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-foreground/60">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Upgrade for more features</span>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center text-xs text-foreground/40">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-foreground/60">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-foreground/60">
              Privacy Policy
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}