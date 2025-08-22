// 注册接口（骨架版）
import { getTenantAccessToken, findUserByEmail, createUser, hashPassword } from '../_utils/feishu.js';
import { generateToken } from '../_utils/jwt.js';
import { setCookie, getCookies } from '../_utils/cookies.js';

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
function validatePassword(password) {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位' };
  }
  if (password.length > 50) {
    return { valid: false, message: '密码长度不能超过50位' };
  }
  return { valid: true };
}

function json(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, {});
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });

  try {
    const { email, password } = req.body || {};
    
    // 参数验证
    if (!email || !password) {
      return json(res, 400, { error: '缺少 email 或 password' });
    }

    // 邮箱格式验证
    if (!isValidEmail(email)) {
      return json(res, 400, { error: '邮箱格式不正确' });
    }

    // 密码强度验证
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return json(res, 400, { error: passwordValidation.message });
    }

    // 检查用户是否已存在
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return json(res, 409, { error: '该邮箱已被注册' });
    }

    // 生成密码哈希
    const passwordHash = await hashPassword(password);
    
    // 创建用户
    const { userId } = await createUser({ email, passwordHash });

    // 生成JWT令牌
    const token = generateToken({ userId, email });

    // 设置Cookie
    setCookie(res, 'authToken', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return json(res, 201, { 
      message: '注册成功',
      user: { userId, email },
      token
    });
  } catch (err) {
    console.error('注册错误:', err);
    return json(res, 500, { error: '服务器错误', message: err.message });
  }
}



