import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: string
  email: string
  credits: number
  plan: 'free' | 'basic' | 'pro' | 'max'
  dailyUsage: number
  lastUsageReset: string
}

// 临时用户存储（生产环境使用数据库）
const users = new Map<string, User>()

// 默认免费用户限制
const PLAN_LIMITS = {
  free: { dailyLimit: 3, credits: 0 },
  basic: { dailyLimit: 100, credits: 0 },
  pro: { dailyLimit: 500, credits: 0 },
  max: { dailyLimit: 2000, credits: 0 }
}

export function createUser(email: string): User {
  const user: User = {
    id: generateUserId(),
    email,
    credits: 10, // 新用户赠送10积分
    plan: 'free',
    dailyUsage: 0,
    lastUsageReset: new Date().toISOString().split('T')[0] // 今天
  }
  users.set(user.id, user)
  return user
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      plan: user.plan
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): { userId: string; email: string; plan: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; plan: string }
    return {
      userId: decoded.userId,
      email: decoded.email,
      plan: decoded.plan
    }
  } catch {
    return null
  }
}

export function getUserFromRequest(request: NextRequest): User | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return null
  }

  return users.get(decoded.userId) || null
}

export function canUserMakeRequest(user: User): {
  allowed: boolean;
  reason?: string;
  creditsRemaining: number;
  dailyRemaining: number;
} {
  // 重置每日使用量
  const today = new Date().toISOString().split('T')[0]
  if (user.lastUsageReset !== today) {
    user.dailyUsage = 0
    user.lastUsageReset = today
  }

  const planLimit = PLAN_LIMITS[user.plan]

  // 检查积分
  if (user.credits <= 0) {
    return {
      allowed: false,
      reason: 'Insufficient credits',
      creditsRemaining: 0,
      dailyRemaining: planLimit.dailyLimit - user.dailyUsage
    }
  }

  // 检查每日限制
  if (user.dailyUsage >= planLimit.dailyLimit) {
    return {
      allowed: false,
      reason: 'Daily limit exceeded',
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

export function consumeUserCredit(user: User): void {
  user.credits = Math.max(0, user.credits - 1)
  user.dailyUsage += 1
  // 这里应该更新数据库
}

function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9)
}