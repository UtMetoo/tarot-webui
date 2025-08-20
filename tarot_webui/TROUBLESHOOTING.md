# 部署故障排除指南

## 404 错误解决方案

### 1. 检查项目结构

确保您的项目结构如下：

```
tarot_webui/
├── public/
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── test.html
├── api/
│   ├── tarot.js
│   └── debug.js
├── vercel.json
└── package.json
```

### 2. 重新部署步骤

1. **清理缓存并重新部署**
   ```bash
   # 删除 .vercel 文件夹（如果存在）
   rm -rf .vercel
   
   # 重新部署
   vercel --prod
   ```

2. **检查部署日志**
   ```bash
   vercel logs
   ```

### 3. 验证部署

访问以下URL验证部署：

- **主页**: `https://your-domain.vercel.app/`
- **测试页面**: `https://your-domain.vercel.app/test.html`
- **调试API**: `https://your-domain.vercel.app/api/debug`

## 常见错误及解决方案

### 错误 1: "The page could not be found"

**原因**: 路由配置问题或文件路径错误

**解决方案**:
1. 检查 `vercel.json` 配置
2. 确保所有文件都在正确的位置
3. 重新部署项目

### 错误 2: "Environment Variable references Secret which does not exist"

**原因**: 环境变量配置错误

**解决方案**:
1. 在 Vercel 控制台设置环境变量
2. 不要使用 `@` 符号引用密钥
3. 直接设置变量值

### 错误 3: API 调用失败

**原因**: 环境变量未设置或 API 配置错误

**解决方案**:
1. 检查环境变量设置
2. 验证 API 密钥和工作流 ID
3. 查看函数日志

## 调试步骤

### 步骤 1: 检查静态文件

访问测试页面：`https://your-domain.vercel.app/test.html`

如果能看到测试页面，说明静态文件部署正常。

### 步骤 2: 检查 API

访问调试端点：`https://your-domain.vercel.app/api/debug`

应该返回 JSON 格式的调试信息。

### 步骤 3: 检查环境变量

在调试信息中查看：
- `hasApiKey`: 是否设置了 API 密钥
- `hasWorkflowId`: 是否设置了工作流 ID

### 步骤 4: 查看日志

```bash
# 查看函数日志
vercel logs --follow

# 查看部署日志
vercel logs
```

## 重新部署完整流程

1. **准备代码**
   ```bash
   git add .
   git commit -m "Fix deployment issues"
   git push
   ```

2. **设置环境变量**
   - 访问 Vercel 控制台
   - 进入项目设置 → Environment Variables
   - 添加 `COZE_API_KEY` 和 `COZE_WORKFLOW_ID`

3. **重新部署**
   ```bash
   vercel --prod
   ```

4. **验证部署**
   - 访问测试页面
   - 检查 API 功能
   - 测试占卜功能

## 联系支持

如果问题仍然存在，请提供以下信息：

1. 错误信息截图
2. 项目 URL
3. Vercel 部署日志
4. 环境变量配置状态（隐藏敏感信息）

## 快速修复命令

```bash
# 重新部署
vercel --prod

# 查看日志
vercel logs

# 检查环境变量
vercel env ls

# 本地测试
vercel dev
```
