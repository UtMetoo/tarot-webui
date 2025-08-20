// 调试API端点 - 检查环境变量配置
export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // 只允许GET请求
    if (req.method !== 'GET') {
      return res.status(405).json({ error: '只支持GET请求' });
    }
  
    try {
      const apiKey = process.env.COZE_API_KEY;
      const workflowId = process.env.COZE_WORKFLOW_ID;
      
      const debugInfo = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        hasApiKey: !!apiKey,
        hasWorkflowId: !!workflowId,
        workflowId: workflowId,
        apiKeyLength: apiKey ? apiKey.length : 0,
        allEnvVars: Object.keys(process.env).filter(key => 
          key.includes('COZE') || key.includes('VERCEL')
        )
      };
      
      console.log('调试信息:', debugInfo);
      
      res.status(200).json(debugInfo);
      
    } catch (error) {
      console.error('调试API错误:', error);
      res.status(500).json({ 
        error: '调试API错误',
        message: error.message 
      });
    }
  }
