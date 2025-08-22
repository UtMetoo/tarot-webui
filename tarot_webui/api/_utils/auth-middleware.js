import { verifyToken, extractTokenFromHeader } from './jwt.js';
import { getCookies } from './cookies.js';

/**
 * 认证中间件
 * @param {Function} handler - 原始处理函数
 * @returns {Function} 包装后的处理函数
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      // 从请求头或Cookie中获取令牌
      let token = extractTokenFromHeader(req);
      
      if (!token) {
        const cookies = getCookies(req);
        token = cookies.authToken;
      }

      if (!token) {
        return res.status(401).json({ error: '未提供认证令牌' });
      }

      // 验证令牌
      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ error: '无效的认证令牌' });
      }

      // 将用户信息添加到请求对象
      req.user = payload;
      
      // 调用原始处理函数
      return handler(req, res);
    } catch (error) {
      console.error('认证中间件错误:', error);
      return res.status(500).json({ error: '服务器错误' });
    }
  };
}

/**
 * 可选认证中间件（不强制要求登录）
 * @param {Function} handler - 原始处理函数
 * @returns {Function} 包装后的处理函数
 */
export function withOptionalAuth(handler) {
  return async (req, res) => {
    try {
      // 从请求头或Cookie中获取令牌
      let token = extractTokenFromHeader(req);
      
      if (!token) {
        const cookies = getCookies(req);
        token = cookies.authToken;
      }

      if (token) {
        // 验证令牌
        const payload = verifyToken(token);
        if (payload) {
          // 将用户信息添加到请求对象
          req.user = payload;
        }
      }
      
      // 调用原始处理函数
      return handler(req, res);
    } catch (error) {
      console.error('可选认证中间件错误:', error);
      // 继续执行，不阻止请求
      return handler(req, res);
    }
  };
}
