import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';

// 飞书API配置
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const FEISHU_BITABLE_APP_TOKEN = process.env.FEISHU_BITABLE_APP_TOKEN;
const FEISHU_BITABLE_TABLE_ID = process.env.FEISHU_BITABLE_TABLE_ID;

// 缓存tenant_access_token
let cachedToken = null;
let tokenExpireTime = 0;

/**
 * 获取 tenant_access_token
 * 实现通过 FEISHU_APP_ID / FEISHU_APP_SECRET 获取并缓存 token
 */
export async function getTenantAccessToken() {
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
 * 使用 FEISHU_BITABLE_APP_TOKEN / FEISHU_BITABLE_TABLE_ID 查询记录
 */
export async function findUserByEmail(email) {
  try {
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

    return data.data.items.length > 0 ? data.data.items[0] : null;
  } catch (error) {
    console.error('查询用户错误:', error);
    return null;
  }
}

/**
 * 在多维表格中创建用户
 * 写入 email / password_hash / created_at 等字段
 */
export async function createUser({ email, passwordHash }) {
  try {
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
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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
 * 用主键或唯一字段查询多维表
 */
export async function getUserById(userId) {
  try {
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

    return {
      userId: data.data.record_id,
      email: data.data.fields.email,
      createdAt: data.data.fields.created_at,
      updatedAt: data.data.fields.updated_at,
    };
  } catch (error) {
    console.error('获取用户错误:', error);
    return null;
  }
}

/**
 * 校验密码
 * 使用 bcrypt 进行加盐哈希与校验
 */
export async function verifyPassword(plain, passwordHash) {
  try {
    return await bcrypt.compare(plain, passwordHash);
  } catch (error) {
    console.error('密码验证错误:', error);
    return false;
  }
}

/**
 * 生成密码哈希
 * 使用 bcrypt 进行加盐哈希
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



