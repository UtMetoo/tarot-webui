/**
 * 塔罗牌占卜应用入口
 * 应用程序的主入口点，负责初始化和启动
 */

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('塔罗牌占卜应用正在启动...');
    
    try {
        // 检查必要的依赖是否已加载
        if (typeof CitiesManager === 'undefined') {
            throw new Error('CitiesManager 模块未加载');
        }
        if (typeof MarkdownRenderer === 'undefined') {
            throw new Error('MarkdownRenderer 模块未加载');
        }
        if (typeof UIUtils === 'undefined') {
            throw new Error('UIUtils 模块未加载');
        }
        if (typeof TarotApp === 'undefined') {
            throw new Error('TarotApp 模块未加载');
        }
        if (typeof AuthModule === 'undefined') {
            throw new Error('AuthModule 模块未加载');
        }
        
        // 初始化认证模块
        AuthModule.init();
        
        // 初始化应用
        const app = new TarotApp();
        console.log('塔罗牌占卜应用启动成功！');
        
        // 将应用实例挂载到全局，便于调试
        window.tarotApp = app;
        
    } catch (error) {
        console.error('应用启动失败:', error);
        
        // 显示用户友好的错误信息
        const errorElement = document.createElement('div');
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #fee;
            color: #c53030;
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid #fed7d7;
            z-index: 1000;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        errorElement.innerHTML = `
            <strong>应用启动失败</strong><br>
            ${error.message}<br>
            <small>请刷新页面重试</small>
        `;
        document.body.appendChild(errorElement);
        
        // 5秒后自动隐藏错误信息
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    }
});
