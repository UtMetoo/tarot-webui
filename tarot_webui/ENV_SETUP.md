# 环境变量设置指南

## 概述

本文档说明如何配置塔罗牌占卜应用的环境变量，包括Coze API配置和用户认证系统配置。

## 必需的环境变量

### 1. Coze API 配置

| 变量名 | 描述 | 示例值 | 获取方式 |
|--------|------|--------|----------|
| `COZE_API_KEY` | Coze平台的API密钥 | `pat_XLlHD2busKOz...` | 在Coze平台获取 |
| `COZE_WORKFLOW_ID` | 工作流ID | `7536640635056619572` | 在Coze平台获取 |

### 2. 用户认证系统配置

| 变量名 | 描述 | 示例值 | 获取方式 |
|--------|------|--------|----------|
| `JWT_SECRET` | JWT令牌加密密钥 | `your-super-secret-jwt-key` | 自定义生成 |
| `JWT_EXPIRES_IN` | JWT令牌过期时间 | `7d` | 可选，默认7天 |
| `FEISHU_APP_ID` | 飞书应用ID | `cli_xxx` | 在飞书开放平台获取 |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | `xxx` | 在飞书开放平台获取 |
| `FEISHU_BITABLE_APP_TOKEN` | 飞书多维表格应用Token | `xxx` | 在飞书多维表格获取 |
| `FEISHU_BITABLE_TABLE_ID` | 飞书多维表格表ID | `xxx` | 在飞书多维表格获取 |

### 3. 部署环境配置

| 变量名 | 描述 | 示例值 | 说明 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `production` | 生产环境自动设置 |

## 环境变量获取指南

### Coze API 配置

1. 登录 [Coze平台](https://www.coze.cn/)
2. 进入你的工作流
3. 复制API密钥和工作流ID

### JWT 配置

1. 生成JWT密钥（推荐使用强随机字符串）：
   ```bash
   # 使用Node.js生成随机字符串
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. 设置JWT过期时间（可选）：
   - `60s` - 60秒
   - `2h` - 2小时
   - `7d` - 7天
   - `30d` - 30天

### 飞书应用配置

#### 1. 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取应用ID和密钥

#### 2. 配置应用权限

在飞书开放平台为应用配置以下权限：

**基础权限：**
- `contact:user.employee_id:read` - 读取用户信息
- `contact:user.email:read` - 读取用户邮箱

**多维表格权限：**
- `bitable:app:read` - 读取多维表格应用
- `bitable:table:read` - 读取多维表格
- `bitable:table:write` - 写入多维表格

#### 3. 创建多维表格

1. 在飞书中创建多维表格
2. 创建用户表，包含以下字段：
   - `email` (文本) - 用户邮箱
   - `password_hash` (文本) - 密码哈希
   - `created_at` (日期时间) - 创建时间
   - `updated_at` (日期时间) - 更新时间

3. 获取多维表格信息：
   - 应用Token：在表格设置中获取
   - 表ID：在表格URL中获取

## 本地开发配置

### 1. 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

```bash
# Coze API 配置
COZE_API_KEY=your_coze_api_key
COZE_WORKFLOW_ID=your_workflow_id

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 飞书应用配置
FEISHU_APP_ID=your_feishu_app_id
FEISHU_APP_SECRET=your_feishu_app_secret
FEISHU_BITABLE_APP_TOKEN=your_bitable_app_token
FEISHU_BITABLE_TABLE_ID=your_bitable_table_id

# 环境配置
NODE_ENV=development
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

## Vercel 部署配置

### 1. 通过 Vercel 控制台配置

1. 登录 [Vercel控制台](https://vercel.com/)
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加所有必需的环境变量

### 2. 通过 Vercel CLI 配置

```bash
# 登录 Vercel
vercel login

# 添加环境变量
vercel env add COZE_API_KEY
vercel env add COZE_WORKFLOW_ID
vercel env add JWT_SECRET
vercel env add FEISHU_APP_ID
vercel env add FEISHU_APP_SECRET
vercel env add FEISHU_BITABLE_APP_TOKEN
vercel env add FEISHU_BITABLE_TABLE_ID

# 重新部署以应用环境变量
vercel --prod
```

## 安全注意事项

### 1. JWT 密钥安全

- 使用强随机字符串作为JWT密钥
- 不要在代码中硬编码密钥
- 定期更换JWT密钥
- 生产环境使用至少64位随机字符串

### 2. 飞书应用安全

- 妥善保管应用密钥
- 定期更换应用密钥
- 限制应用权限范围
- 监控应用使用情况

### 3. 环境变量安全

- 不要将 `.env` 文件提交到版本控制
- 使用 `.gitignore` 忽略敏感文件
- 生产环境使用Vercel的环境变量管理
- 定期审查环境变量权限

## 故障排除

### 常见问题

1. **Coze API 调用失败**
   - 检查API密钥是否正确
   - 确认工作流ID有效
   - 验证API调用频率限制

2. **飞书API 连接失败**
   - 检查应用ID和密钥
   - 确认应用权限配置
   - 验证多维表格访问权限

3. **JWT 令牌验证失败**
   - 检查JWT_SECRET是否正确
   - 确认令牌未过期
   - 验证令牌格式

4. **Cookie 设置失败**
   - 检查域名配置
   - 确认HTTPS设置
   - 验证SameSite配置

### 调试方法

1. **查看Vercel日志**
   ```bash
   vercel logs
   ```

2. **本地调试**
   ```bash
   vercel dev --debug
   ```

3. **测试API端点**
   ```bash
   curl -X POST 'http://localhost:3000/api/auth/register' \
     -H 'Content-Type: application/json' \
     -d '{"email":"test@example.com","password":"123456"}'
   ```

## 更新记录

- **v1.0** - 初始版本，包含Coze API配置
- **v2.0** - 添加用户认证系统配置
- **v2.1** - 完善飞书应用配置指南
