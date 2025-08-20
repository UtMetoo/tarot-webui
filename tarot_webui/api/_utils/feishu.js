// 飞书多维表格与鉴权相关工具（骨架版）
// 说明：本文件仅提供函数签名与 TODO 提示，便于后续迭代实现

/**
 * 获取 tenant_access_token
 * TODO: 实现通过 FEISHU_APP_ID / FEISHU_APP_SECRET 获取并缓存 token
 */
export async function getTenantAccessToken() {
	// TODO: 调用飞书开放平台获取 tenant_access_token，并在内存或 KV 中缓存
	// 参考：https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
	throw new Error('TODO: getTenantAccessToken');
}

/**
 * 在多维表格中根据邮箱查询用户
 * TODO: 使用 FEISHU_BITABLE_APP_TOKEN / FEISHU_BITABLE_TABLE_ID 查询记录
 */
export async function findUserByEmail(email) {
	// TODO: 查询多维表，返回用户记录或 null
	return null;
}

/**
 * 在多维表格中创建用户
 * TODO: 写入 email / password_hash / created_at 等字段
 */
export async function createUser({ email, passwordHash }) {
	// TODO: 写入记录并返回新用户的主键（如 record_id）
	return { userId: 'TODO_RECORD_ID' };
}

/**
 * 根据会话中的 userId 查询用户资料
 * TODO: 用主键或唯一字段查询多维表
 */
export async function getUserById(userId) {
	// TODO: 查询多维表，返回用户对象
	return { userId, email: 'todo@example.com' };
}

/**
 * 校验密码
 * 注意：生产中请使用 bcrypt/argon2 进行加盐哈希与校验
 */
export async function verifyPassword(plain, passwordHash) {
	// TODO: 使用 bcrypt.compare(plain, passwordHash)
	return false;
}

/**
 * 生成密码哈希
 * 注意：生产中请使用 bcrypt/argon2
 */
export async function hashPassword(plain) {
	// TODO: 返回哈希（例如 bcrypt.hash）
	return 'TODO_HASH';
}



