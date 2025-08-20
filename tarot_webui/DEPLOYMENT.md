# 部署指南

## 快速部署到Vercel

### 方法一：GitHub自动部署（推荐）

1. **准备代码仓库**
   ```bash
   # 初始化Git仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 推送到GitHub
   git remote add origin https://github.com/your-username/tarot-webui.git
   git push -u origin main
   ```

2. **Vercel部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 点击"New Project"
   - 选择你的GitHub仓库
   - 点击"Deploy"

3. **配置环境变量**
   - 在Vercel项目设置中找到"Environment Variables"
   - 添加以下变量：
     - `COZE_API_KEY`: 你的Coze API密钥
     - `COZE_WORKFLOW_ID`: 你的工作流ID

4. **重新部署**
   - 配置环境变量后，点击"Redeploy"

### 方法二：Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   vercel
   
   # 按提示操作：
   # - Set up and deploy? [Y/n] y
   # - Which scope? 选择你的账户
   # - Link to existing project? [y/N] n
   # - What's your project's name? tarot-webui
   # - In which directory is your code located? ./
   ```

4. **设置环境变量**
   ```bash
   vercel env add COZE_API_KEY
   # 输入你的API密钥
   
   vercel env add COZE_WORKFLOW_ID
   # 输入你的工作流ID
   ```

5. **生产部署**
   ```bash
   vercel --prod
   ```

## 本地开发环境

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **创建环境变量文件**
   ```bash
   # 创建 .env.local 文件
   echo "COZE_API_KEY=你的API密钥" > .env.local
   echo "COZE_WORKFLOW_ID=你的工作流ID" >> .env.local
   ```

3. **启动开发服务器**
   ```bash
   vercel dev
   ```

4. **访问应用**
   打开浏览器访问 `http://localhost:3000`

## 配置检查清单

部署前请确保：

- [ ] 已获取有效的Coze API密钥
- [ ] 已获取正确的工作流ID
- [ ] 环境变量已正确配置
- [ ] 项目文件结构完整
- [ ] vercel.json配置正确

## 常见问题

### 1. 部署后API调用失败

**原因**: 环境变量未正确配置

**解决方案**:
```bash
# 检查环境变量
vercel env ls

# 重新添加环境变量
vercel env add COZE_API_KEY
vercel env add COZE_WORKFLOW_ID

# 重新部署
vercel --prod
```

### 2. 城市搜索不工作

**原因**: JavaScript文件加载失败

**解决方案**:
- 检查 `public/script.js` 文件是否存在
- 检查HTML中的script标签路径是否正确
- 查看浏览器控制台的错误信息

### 3. 样式显示异常

**原因**: CSS文件路径问题

**解决方案**:
- 检查 `public/styles.css` 文件是否存在
- 检查HTML中的link标签路径是否正确
- 清除浏览器缓存

### 4. 本地开发端口冲突

**解决方案**:
```bash
# 指定端口启动
vercel dev --listen 3001
```

## 性能优化建议

1. **启用CDN缓存**
   - Vercel自动启用全球CDN
   - 静态资源自动缓存

2. **图片优化**
   - 使用WebP格式
   - 添加图片懒加载

3. **代码压缩**
   - CSS/JS自动压缩
   - 启用Gzip压缩

## 监控和日志

### 查看部署日志
```bash
vercel logs
```

### 查看函数日志
```bash
vercel logs --follow
```

### 性能监控
- 访问Vercel控制台查看性能指标
- 监控API响应时间
- 查看错误率统计

## 域名配置

### 自定义域名

1. 在Vercel项目设置中点击"Domains"
2. 添加你的域名
3. 配置DNS记录：
   - 类型：CNAME
   - 名称：www (或其他子域名)
   - 值：cname.vercel-dns.com

### SSL证书
Vercel自动为所有域名提供免费SSL证书。

## 备份和恢复

### 代码备份
- 使用Git版本控制
- 定期推送到远程仓库

### 配置备份
```bash
# 导出环境变量
vercel env pull .env.backup
```

### 快速恢复
```bash
# 从备份恢复环境变量
vercel env add < .env.backup
```

---

需要帮助？请查看 [Vercel官方文档](https://vercel.com/docs) 或联系技术支持。
