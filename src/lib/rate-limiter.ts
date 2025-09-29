import { NextRequest } from 'next/server'

// 简单内存存储（生产环境建议使用Redis）
const requests = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // 时间窗口（毫秒）
  maxRequests: number // 最大请求数
  skipSuccessfulRequests?: boolean
  keyGenerator?: (request: NextRequest) => string
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async isAllowed(request: NextRequest): Promise<{
    allowed: boolean
    resetTime: number
    remaining: number
    limit: number
  }> {
    const key = this.config.keyGenerator ?
      this.config.keyGenerator(request) :
      this.getIPAddress(request)

    const now = Date.now()
    const record = requests.get(key)

    // 如果没有记录或时间窗口已过期，重置计数
    if (!record || now > record.resetTime) {
      const resetTime = now + this.config.windowMs
      requests.set(key, { count: 1, resetTime })
      return {
        allowed: true,
        resetTime,
        remaining: this.config.maxRequests - 1,
        limit: this.config.maxRequests
      }
    }

    // 检查是否超过限制
    if (record.count >= this.config.maxRequests) {
      return {
        allowed: false,
        resetTime: record.resetTime,
        remaining: 0,
        limit: this.config.maxRequests
      }
    }

    // 增加计数
    record.count++
    requests.set(key, record)

    return {
      allowed: true,
      resetTime: record.resetTime,
      remaining: this.config.maxRequests - record.count,
      limit: this.config.maxRequests
    }
  }

  private getIPAddress(request: NextRequest): string {
    // 获取真实IP地址（考虑代理）
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')

    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return request.headers.get('x-real-ip') || 'unknown'
  }
}

// 预定义的限制器
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1分钟
  maxRequests: 5, // 每分钟5次请求
})

export const ipRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1小时
  maxRequests: 50, // 每小时50次请求
})

// 清理过期记录（定期执行）
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of requests.entries()) {
    if (now > record.resetTime) {
      requests.delete(key)
    }
  }
}, 60 * 1000) // 每分钟清理一次