import { NextRequest, NextResponse } from 'next/server'
import { getAPIMetrics } from '@/lib/monitoring'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // 简单的管理员认证（生产环境应使用更安全的方式）
  const adminKey = request.headers.get('x-admin-key')

  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const metrics = getAPIMetrics()

    // 计算一些有用的统计数据
    const successRate = metrics.totalRequests > 0
      ? ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2)
      : '0'

    const errorRate = metrics.totalRequests > 0
      ? ((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(2)
      : '0'

    return NextResponse.json({
      metrics,
      analytics: {
        successRate: `${successRate}%`,
        errorRate: `${errorRate}%`,
        averageCostPerRequest: metrics.totalRequests > 0
          ? (metrics.totalCost / metrics.totalRequests).toFixed(4)
          : '0',
        securityStatus: {
          blockedRequests: metrics.blockedRequests,
          suspiciousActivities: metrics.suspiciousActivities,
          threatLevel: metrics.suspiciousActivities > 10 ? 'HIGH' :
                      metrics.suspiciousActivities > 5 ? 'MEDIUM' : 'LOW'
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Admin metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}