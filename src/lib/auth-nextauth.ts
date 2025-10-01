import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  image?: string
  credits: number
  plan: 'free' | 'basic' | 'pro' | 'max'
  dailyUsage: number
  lastUsageReset: string
}

// 临时用户数据存储（生产环境应使用数据库）
const userDatabase = new Map<string, AuthenticatedUser>()

const PLAN_LIMITS = {
  free: { dailyLimit: 3, credits: 10 },
  basic: { dailyLimit: 100, credits: 0 },
  pro: { dailyLimit: 500, credits: 0 },
  max: { dailyLimit: 2000, credits: 0 }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    // 检查或创建用户记录
    let user = userDatabase.get(session.user.email)

    if (!user) {
      // 创建新用户
      user = {
        id: session.user.id || generateUserId(),
        email: session.user.email,
        name: session.user.name || '',
        image: session.user.image || undefined,
        credits: 10, // 新用户赠送积分
        plan: 'free',
        dailyUsage: 0,
        lastUsageReset: new Date().toISOString().split('T')[0]
      }
      userDatabase.set(session.user.email, user)
      console.log('Created new user:', user.email)
    }

    // 重置每日使用量
    const today = new Date().toISOString().split('T')[0]
    if (user.lastUsageReset !== today) {
      user.dailyUsage = 0
      user.lastUsageReset = today
    }

    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export function canUserMakeRequest(user: AuthenticatedUser): {
  allowed: boolean;
  reason?: string;
  creditsRemaining: number;
  dailyRemaining: number;
} {
  const planLimit = PLAN_LIMITS[user.plan]

  // 检查积分
  if (user.credits <= 0) {
    return {
      allowed: false,
      reason: 'Insufficient credits. Please purchase more credits or upgrade your plan.',
      creditsRemaining: 0,
      dailyRemaining: planLimit.dailyLimit - user.dailyUsage
    }
  }

  // 检查每日限制
  if (user.dailyUsage >= planLimit.dailyLimit) {
    return {
      allowed: false,
      reason: 'Daily limit reached. Upgrade your plan for more daily usage.',
      creditsRemaining: user.credits,
      dailyRemaining: 0
    }
  }

  return {
    allowed: true,
    creditsRemaining: user.credits,
    dailyRemaining: planLimit.dailyLimit - user.dailyUsage
  }
}

export function consumeUserCredit(user: AuthenticatedUser): void {
  user.credits = Math.max(0, user.credits - 1)
  user.dailyUsage += 1

  // 更新数据库中的用户记录
  userDatabase.set(user.email, user)

  console.log(`User ${user.email} used 1 credit. Remaining: ${user.credits}`)
}

export function getUserStats(email: string): AuthenticatedUser | null {
  return userDatabase.get(email) || null
}

export function updateUserPlan(email: string, plan: AuthenticatedUser['plan'], credits?: number): boolean {
  const user = userDatabase.get(email)
  if (!user) return false

  user.plan = plan
  if (credits !== undefined) {
    user.credits += credits
  }

  userDatabase.set(email, user)
  return true
}

function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9)
}