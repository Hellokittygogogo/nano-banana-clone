# 🛡️ API安全防护设置指南

## 1. 安装依赖
```bash
npm install jsonwebtoken @types/jsonwebtoken @fal-ai/serverless-client
```

## 2. 环境变量配置
复制 `.env.local.example` 为 `.env.local` 并填入你的实际值：

```bash
cp .env.local.example .env.local
```

关键配置项：
- `FAL_AI_API_KEY`: 你的FAL AI API密钥
- `JWT_SECRET`: 强密码，用于Token签名
- `ADMIN_API_KEY`: 管理员API密钥
- `ALERT_WEBHOOK_URL`: Slack/Discord webhook（可选）

## 3. 防护级别说明

### 🔒 已实现的防护：
- ✅ IP频率限制：每小时50次请求
- ✅ 用户频率限制：每分钟5次请求
- ✅ 用户认证：JWT Token验证
- ✅ 积分控制：余额不足拒绝服务
- ✅ 图片验证：格式、大小限制
- ✅ 内容过滤：恶意prompt检测
- ✅ 实时监控：成本、错误率告警
- ✅ 安全日志：可疑活动记录

### 📊 监控面板访问：
```bash
# 获取API使用统计
curl -H "x-admin-key: YOUR_ADMIN_KEY" \
     http://localhost:3000/api/admin/metrics
```

## 4. 紧急应对措施

### 🚨 如果发现异常：
1. **立即检查监控面板**
2. **暂停FAL AI服务**（在FAL控制台）
3. **更换API密钥**
4. **分析日志找出原因**

### 💰 成本控制：
- 每日消费告警：$50
- 每小时消费告警：$10
- 单次请求最大图片：10MB
- 免费用户每日限制：3次

## 5. 生产环境建议

### 🔧 技术优化：
- 使用Redis替换内存存储
- 配置CloudFlare CDN防护
- 启用数据库持久化用户数据
- 设置Kubernetes资源限制

### 📈 监控加强：
- 集成Datadog/New Relic
- 配置PagerDuty告警
- 启用AWS GuardDuty
- 定期安全审计

## 6. 测试防护效果

```bash
# 测试频率限制
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/edit-image
  sleep 1
done

# 测试恶意内容过滤
curl -X POST http://localhost:3000/api/edit-image \
  -d '{"prompt":"nude images", "image":"data:image/png;base64,..."}'
```

记住：**安全无小事，监控常态化！** 🛡️