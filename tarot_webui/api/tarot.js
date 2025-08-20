// Vercel Serverless Function for Tarot API
// 处理塔罗牌占卜请求，避免前端直接暴露API密钥

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // 只允许POST请求
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '只支持POST请求' });
    }
  
    try {
      const { birthday, gender, city, question } = req.body;
  
      // 验证必需参数
      if (!birthday || !gender || !city || !question) {
        return res.status(400).json({ 
          error: '缺少必需参数',
          required: ['birthday', 'gender', 'city', 'question']
        });
      }
  
      // 从环境变量获取配置
      const apiKey = process.env.COZE_API_KEY;
      const workflowId = process.env.COZE_WORKFLOW_ID;
  
      if (!apiKey || !workflowId) {
        return res.status(500).json({ 
          error: 'API配置错误，请联系管理员' 
        });
      }
  
      // 调用Coze API
      const response = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          parameters: {
            birthday,
            gender,
            city,
            question
          }
        })
      });
  
      if (!response.ok) {
        throw new Error(`Coze API错误: ${response.status} ${response.statusText}`);
      }
  
      // 返回流式响应
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
  
      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
  
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  res.write(`data: ${JSON.stringify(data)}\n\n`);
                }
              } catch (e) {
                // 忽略无效的JSON行
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
  
      res.end();
  
    } catch (error) {
      console.error('塔罗牌API错误:', error);
      res.status(500).json({ 
        error: '服务器内部错误',
        message: error.message 
      });
    }
  }