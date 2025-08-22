# 测试页面说明

本目录包含项目的测试页面，用于验证部署状态和功能完整性。

## 测试页面列表

### 1. test.html - 部署测试页面
**用途**: 验证部署状态和API连接
**功能**:
- 检查静态文件部署状态
- 测试调试API连接
- 验证环境变量配置
- 测试塔罗牌API功能

**访问方式**: `https://your-domain.vercel.app/test`

### 2. card-test.html - 卡片显示测试
**用途**: 测试卡片信息显示功能
**功能**:
- 模拟卡片数据渲染
- 测试API响应解析
- 验证卡片布局和样式

**访问方式**: `https://your-domain.vercel.app/test/card-test`

### 3. image-test.html - 图片加载测试
**用途**: 测试图片加载和错误处理
**功能**:
- 测试有效图片加载
- 测试无效图片错误处理
- 验证加载状态和错误提示
- 实时状态反馈

**访问方式**: `https://your-domain.vercel.app/test/image-test`

### 4. markdown-test.html - Markdown渲染测试
**用途**: 测试塔罗牌解读中的Markdown格式渲染
**功能**:
- 基本Markdown格式测试（标题、粗体、斜体）
- 列表渲染测试（有序列表、无序列表）
- 链接和代码块测试
- 复杂格式组合测试
- 实时渲染预览

**访问方式**: `https://your-domain.vercel.app/test/markdown-test`

## 使用建议

1. **部署后验证**: 部署完成后首先访问 `/test` 验证基本功能
2. **功能测试**: 使用各个测试页面验证具体功能
   - `/test/card-test` - 验证卡片显示功能
   - `/test/image-test` - 验证图片加载处理
   - `/test/markdown-test` - 验证Markdown解读渲染
3. **问题诊断**: 遇到问题时使用相应的测试页面进行诊断

## 注意事项

- 测试页面仅用于开发和调试，生产环境可选择性保留
- 测试页面中的API调用会消耗配额，请谨慎使用
- 本地开发时请确保API服务正常运行
