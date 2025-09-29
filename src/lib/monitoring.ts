interface AlertConfig {
  dailyCostThreshold: number // 每日消费告警阈值
  hourlyCostThreshold: number // 每小时消费告警阈值
  errorRateThreshold: number // 错误率告警阈值 (%)
  suspiciousActivityThreshold: number // 可疑活动告警阈值
}

interface APIMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalCost: number
  dailyCost: number
  hourlyCost: number
  suspiciousActivities: number
  blockedRequests: number
  lastReset: string
}

class MonitoringService {
  private metrics: APIMetrics
  private alerts: AlertConfig
  private webhookUrl?: string

  constructor(config: AlertConfig, webhookUrl?: string) {
    this.alerts = config
    this.webhookUrl = webhookUrl
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalCost: 0,
      dailyCost: 0,
      hourlyCost: 0,
      suspiciousActivities: 0,
      blockedRequests: 0,
      lastReset: new Date().toISOString().split('T')[0]
    }

    // 每小时重置小时指标
    setInterval(() => this.resetHourlyMetrics(), 60 * 60 * 1000)
    // 每天重置日指标
    setInterval(() => this.resetDailyMetrics(), 24 * 60 * 60 * 1000)
  }

  recordRequest(success: boolean, cost: number = 0): void {
    this.metrics.totalRequests++
    this.metrics.totalCost += cost
    this.metrics.dailyCost += cost
    this.metrics.hourlyCost += cost

    if (success) {
      this.metrics.successfulRequests++
    } else {
      this.metrics.failedRequests++
    }

    this.checkAlerts()
  }

  recordSuspiciousActivity(): void {
    this.metrics.suspiciousActivities++
    this.checkAlerts()
  }

  recordBlockedRequest(): void {
    this.metrics.blockedRequests++
  }

  private checkAlerts(): void {
    // 检查每日成本告警
    if (this.metrics.dailyCost >= this.alerts.dailyCostThreshold) {
      this.sendAlert('daily_cost_exceeded', {
        currentCost: this.metrics.dailyCost,
        threshold: this.alerts.dailyCostThreshold
      })
    }

    // 检查每小时成本告警
    if (this.metrics.hourlyCost >= this.alerts.hourlyCostThreshold) {
      this.sendAlert('hourly_cost_exceeded', {
        currentCost: this.metrics.hourlyCost,
        threshold: this.alerts.hourlyCostThreshold
      })
    }

    // 检查错误率告警
    const errorRate = (this.metrics.failedRequests / this.metrics.totalRequests) * 100
    if (errorRate >= this.alerts.errorRateThreshold && this.metrics.totalRequests > 10) {
      this.sendAlert('high_error_rate', {
        errorRate: errorRate.toFixed(2),
        threshold: this.alerts.errorRateThreshold
      })
    }

    // 检查可疑活动告警
    if (this.metrics.suspiciousActivities >= this.alerts.suspiciousActivityThreshold) {
      this.sendAlert('suspicious_activity_spike', {
        count: this.metrics.suspiciousActivities,
        threshold: this.alerts.suspiciousActivityThreshold
      })
    }
  }

  private async sendAlert(type: string, data: Record<string, unknown>): Promise<void> {
    const alert = {
      timestamp: new Date().toISOString(),
      type,
      data,
      metrics: this.metrics
    }

    console.error('🚨 ALERT:', alert)

    // 发送到webhook（如Slack、Discord等）
    if (this.webhookUrl) {
      try {
        await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 API Alert: ${type}`,
            attachments: [{
              color: 'danger',
              fields: Object.entries(data).map(([key, value]) => ({
                title: key,
                value: String(value),
                short: true
              }))
            }]
          })
        })
      } catch (error) {
        console.error('Failed to send alert webhook:', error)
      }
    }

    // 这里可以添加其他告警方式：
    // - 发送邮件
    // - 发送短信
    // - 写入日志文件
    // - 发送到监控系统
  }

  private resetHourlyMetrics(): void {
    this.metrics.hourlyCost = 0
  }

  private resetDailyMetrics(): void {
    const today = new Date().toISOString().split('T')[0]
    if (this.metrics.lastReset !== today) {
      this.metrics.dailyCost = 0
      this.metrics.suspiciousActivities = 0
      this.metrics.lastReset = today
    }
  }

  getMetrics(): APIMetrics {
    return { ...this.metrics }
  }

  // 紧急停止功能
  emergencyStop(): boolean {
    console.error('🛑 EMERGENCY STOP ACTIVATED')
    // 这里可以：
    // 1. 禁用API密钥
    // 2. 返回503服务不可用
    // 3. 发送紧急通知
    return true
  }
}

// 全局监控实例
export const monitor = new MonitoringService({
  dailyCostThreshold: 50, // $50/day
  hourlyCostThreshold: 10, // $10/hour
  errorRateThreshold: 15, // 15% error rate
  suspiciousActivityThreshold: 20 // 20 suspicious activities
}, process.env.ALERT_WEBHOOK_URL)

// 导出记录函数供API使用
export const recordAPIRequest = monitor.recordRequest.bind(monitor)
export const recordSuspiciousActivity = monitor.recordSuspiciousActivity.bind(monitor)
export const recordBlockedRequest = monitor.recordBlockedRequest.bind(monitor)
export const getAPIMetrics = monitor.getMetrics.bind(monitor)
export const emergencyStop = monitor.emergencyStop.bind(monitor)