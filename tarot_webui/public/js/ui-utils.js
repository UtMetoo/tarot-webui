/**
 * UI工具函数模块
 * 处理界面元素的显示控制、状态管理和内容更新
 */
class UIUtils {
    /**
     * 显示元素
     */
    static showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    /**
     * 隐藏元素
     */
    static hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }

    /**
     * 显示加载状态
     */
    static showLoading() {
        this.hideElement('resultArea');
        this.showElement('loadingState');
        
        // 禁用提交按钮
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        const loading = document.getElementById('loadingState');
        if (loading) loading.setAttribute('aria-busy', 'true');
    }

    /**
     * 隐藏加载状态
     */
    static hideLoading() {
        this.hideElement('loadingState');
        
        // 启用提交按钮
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
        const loading = document.getElementById('loadingState');
        if (loading) loading.setAttribute('aria-busy', 'false');
    }

    /**
     * 显示结果
     */
    static showResult() {
        this.showElement('resultArea');
        // 确保卡片区域也可见
        this.showElement('cardArea');
    }

    /**
     * 更新卡片信息显示
     */
    static updateCardInfo(content) {
        const cardArea = document.getElementById('cardArea');
        if (cardArea) {
            console.log('开始更新卡片信息:', content);
            
            // 处理带有"卡片信息："前缀的内容
            if (typeof content === 'string' && content.includes('卡片信息：')) {
                content = content.replace('卡片信息：', '').trim();
                console.log('移除前缀后的内容:', content);
            }
            
            try {
                // 尝试解析JSON格式的卡片信息
                const cards = JSON.parse(content);
                console.log('解析的卡片数据:', cards);
                
                if (Array.isArray(cards) && cards.length > 0) {
                    const cardsHTML = cards.map(card => `
                        <div class="card-item">
                            <div class="card-image">
                                <div class="image-loading">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                                            <animate attributeName="stroke-dasharray" values="0 31.416;15.708 15.708;0 31.416" dur="1.5s" repeatCount="indefinite"/>
                                        </svg>
                                    </div>
                                <img src="${card.url}" alt="${card.name_cn}" 
                                     onload="this.parentElement.classList.add('loaded')" 
                                     onerror="this.parentElement.classList.add('error')">
                                <div class="image-error">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9ca3af" stroke-width="2"/>
                                        <path d="M9 9L15 15" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
                                        <path d="M15 9L9 15" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                    <span>图片加载失败</span>
                                </div>
                            </div>
                            <div class="card-info">
                                <h4>${card.name_cn}</h4>
                                <p class="card-name-en">${card.name_en}</p>
                                <p class="card-type">${card.type}</p>
                            </div>
                        </div>
                    `).join('');
                    
                    console.log('生成的HTML:', cardsHTML);
                    
                    cardArea.innerHTML = `
                        <div class="cards-container">
                            ${cardsHTML}
                        </div>
                    `;
                    
                    // 显示卡片区域
                    this.showElement('cardArea');
                    console.log('卡片信息更新完成');
                } else {
                    console.log('卡片数据不是数组或为空');
                    cardArea.innerHTML = `<div class="card-content">${content}</div>`;
                }
            } catch (e) {
                console.log('卡片信息解析失败:', e);
                // 如果不是JSON格式，直接显示内容
                cardArea.innerHTML = `<div class="card-content">${content}</div>`;
            }
        } else {
            console.error('找不到cardArea元素');
        }
    }

    /**
     * 更新解析信息显示
     */
    static updateAnalysisInfo(content) {
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
            console.log('开始更新解析信息:', content);
            
            // 渲染Markdown格式的内容
            const formattedContent = MarkdownRenderer.render(content);
            resultArea.innerHTML = `
                <div class="tarot-result">
                    <div class="result-content markdown-content">${formattedContent}</div>
                </div>
            `;
            this.showElement('resultArea');
        }
    }

    /**
     * 显示错误信息
     */
    static showError(message) {
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
            resultArea.innerHTML = `
                <div class="error-message">
                    <h3>❌ 出现错误</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-btn">重新开始</button>
                </div>
            `;
            this.showElement('resultArea');
        }
        this.hideLoading();
    }
}

// 暴露到全局，供其他模块使用
window.UIUtils = UIUtils;
