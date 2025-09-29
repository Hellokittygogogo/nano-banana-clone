import { NextRequest } from 'next/server'

// 恶意内容检测
const BLOCKED_KEYWORDS = [
  'nude', 'naked', 'sexual', 'violence', 'blood', 'gore',
  'hate', 'terrorist', 'weapon', 'drug', 'illegal'
]

const SUSPICIOUS_PATTERNS = [
  /\b(?:hack|crack|exploit|bypass)\b/i,
  /\b(?:injection|xss|csrf)\b/i,
  /\b(?:admin|root|password)\b/i
]

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateImageUpload(
  imageData: string,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  }

  // 检查是否是有效的base64图片
  if (!imageData.startsWith('data:image/')) {
    result.valid = false
    result.errors.push('Invalid image format')
    return result
  }

  // 检查文件大小
  const sizeMatch = imageData.match(/^data:image\/[^;]+;base64,(.+)$/)
  if (sizeMatch) {
    const base64Data = sizeMatch[1]
    const sizeInBytes = (base64Data.length * 3) / 4

    if (sizeInBytes > maxSizeBytes) {
      result.valid = false
      result.errors.push(`Image too large. Max size: ${maxSizeBytes / 1024 / 1024}MB`)
    }
  }

  // 检查支持的格式
  const supportedFormats = ['jpeg', 'jpg', 'png', 'webp']
  const formatMatch = imageData.match(/^data:image\/([^;]+)/)

  if (formatMatch) {
    const format = formatMatch[1].toLowerCase()
    if (!supportedFormats.includes(format)) {
      result.valid = false
      result.errors.push(`Unsupported format: ${format}. Supported: ${supportedFormats.join(', ')}`)
    }
  }

  return result
}

export function validatePrompt(prompt: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  }

  // 检查长度
  if (prompt.length > 500) {
    result.valid = false
    result.errors.push('Prompt too long. Max 500 characters')
  }

  if (prompt.length < 3) {
    result.valid = false
    result.errors.push('Prompt too short. Min 3 characters')
  }

  // 检查恶意内容
  const lowerPrompt = prompt.toLowerCase()
  const foundKeywords = BLOCKED_KEYWORDS.filter(keyword =>
    lowerPrompt.includes(keyword)
  )

  if (foundKeywords.length > 0) {
    result.valid = false
    result.errors.push(`Blocked content detected: ${foundKeywords.join(', ')}`)
  }

  // 检查可疑模式
  const suspiciousMatches = SUSPICIOUS_PATTERNS.filter(pattern =>
    pattern.test(prompt)
  )

  if (suspiciousMatches.length > 0) {
    result.warnings.push('Potentially suspicious content detected')
  }

  return result
}

export function validateRequest(request: NextRequest): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  }

  // 检查User-Agent
  const userAgent = request.headers.get('user-agent')
  if (!userAgent || userAgent.length < 10) {
    result.warnings.push('Suspicious user agent')
  }

  // 检查Referer
  const referer = request.headers.get('referer')
  if (referer && !referer.includes(request.nextUrl.hostname)) {
    result.warnings.push('External referer detected')
  }

  // 检查Content-Type
  const contentType = request.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    result.valid = false
    result.errors.push('Invalid content type')
  }

  return result
}

export function logSuspiciousActivity(
  ip: string,
  userAgent: string,
  activity: string,
  details?: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    activity,
    details,
    severity: 'warning'
  }

  // 这里应该写入日志文件或发送到监控系统
  console.warn('🚨 Suspicious Activity:', logEntry)

  // 简单的内存黑名单（生产环境使用Redis）
  if (activity === 'rate_limit_exceeded' || activity === 'invalid_request') {
    // 可以考虑临时封禁IP
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除script标签
    .replace(/<[^>]*>/g, '') // 移除所有HTML标签
    .trim()
}