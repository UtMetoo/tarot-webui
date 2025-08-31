/**
 * Markdown渲染器模块
 * 处理塔罗牌解读内容的Markdown格式渲染
 * 支持标题、粗体、斜体、列表、链接、Mermaid图表等格式
 */
class MarkdownRenderer {
    /**
     * 增强的Markdown渲染器
     * 支持标题、粗体、斜体、列表、链接、Mermaid图表等基本格式
     */
    static render(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        let html = markdown;

        // 先处理Mermaid代码块，避免其他格式化影响
        html = this.processMermaidBlocks(html);

        // 处理普通代码块
        html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 处理标题 (### ## #)
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // 处理粗体 **text** (避免与斜体冲突)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 处理斜体 *text* (使用更简单的方法)
        // 先标记已处理的强调文本，避免重复处理
        html = html.replace(/<strong>(.*?)<\/strong>/g, '[[STRONG]]$1[[/STRONG]]');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/\[\[STRONG\]\](.*?)\[\[\/STRONG\]\]/g, '<strong>$1</strong>');

        // 处理链接 [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // 处理换行符（在列表处理之前），但排除列表项和Mermaid代码块
        html = this.processLineBreaks(html);

        // 处理无序列表
        html = this.processUnorderedLists(html);

        // 处理有序列表
        html = this.processOrderedLists(html);

        // 处理段落
        html = this.processParagraphs(html);

        // 清理多余的br标签
        html = this.cleanupBreakTags(html);

        return html;
    }

    /**
     * 处理Mermaid代码块
     */
    static processMermaidBlocks(html) {
        return html.replace(/```mermaid\s*([\s\S]*?)```/g, (match, content) => {
            const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
            return `<div class="mermaid" id="${id}">${content.trim()}</div>`;
        });
    }

    /**
     * 处理换行符，但排除Mermaid代码块和列表项
     */
    static processLineBreaks(html) {
        // 使用正则表达式匹配Mermaid代码块，并临时替换为占位符
        const mermaidBlocks = [];
        let blockIndex = 0;
        
        html = html.replace(/<div class="mermaid" id="[^"]*">([\s\S]*?)<\/div>/g, (match, content) => {
            const placeholder = `__MERMAID_BLOCK_${blockIndex}__`;
            mermaidBlocks[blockIndex] = match;
            blockIndex++;
            return placeholder;
        });

        // 临时标记列表项，避免在列表项之间添加<br>
        const lines = html.split('\n');
        let processedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isOrderedItem = /^\d+\. (.*)$/.test(line);
            const isUnorderedItem = /^- (.*)$/.test(line);
            
            if (isOrderedItem || isUnorderedItem) {
                // 列表项不添加<br>，保持原样
                processedLines.push(line);
            } else {
                // 非列表项，将换行符替换为<br>
                processedLines.push(line.replace(/\n/g, '<br>'));
            }
        }
        
        html = processedLines.join('\n');
        
        // 恢复Mermaid代码块
        mermaidBlocks.forEach((block, index) => {
            html = html.replace(`__MERMAID_BLOCK_${index}__`, block);
        });
        
        return html;
    }

    /**
     * 处理无序列表 - item
     */
    static processUnorderedLists(html) {
        // 先按<br>分割，然后按\n分割，确保能处理所有情况
        const lines = html.split(/<br>\s*\n|\n|<br>/);
        let inList = false;
        let processedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const isListItem = /^- (.*)$/.test(line);
            
            if (isListItem && !inList) {
                // 开始新列表
                processedLines.push('<ul>');
                processedLines.push(`<li>${line.replace(/^- /, '')}</li>`);
                inList = true;
            } else if (isListItem && inList) {
                // 继续列表项
                processedLines.push(`<li>${line.replace(/^- /, '')}</li>`);
            } else if (!isListItem && inList) {
                // 结束列表
                processedLines.push('</ul>');
                if (line) {
                    processedLines.push(line);
                }
                inList = false;
            } else {
                // 普通行
                if (line) {
                    processedLines.push(line);
                }
            }
        }
        
        // 如果最后还在列表中，关闭列表
        if (inList) {
            processedLines.push('</ul>');
        }

        return processedLines.join('\n');
    }

    /**
     * 处理有序列表 1. item
     */
    static processOrderedLists(html) {
        // 先按<br>分割，然后按\n分割，确保能处理所有情况
        const lines = html.split(/<br>\s*\n|\n|<br>/);
        let inOrderedList = false;
        let orderedProcessedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const isOrderedItem = /^\d+\. (.*)$/.test(line);
            
            if (isOrderedItem && !inOrderedList) {
                // 开始新有序列表
                orderedProcessedLines.push('<ol>');
                orderedProcessedLines.push(`<li>${line.replace(/^\d+\. /, '')}</li>`);
                inOrderedList = true;
            } else if (isOrderedItem && inOrderedList) {
                // 继续有序列表项
                orderedProcessedLines.push(`<li>${line.replace(/^\d+\. /, '')}</li>`);
            } else if (!isOrderedItem && inOrderedList) {
                // 结束有序列表
                orderedProcessedLines.push('</ol>');
                if (line) {
                    orderedProcessedLines.push(line);
                }
                inOrderedList = false;
            } else {
                // 普通行
                if (line) {
                    orderedProcessedLines.push(line);
                }
            }
        }
        
        // 如果最后还在有序列表中，关闭列表
        if (inOrderedList) {
            orderedProcessedLines.push('</ol>');
        }

        return orderedProcessedLines.join('\n');
    }

    /**
     * 处理段落（将连续的非空行包装在<p>标签中）
     */
    static processParagraphs(html) {
        const paragraphLines = html.split('\n');
        let paragraphProcessedLines = [];
        let inParagraph = false;
        
        for (let i = 0; i < paragraphLines.length; i++) {
            const line = paragraphLines[i].trim();
            const isSpecialElement = /^<(h[1-6]|ul|ol|li|\/ul|\/ol)/.test(line);
            
            if (line === '') {
                if (inParagraph) {
                    paragraphProcessedLines.push('</p>');
                    inParagraph = false;
                }
                paragraphProcessedLines.push('');
            } else if (isSpecialElement) {
                if (inParagraph) {
                    paragraphProcessedLines.push('</p>');
                    inParagraph = false;
                }
                paragraphProcessedLines.push(line);
            } else {
                if (!inParagraph) {
                    paragraphProcessedLines.push('<p>');
                    inParagraph = true;
                }
                paragraphProcessedLines.push(line);
            }
        }
        
        if (inParagraph) {
            paragraphProcessedLines.push('</p>');
        }

        return paragraphProcessedLines.join('\n');
    }

    /**
     * 清理多余的br标签
     */
    static cleanupBreakTags(html) {
        html = html.replace(/<br>\s*<\/([h1-6|p|ul|ol|li])>/g, '</$1>');
        html = html.replace(/<([h1-6|p|ul|ol|li])([^>]*)><br>/g, '<$1$2>');
        html = html.replace(/<p><br>/g, '<p>');
        html = html.replace(/<br><\/p>/g, '</p>');
        return html;
    }
}

// 暴露到全局，供其他模块使用
window.MarkdownRenderer = MarkdownRenderer;