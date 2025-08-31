/**
 * Markdown渲染器模块 - 基于marked库
 * 处理塔罗牌解读内容的Markdown格式渲染
 * 支持标题、粗体、斜体、列表、链接、Mermaid图表等格式
 */
class MarkdownRenderer {
    /**
     * 初始化marked配置
     */
    static init() {
        if (typeof marked === "undefined") {
            console.error("marked库未加载");
            return;
        }
        
        // 配置marked选项
        marked.setOptions({
            breaks: true,  // 支持换行符
            gfm: true,     // GitHub风格Markdown
            sanitize: false // 允许HTML标签
        });

        // 自定义渲染器，处理链接的target属性
        const renderer = new marked.Renderer();
        renderer.link = function(href, title, text) {
            return `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ""}>${text}</a>`;
        };

        marked.use({ renderer });
    }

    /**
     * 渲染Markdown文本
     * 保持与现有API完全兼容
     * @param {string} markdown - 输入的Markdown文本
     * @returns {string} 渲染后的HTML
     */
    static render(markdown) {
        if (!markdown || typeof markdown !== "string") {
            return "";
        }

        // 确保marked已初始化
        if (typeof marked === "undefined") {
            console.error("marked库未加载");
            return markdown;
        }

        let html = markdown;

        // 1. 先处理Mermaid代码块，避免marked处理
        html = this.processMermaidBlocks(html);

        // 2. 使用marked处理标准Markdown
        html = marked.parse(html);

        // 3. 后处理：清理和优化
        html = this.postProcess(html);

        return html;
    }

    /**
     * 处理Mermaid代码块
     * 保持与现有实现相同
     */
    static processMermaidBlocks(html) {
        return html.replace(/```mermaid\s*([\s\S]*?)```/g, (match, content) => {
            const id = "mermaid-" + Math.random().toString(36).substr(2, 9);
            return `<div class="mermaid" id="${id}">${content.trim()}</div>`;
        });
    }

    /**
     * 后处理：清理和优化HTML
     */
    static postProcess(html) {
        return html
            // 清理多余的br标签
            .replace(/<br>\s*<\/([h1-6|p|ul|ol|li])>/g, "</$1>")
            .replace(/<([h1-6|p|ul|ol|li])([^>]*)><br>/g, "<$1$2>")
            .replace(/<p><br>/g, "<p>")
            .replace(/<br><\/p>/g, "</p>");
    }

    /**
     * 获取支持的格式列表
     */
    static getSupportedFormats() {
        return {
            headers: ["#", "##", "###", "####", "#####", "######"],
            emphasis: ["**bold**", "*italic*", "~~strikethrough~~"],
            lists: ["1. ordered", "- unordered", "+ unordered"],
            links: ["[text](url)", "[text](url \"title\")"],
            code: ["`inline`", "```block```"],
            mermaid: ["```mermaid ... ```"],
            tables: ["| Header | Header |\n|--------|--------|\n| Cell | Cell |"],
            blockquotes: ["> quote"],
            horizontal_rules: ["---", "***", "___"]
        };
    }
}

// 暴露到全局，保持与现有代码兼容
window.MarkdownRenderer = MarkdownRenderer;

// 自动初始化
if (typeof marked !== "undefined") {
    MarkdownRenderer.init();
} else {
    // 如果marked未加载，等待加载完成后初始化
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof marked !== "undefined") {
            MarkdownRenderer.init();
        }
    });
}
