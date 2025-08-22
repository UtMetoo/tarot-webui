/**
 * Cookie工具函数
 */

/**
 * 解析Cookie字符串
 * @param {string} cookieString - Cookie字符串
 * @returns {Object} 解析后的Cookie对象
 */
export function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;

  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * 设置Cookie
 * @param {Object} res - 响应对象
 * @param {string} name - Cookie名称
 * @param {string} value - Cookie值
 * @param {Object} options - Cookie选项
 */
export function setCookie(res, name, value, options = {}) {
  const {
    maxAge = 7 * 24 * 60 * 60 * 1000, // 7天
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
    path = '/',
    domain
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (maxAge) cookieString += `; Max-Age=${Math.floor(maxAge / 1000)}`;
  if (httpOnly) cookieString += '; HttpOnly';
  if (secure) cookieString += '; Secure';
  if (sameSite) cookieString += `; SameSite=${sameSite}`;
  if (path) cookieString += `; Path=${path}`;
  if (domain) cookieString += `; Domain=${domain}`;

  res.setHeader('Set-Cookie', cookieString);
}

/**
 * 清除Cookie
 * @param {Object} res - 响应对象
 * @param {string} name - Cookie名称
 * @param {Object} options - Cookie选项
 */
export function clearCookie(res, name, options = {}) {
  setCookie(res, name, '', {
    ...options,
    maxAge: 0,
    expires: new Date(0)
  });
}

/**
 * 从请求中获取Cookie
 * @param {Object} req - 请求对象
 * @returns {Object} Cookie对象
 */
export function getCookies(req) {
  const cookieHeader = req.headers.cookie;
  return parseCookies(cookieHeader);
}



