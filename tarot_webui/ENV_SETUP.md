# 环境变量设置指南

## 必需的环境变量

在 Vercel 部署时，您需要设置以下环境变量：

### 1. COZE_API_KEY
- **描述**: 您的 Coze API 密钥
- **获取方式**: 登录 Coze 平台，在 API 设置中获取
- **格式**: 字符串，通常以 `sk-` 开头

### 2. COZE_WORKFLOW_ID
- **描述**: 您的工作流 ID
- **获取方式**: 在 Coze 平台创建工作流后获取
- **格式**: 字符串，通常是一串数字和字母的组合

## 设置方法

### 方法一：Vercel 控制台设置（推荐）

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 找到您的项目
3. 进入 Settings → Environment Variables
4. 添加以下变量：

```
Name: COZE_API_KEY
Value: sk-your-actual-api-key
Environment: Production, Preview, Development

Name: COZE_WORKFLOW_ID
Value: your-workflow-id
Environment: Production, Preview, Development
```

5. 点击 "Save" 保存
6. 重新部署项目

### 方法二：Vercel CLI 设置

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 设置环境变量
vercel env add COZE_API_KEY
vercel env add COZE_WORKFLOW_ID

# 重新部署
vercel --prod
```

### 方法三：本地开发设置

创建 `.env.local` 文件：

```bash
# 在项目根目录创建 .env.local 文件
echo "COZE_API_KEY=your_api_key_here" > .env.local
echo "COZE_WORKFLOW_ID=your_workflow_id_here" >> .env.local
```

## 验证设置

部署后，您可以访问 `/api/debug` 端点来验证环境变量是否正确设置：

```
https://your-domain.vercel.app/api/debug
```

如果设置正确，您应该看到类似以下的响应：

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "hasApiKey": true,
  "hasWorkflowId": true,
  "workflowId": "your-workflow-id",
  "apiKeyLength": 51
}
```

## 常见问题

### 1. 环境变量未生效
- 确保在正确的环境中设置了变量（Production/Preview/Development）
- 重新部署项目
- 检查变量名是否正确（区分大小写）

### 2. API 密钥无效
- 检查 API 密钥是否正确复制
- 确认 API 密钥是否已激活
- 验证工作流 ID 是否正确

### 3. 权限问题
- 确保您的 Coze 账户有足够的权限
- 检查工作流是否已发布
