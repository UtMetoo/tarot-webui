/**
 * 用户认证模块
 * 负责处理用户登录、注册、状态管理等功能
 * 遵循现有的模块化架构设计
 */

window.AuthModule = {
    // 用户状态
    currentUser: null,
    isAuthenticated: false,
    
    // DOM元素引用
    elements: {
        authContainer: null,
        loginForm: null,
        registerForm: null,
        userStatus: null,
        authToggle: null
    },
    
    /**
     * 初始化认证模块
     */
    init() {
        console.log('认证模块初始化...');
        
        // 创建认证UI容器
        this.createAuthContainer();
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化界面状态（隐藏塔罗牌界面）
        this.initializeInterfaceState();
        
        // 检查用户登录状态
        this.checkAuthStatus();
        
        console.log('认证模块初始化完成');
    },
    
    /**
     * 创建认证UI容器
     */
    createAuthContainer() {
        // 创建认证容器
        const authContainer = document.createElement('div');
        authContainer.id = 'auth-container';
        authContainer.className = 'auth-container';
        authContainer.innerHTML = `
            <!-- 用户状态显示 -->
            <div id="user-status" class="user-status" style="display: none;">
                <div class="user-info">
                    <div class="user-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="5" fill="currentColor"/>
                            <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="user-details">
                        <div class="user-email"></div>
                        <div class="user-since">注册时间: <span></span></div>
                    </div>
                </div>
                <button id="logout-btn" class="logout-btn" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    登出
                </button>
            </div>
            
            <!-- 认证切换按钮 -->
            <div id="auth-toggle" class="auth-toggle">
                <button id="login-toggle" class="auth-btn active" type="button">登录</button>
                <button id="register-toggle" class="auth-btn" type="button">注册</button>
            </div>
            
            <!-- 登录表单 -->
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="login-email">邮箱地址</label>
                    <input type="email" id="login-email" name="email" required placeholder="请输入邮箱地址">
                </div>
                <div class="form-group">
                    <label for="login-password">密码</label>
                    <input type="password" id="login-password" name="password" required placeholder="请输入密码">
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        登录
                    </button>
                </div>
            </form>
            
            <!-- 注册表单 -->
            <form id="register-form" class="auth-form" style="display: none;">
                <div class="form-group">
                    <label for="register-email">邮箱地址</label>
                    <input type="email" id="register-email" name="email" required placeholder="请输入邮箱地址">
                </div>
                <div class="form-group">
                    <label for="register-password">密码</label>
                    <input type="password" id="register-password" name="password" required placeholder="请输入密码（至少6位）">
                    <small>密码长度至少6位</small>
                </div>
                <div class="form-group">
                    <label for="register-confirm-password">确认密码</label>
                    <input type="password" id="register-confirm-password" name="confirmPassword" required placeholder="请再次输入密码">
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                            <path d="M22 21V19C22 18.1472 21.6485 17.3241 21.0168 16.7168C20.3851 16.1095 19.5179 15.8 18.6 15.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11883 19.0078 7.005C19.0078 7.89117 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        注册
                    </button>
                </div>
            </form>
            
            <!-- 加载状态 -->
            <div id="auth-loading" class="auth-loading" style="display: none;">
                <div class="loading-spinner"></div>
                <div class="loading-text">处理中...</div>
            </div>
            
            <!-- 错误提示 -->
            <div id="auth-error" class="auth-error" style="display: none;"></div>
        `;
        
        // 插入到页面头部
        const header = document.querySelector('.header');
        if (header) {
            header.parentNode.insertBefore(authContainer, header.nextSibling);
        }
        
        // 保存元素引用
        this.elements.authContainer = authContainer;
        this.elements.loginForm = document.getElementById('login-form');
        this.elements.registerForm = document.getElementById('register-form');
        this.elements.userStatus = document.getElementById('user-status');
        this.elements.authToggle = document.getElementById('auth-toggle');
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 认证切换
        document.getElementById('login-toggle').addEventListener('click', () => this.showLogin());
        document.getElementById('register-toggle').addEventListener('click', () => this.showRegister());
        
        // 表单提交
        this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.elements.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        
        // 登出
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
    },
    
    /**
     * 初始化界面状态
     */
    initializeInterfaceState() {
        // 默认隐藏塔罗牌主界面
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.display = 'none';
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.3s ease';
        }
        
        console.log('界面状态初始化完成：塔罗牌界面已隐藏');
    },
    
    /**
     * 检查用户登录状态
     */
    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.setUser(data.user);
            } else {
                this.clearUser();
            }
        } catch (error) {
            console.error('检查登录状态失败:', error);
            this.clearUser();
        }
    },
    
    /**
     * 显示登录表单
     */
    showLogin() {
        document.getElementById('login-toggle').classList.add('active');
        document.getElementById('register-toggle').classList.remove('active');
        this.elements.loginForm.style.display = 'block';
        this.elements.registerForm.style.display = 'none';
        this.hideError();
    },
    
    /**
     * 显示注册表单
     */
    showRegister() {
        document.getElementById('register-toggle').classList.add('active');
        document.getElementById('login-toggle').classList.remove('active');
        this.elements.registerForm.style.display = 'block';
        this.elements.loginForm.style.display = 'none';
        this.hideError();
    },
    
    /**
     * 处理登录
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        this.showLoading();
        this.hideError();
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.setUser(data.user);
                this.showSuccess('登录成功！');
            } else {
                this.showError(data.error || '登录失败');
            }
        } catch (error) {
            console.error('登录错误:', error);
            this.showError('网络错误，请重试');
        } finally {
            this.hideLoading();
        }
    },
    
    /**
     * 处理注册
     */
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // 验证密码
        if (password !== confirmPassword) {
            this.showError('两次输入的密码不一致');
            return;
        }
        
        if (password.length < 6) {
            this.showError('密码长度至少6位');
            return;
        }
        
        this.showLoading();
        this.hideError();
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.setUser(data.user);
                this.showSuccess('注册成功！');
            } else {
                this.showError(data.error || '注册失败');
            }
        } catch (error) {
            console.error('注册错误:', error);
            this.showError('网络错误，请重试');
        } finally {
            this.hideLoading();
        }
    },
    
    /**
     * 处理登出
     */
    async handleLogout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                this.clearUser();
                this.showSuccess('已登出');
            } else {
                this.showError('登出失败');
            }
        } catch (error) {
            console.error('登出错误:', error);
            this.showError('网络错误，请重试');
        }
    },
    
    /**
     * 设置用户状态
     */
    setUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // 更新UI
        this.elements.userStatus.style.display = 'flex';
        this.elements.authToggle.style.display = 'none';
        this.elements.loginForm.style.display = 'none';
        this.elements.registerForm.style.display = 'none';
        
        // 更新用户信息
        document.querySelector('.user-email').textContent = user.email;
        if (user.createdAt) {
            const date = new Date(user.createdAt);
            document.querySelector('.user-since span').textContent = date.toLocaleDateString('zh-CN');
        }
        
        // 渐进式显示塔罗牌界面
        this.showTarotInterface();
        
        // 创建响应式浮动用户状态栏
        this.createFloatingUserStatus();
        
        // 触发用户状态变化事件
        this.triggerEvent('userLogin', { user });
    },
    
    /**
     * 清除用户状态
     */
    clearUser() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // 渐进式隐藏塔罗牌界面
        this.hideTarotInterface();
        
        // 移除浮动用户状态栏
        this.removeFloatingUserStatus();
        
        // 更新UI
        this.elements.userStatus.style.display = 'none';
        this.elements.authToggle.style.display = 'flex';
        this.showLogin();
        
        // 触发用户状态变化事件
        this.triggerEvent('userLogout');
    },
    
    /**
     * 显示加载状态
     */
    showLoading() {
        document.getElementById('auth-loading').style.display = 'flex';
    },
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        document.getElementById('auth-loading').style.display = 'none';
    },
    
    /**
     * 显示错误信息
     */
    showError(message) {
        const errorElement = document.getElementById('auth-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    },
    
    /**
     * 隐藏错误信息
     */
    hideError() {
        document.getElementById('auth-error').style.display = 'none';
    },
    
    /**
     * 显示成功信息
     */
    showSuccess(message) {
        // 临时显示成功信息
        const successElement = document.createElement('div');
        successElement.className = 'auth-success';
        successElement.textContent = message;
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        
        document.body.appendChild(successElement);
        
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.parentNode.removeChild(successElement);
            }
        }, 3000);
    },
    
    /**
     * 触发自定义事件
     */
    triggerEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    },
    
    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return this.currentUser;
    },
    
    /**
     * 显示塔罗牌界面（渐进式）
     */
    showTarotInterface() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            // 先显示元素，然后淡入
            mainContent.style.display = 'block';
            
            // 使用 requestAnimationFrame 确保显示后再开始动画
            requestAnimationFrame(() => {
                mainContent.style.opacity = '1';
            });
        }
        
        console.log('塔罗牌界面已显示');
    },
    
    /**
     * 隐藏塔罗牌界面（渐进式）
     */
    hideTarotInterface() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            // 先淡出，然后隐藏
            mainContent.style.opacity = '0';
            
            // 等待动画完成后隐藏元素
            setTimeout(() => {
                mainContent.style.display = 'none';
            }, 300); // 与CSS过渡时间匹配
        }
        
        console.log('塔罗牌界面已隐藏');
    },
    
    /**
     * 创建响应式浮动用户状态栏
     */
    createFloatingUserStatus() {
        // 移除可能存在的旧状态栏
        this.removeFloatingUserStatus();
        
        // 创建浮动用户状态栏
        const floatingStatus = document.createElement('div');
        floatingStatus.id = 'floating-user-status';
        floatingStatus.className = 'floating-user-status';
        floatingStatus.innerHTML = `
            <div class="user-info-compact">
                <div class="user-avatar-small">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="5" fill="currentColor"/>
                        <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="user-email-compact"></div>
                <button class="logout-btn-compact" type="button" title="登出">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(floatingStatus);
        
        // 更新用户信息
        floatingStatus.querySelector('.user-email-compact').textContent = this.currentUser.email;
        
        // 绑定登出事件
        floatingStatus.querySelector('.logout-btn-compact').addEventListener('click', () => {
            this.handleLogout();
        });
        
        // 隐藏原始认证容器
        this.elements.authContainer.style.display = 'none';
        
        console.log('浮动用户状态栏已创建');
    },
    
    /**
     * 移除响应式浮动用户状态栏
     */
    removeFloatingUserStatus() {
        const floatingStatus = document.getElementById('floating-user-status');
        if (floatingStatus) {
            floatingStatus.remove();
        }
        
        // 显示原始认证容器
        this.elements.authContainer.style.display = 'block';
        
        console.log('浮动用户状态栏已移除');
    },
    
    /**
     * 检查是否已登录
     */
    isLoggedIn() {
        return this.isAuthenticated;
    }
};
