"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  CreditCard,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  Star,
  Crown,
  Zap
} from 'lucide-react'

interface UserStats {
  creditsRemaining: number
  dailyUsage: number
  totalImages: number
  plan: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats] = useState<UserStats>({
    creditsRemaining: 10,
    dailyUsage: 3,
    totalImages: 15,
    plan: 'free'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'basic': return <Star className="w-5 h-5 text-blue-500" />
      case 'pro': return <Crown className="w-5 h-5 text-purple-500" />
      case 'max': return <Zap className="w-5 h-5 text-orange-500" />
      default: return <User className="w-5 h-5 text-gray-500" />
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic Plan'
      case 'pro': return 'Pro Plan'
      case 'max': return 'Max Plan'
      default: return 'Free Plan'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-16 h-16 rounded-full border-4 border-primary/20"
              />
            ) : (
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {session.user.name?.split(' ')[0]}!
              </h1>
              <p className="text-foreground/60">{session.user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.creditsRemaining}
              </span>
            </div>
            <h3 className="font-semibold text-foreground/80">Credits Remaining</h3>
            <p className="text-sm text-foreground/60 mt-1">Available for image editing</p>
          </motion.div>

          {/* Daily Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.dailyUsage}
              </span>
            </div>
            <h3 className="font-semibold text-foreground/80">Today&apos;s Usage</h3>
            <p className="text-sm text-foreground/60 mt-1">Images processed today</p>
          </motion.div>

          {/* Total Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalImages}
              </span>
            </div>
            <h3 className="font-semibold text-foreground/80">Total Images</h3>
            <p className="text-sm text-foreground/60 mt-1">All time processed</p>
          </motion.div>

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                {getPlanIcon(stats.plan)}
              </div>
              <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors">
                Upgrade
              </button>
            </div>
            <h3 className="font-semibold text-foreground/80">{getPlanName(stats.plan)}</h3>
            <p className="text-sm text-foreground/60 mt-1">Your current subscription</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Quick Edit */}
          <div className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Quick Start</h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/#editor')}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Start Editing Images</span>
              </button>
              <button
                onClick={() => router.push('/#pricing')}
                className="w-full bg-muted hover:bg-muted/80 p-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Upgrade Plan</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { action: 'Edited sunset photo', time: '2 hours ago' },
                { action: 'Generated landscape image', time: '1 day ago' },
                { action: 'Applied art style filter', time: '3 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-foreground/60">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}