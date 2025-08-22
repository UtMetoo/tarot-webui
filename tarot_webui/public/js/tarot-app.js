/**
 * 塔罗牌占卜应用核心逻辑
 * 处理表单提交、API调用、流式响应等主要业务逻辑
 */
class TarotApp {
    constructor() {
        // 初始化城市管理器
        this.citiesManager = new CitiesManager();
        
        // 初始化应用
        this.init();
        
        // 绑定事件
        this.bindEvents();
    }

    /**
     * 初始化应用
     */
    init() {
        // 设置当前日期为默认生日
        const today = new Date();
        const birthdayInput = document.getElementById('birthday');
        if (birthdayInput) {
            // 设置为25年前的今天作为默认生日
            const defaultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
            birthdayInput.value = defaultDate.toISOString().split('T')[0];
        }

        // 初始化城市选择器
        this.citiesManager.initCitySelector();
        
        // 隐藏加载状态和结果区域
        UIUtils.hideElement('loadingState');
        UIUtils.hideElement('resultArea');

        // 初始 ARIA 状态
        const loading = document.getElementById('loadingState');
        if (loading) loading.setAttribute('aria-busy', 'false');
        const citySearch = document.getElementById('citySearch');
        if (citySearch) citySearch.setAttribute('aria-expanded', 'false');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 表单提交事件
        const form = document.getElementById('tarotForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // 绑定城市选择器事件
        this.citiesManager.bindEvents();
    }

    /**
     * 处理表单提交
     */
    async handleSubmit(event) {
        event.preventDefault();

        // 收集表单数据
        const formData = this.collectFormData();
        
        // 验证表单数据
        if (!this.validateFormData(formData)) {
            return;
        }

        // 显示加载状态
        UIUtils.showLoading();

        try {
            // 调用API
            await this.callTarotAPI(formData);
        } catch (error) {
            console.error('塔罗牌占卜错误:', error);
            UIUtils.showError('占卜过程中出现错误，请稍后重试');
        }
    }

    /**
     * 收集表单数据
     */
    collectFormData() {
        const birthday = document.getElementById('birthday').value;
        const birthtime = document.getElementById('birthtime').value;
        const genderSelect = document.getElementById('genderSelect');
        const gender = genderSelect ? genderSelect.value : '';
        const city = document.getElementById('citySearch').value;
        const question = document.getElementById('question').value;

        // 合并日期和时间
        const birthdayDateTime = `${birthday} ${birthtime}`;

        return {
            birthday: birthdayDateTime,
            gender,
            city,
            question
        };
    }

    /**
     * 验证表单数据
     */
    validateFormData(data) {
        if (!data.birthday || !data.gender || !data.city || !data.question) {
            UIUtils.showError('请填写所有必需信息');
            return false;
        }

        if (data.question.length < 5) {
            UIUtils.showError('问题描述过于简短，请详细描述您想要占卜的问题');
            return false;
        }

        // 验证城市是否在列表中
        if (!this.citiesManager.validateCity(data.city)) {
            UIUtils.showError('请从下拉列表中选择一个有效的城市');
            return false;
        }

        return true;
    }

    /**
     * 调用塔罗牌API
     */
    async callTarotAPI(formData) {
        try {
            console.log('发送API请求:', { ...formData, question: formData.question.substring(0, 50) + '...' });
            
            const response = await fetch('/api/tarot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('API响应状态:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                    if (errorData.details) {
                        console.error('错误详情:', errorData.details);
                    }
                } catch (e) {
                    // 忽略JSON解析错误
                }
                throw new Error(errorMessage);
            }

            // 处理流式响应
            await this.handleStreamResponse(response);

        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        }
    }

    /**
     * 处理流式响应
     */
    async handleStreamResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let cardInfo = '';
        let analysisInfo = '';
        let hasAnyData = false;

        // 显示结果区域
        UIUtils.showResult();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                console.log('收到数据块:', chunk.substring(0, 100) + '...');
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            console.log('解析数据:', data);
                            
                            if (data.content) {
                                hasAnyData = true;
                                
                                // 检查是否有错误信息
                                if (data.error) {
                                    console.error('服务器返回错误:', data.error);
                                    throw new Error(data.error);
                                }
                                
                                // 根据节点标题判断内容类型
                                if (data.node_title === '塔罗卡片展示') {
                                    cardInfo = data.content;
                                    console.log('收到卡片信息:', cardInfo);
                                    UIUtils.updateCardInfo(cardInfo);
                                } else if (data.content && typeof data.content === 'string' && 
                                          (data.content.includes('卡片信息：') || 
                                           data.content.includes('"name_cn"') && 
                                           data.content.includes('"url"'))) {
                                    // 检测卡片信息格式
                                    cardInfo = data.content;
                                    console.log('检测到卡片信息:', cardInfo);
                                    UIUtils.updateCardInfo(cardInfo);
                                } else if (data.node_title === 'End') {
                                    // 解析End节点的JSON内容
                                    try {
                                        const endData = JSON.parse(data.content);
                                        analysisInfo = endData.output || data.content;
                                        UIUtils.updateAnalysisInfo(analysisInfo);
                                    } catch (e) {
                                        analysisInfo = data.content;
                                        UIUtils.updateAnalysisInfo(analysisInfo);
                                    }
                                } else if (!data.node_title) {
                                    // 如果没有节点标题，直接作为分析内容处理
                                    analysisInfo = data.content;
                                    UIUtils.updateAnalysisInfo(analysisInfo);
                                }
                            }
                        } catch (e) {
                            console.log('跳过无效JSON行:', line, e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
            UIUtils.hideLoading();
        }

        if (!hasAnyData) {
            throw new Error('未收到任何有效数据，请检查API配置');
        }
        
        if (!cardInfo && !analysisInfo) {
            throw new Error('占卜结果格式异常，请稍后重试');
        }
    }
}

// 暴露到全局，供其他模块使用
window.TarotApp = TarotApp;
