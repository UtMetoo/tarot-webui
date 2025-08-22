import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 生成JWT令牌
 * @param {Object} payload - 令牌载荷
 * @param {string} payload.userId - 用户ID
 * @param {string} payload.email - 用户邮箱
 * @returns {string} JWT令牌
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT令牌
 * @param {string} token - JWT令牌
 * @returns {Object|null} 解码后的载荷或null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * 从请求头中提取JWT令牌
 * @param {Object} req - 请求对象
 * @returns {string|null} JWT令牌或null
 */
export function extractTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 从Cookie中提取JWT令牌
 * @param {Object} req - 请求对象
 * @returns {string|null} JWT令牌或null
 */
export function extractTokenFromCookie(req) {
  return req.cookies?.authToken || null;
}
