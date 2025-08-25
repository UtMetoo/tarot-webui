import bcrypt from 'bcryptjs';

// 动态导入node-fetch
let fetch;
(async () => {
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
})();

// 飞书API配置
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const FEISHU_BITABLE_APP_TOKEN = process.env.FEISHU_BITABLE_APP_TOKEN;
const FEISHU_BITABLE_TABLE_ID = process.env.FEISHU_BITABLE_TABLE_ID;

// 缓存tenant_access_token
let cachedToken = null;
let tokenExpireTime = 0;

/**
 * 确保fetch已加载
 */
async function ensureFetch() {
  if (!fetch) {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
  }
}

/**
 * 处理飞书多维表格字段数据
 * @param {Object} fields - 飞书API返回的字段数据
 * @returns {Object} 标准化的用户数据
 */
function processFeishuFields(fields) {
  // 提取邮箱信息
  const email = fields.email?.[0]?.text || fields.email?.[0]?.link || '';
  
  // 提取密码哈希，支持多种格式
  const passwordHash = fields.password_hash?.[0]?.text || 
                      (typeof fields.password_hash === 'string' ? fields.password_hash : null);
  
  return {
    email,
    passwordHash,
    createdAt: fields.created_at,
    updatedAt: fields.updated_at,
  };
}

/**
 * 获取 tenant_access_token
 */
export async function getTenantAccessToken() {
  await ensureFetch();

  // 检查缓存是否有效
  if (cachedToken && Date.now() < tokenExpireTime) {
    return cachedToken;
  }

  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    });

    const data = await response.json();
    
    if (data.code !== 0) {
      throw new Error(`获取tenant_access_token失败: ${data.msg}`);
    }

    // 缓存token，提前5分钟过期
    cachedToken = data.tenant_access_token;
    tokenExpireTime = Date.now() + (data.expire - 300) * 1000;

    return cachedToken;
  } catch (error) {
    console.error('获取tenant_access_token错误:', error);
    throw error;
  }
}

/**
 * 在多维表格中根据邮箱查询用户
 * @param {string} email - 用户邮箱
 * @returns {Object|null} 用户信息或null
 */
export async function findUserByEmail(email) {
  try {
    await ensureFetch();
    const token = await getTenantAccessToken();
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${FEISHU_BITABLE_TABLE_ID}/records?filter=CurrentValue.[email]="${email}"`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (data.code !== 0) {
      console.error('查询用户失败:', data);
      return null;
    }

    if (data.data.items.length === 0) {
      return null;
    }

    // 处理飞书多维表格的字段格式
    const item = data.data.items[0];
    const processedFields = processFeishuFields(item.fields);
    
    return {
      userId: item.record_id,
      ...processedFields,
    };
  } catch (error) {
    console.error('查询用户错误:', error);
    return null;
  }
}

/**
 * 在多维表格中创建用户
 * @param {Object} params - 用户参数
 * @param {string} params.email - 用户邮箱
 * @param {string} params.passwordHash - 密码哈希
 * @returns {Object} 创建结果
 */
export async function createUser({ email, passwordHash }) {
  try {
    await ensureFetch();
    const token = await getTenantAccessToken();
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${FEISHU_BITABLE_TABLE_ID}/records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            email: email,
            password_hash: passwordHash,
            created_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
            updated_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          },
        }),
      }
    );

    const data = await response.json();
    
    if (data.code !== 0) {
      throw new Error(`创建用户失败: ${data.msg}`);
    }

    return { userId: data.data.record_id };
  } catch (error) {
    console.error('创建用户错误:', error);
    throw error;
  }
}

/**
 * 根据会话中的 userId 查询用户资料
 * @param {string} userId - 用户ID
 * @returns {Object|null} 用户信息或null
 */
export async function getUserById(userId) {
  try {
    await ensureFetch();
    const token = await getTenantAccessToken();
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${FEISHU_BITABLE_TABLE_ID}/records/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (data.code !== 0) {
      console.error('获取用户失败:', data);
      return null;
    }

    // 处理飞书多维表格的字段格式
    const processedFields = processFeishuFields(data.data.fields);
    
    return {
      userId: data.data.record_id,
      ...processedFields,
    };
  } catch (error) {
    console.error('获取用户错误:', error);
    return null;
  }
}

/**
 * 获取用户密码哈希
 * @param {string} userId - 用户ID
 * @returns {string|null} 密码哈希或null
 */
export async function getUserPasswordHash(userId) {
  try {
    await ensureFetch();
    const token = await getTenantAccessToken();
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${FEISHU_BITABLE_TABLE_ID}/records/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (data.code !== 0) {
      console.error('获取用户密码哈希失败:', data);
      return null;
    }

    // 处理飞书多维表格的字段格式
    const processedFields = processFeishuFields(data.data.fields);
    return processedFields.passwordHash;
  } catch (error) {
    console.error('获取用户密码哈希错误:', error);
    return null;
  }
}

/**
 * 校验密码
 * @param {string} plain - 明文密码
 * @param {string} passwordHash - 密码哈希
 * @returns {boolean} 验证结果
 */
export async function verifyPassword(plain, passwordHash) {
  try {
    // 类型检查
    if (!plain || typeof plain !== 'string') {
      console.error('密码验证错误: plain password 不是字符串', { type: typeof plain });
      return false;
    }
    
    if (!passwordHash || typeof passwordHash !== 'string') {
      console.error('密码验证错误: passwordHash 不是字符串', { type: typeof passwordHash });
      return false;
    }
    
    return await bcrypt.compare(plain, passwordHash);
  } catch (error) {
    console.error('密码验证错误:', error);
    return false;
  }
}

/**
 * 生成密码哈希
 * @param {string} plain - 明文密码
 * @returns {string} 密码哈希
 */
export async function hashPassword(plain) {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(plain, saltRounds);
  } catch (error) {
    console.error('密码哈希错误:', error);
    throw error;
  }
}