import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter, ipRateLimiter } from '@/lib/rate-limiter'
import { getAuthenticatedUser, canUserMakeRequest, consumeUserCredit } from '@/lib/auth-nextauth'
import { validateImageUpload, validatePrompt, validateRequest, logSuspiciousActivity, sanitizeInput } from '@/lib/security'

export const runtime = 'edge'

// FAL AI 集成 (替换为你的实际配置)
// import * as fal from '@fal-ai/serverless-client'

// POST /api/edit-image
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // 1. 基础请求验证
    const requestValidation = validateRequest(request)
    if (!requestValidation.valid) {
      logSuspiciousActivity(ip, userAgent, 'invalid_request', { errors: requestValidation.errors })
      return NextResponse.json(
        { error: 'Invalid request', details: requestValidation.errors },
        { status: 400 }
      )
    }

    // 2. IP频率限制检查
    const ipLimit = await ipRateLimiter.isAllowed(request)
    if (!ipLimit.allowed) {
      logSuspiciousActivity(ip, userAgent, 'ip_rate_limit_exceeded')
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((ipLimit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': ipLimit.limit.toString(),
            'X-RateLimit-Remaining': ipLimit.remaining.toString(),
            'X-RateLimit-Reset': ipLimit.resetTime.toString()
          }
        }
      )
    }

    // 3. 用户认证检查
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          redirectTo: '/auth/signin'
        },
        { status: 401 }
      )
    }

    // 4. 用户频率限制检查
    const userLimit = await apiRateLimiter.isAllowed(request)
    if (!userLimit.allowed) {
      logSuspiciousActivity(ip, userAgent, 'user_rate_limit_exceeded', { userId: user.id })
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((userLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // 5. 用户积分和配额检查
    const canProceed = canUserMakeRequest(user)
    if (!canProceed.allowed) {
      return NextResponse.json(
        {
          error: canProceed.reason,
          creditsRemaining: canProceed.creditsRemaining,
          dailyRemaining: canProceed.dailyRemaining
        },
        { status: 402 } // Payment Required
      )
    }

    // 6. 获取并验证请求数据
    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Missing image or prompt' },
        { status: 400 }
      )
    }

    // 7. 验证图片
    const imageValidation = validateImageUpload(image)
    if (!imageValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid image', details: imageValidation.errors },
        { status: 400 }
      )
    }

    // 8. 验证和清理提示词
    const sanitizedPrompt = sanitizeInput(prompt)
    const promptValidation = validatePrompt(sanitizedPrompt)
    if (!promptValidation.valid) {
      logSuspiciousActivity(ip, userAgent, 'blocked_content', { prompt: sanitizedPrompt })
      return NextResponse.json(
        { error: 'Invalid prompt', details: promptValidation.errors },
        { status: 400 }
      )
    }

    // 9. 记录警告
    if (promptValidation.warnings.length > 0) {
      logSuspiciousActivity(ip, userAgent, 'suspicious_prompt', {
        warnings: promptValidation.warnings,
        prompt: sanitizedPrompt
      })
    }

    console.log(`Processing request for user ${user.id} with prompt:`, sanitizedPrompt)

    // 10. 预先扣除积分（防止并发请求重复扣费）
    consumeUserCredit(user)

    try {
      // 11. 调用 FAL AI 服务
      /*
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          image_url: image,
          prompt: sanitizedPrompt,
          image_size: "landscape_4_3",
          num_inference_steps: 28,
          guidance_scale: 3.5,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(`Request ${user.id}: Processing...`)
          }
        },
      })

      return NextResponse.json({
        success: true,
        editedImage: result.data.images[0].url,
        message: 'Image processed successfully',
        creditsUsed: 1,
        creditsRemaining: user.credits,
        processingTime: Date.now() - startTime
      })
      */

      // 12. 临时模拟处理（开发阶段）
      await new Promise(resolve => setTimeout(resolve, 3000))

      return NextResponse.json({
        success: true,
        editedImage: image, // 临时返回原图
        message: 'Image processed successfully (demo mode)',
        creditsUsed: 1,
        creditsRemaining: user.credits,
        dailyRemaining: canProceed.dailyRemaining - 1,
        processingTime: Date.now() - startTime
      })

    } catch (aiError) {
      // 如果AI处理失败，退还积分
      user.credits += 1
      user.dailyUsage -= 1

      console.error('AI Processing Error:', aiError)
      return NextResponse.json(
        { error: 'Image processing failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API Error:', error)
    logSuspiciousActivity(ip, userAgent, 'api_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/edit-image (用于测试)
export async function GET() {
  return NextResponse.json({
    message: 'Image editing API is working!',
    endpoint: '/api/edit-image',
    method: 'POST'
  })
}