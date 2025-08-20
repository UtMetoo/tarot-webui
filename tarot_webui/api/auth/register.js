// 注册接口（骨架版）
import { getTenantAccessToken, findUserByEmail, createUser, hashPassword } from '../_utils/feishu.js';

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
		if (!email || !password) return json(res, 400, { error: '缺少 email 或 password' });

		// TODO: 参数校验（邮箱格式、密码强度等）
		// TODO: 获取并缓存 tenant_access_token（若需要）
		await getTenantAccessToken().catch(() => null);

		const exists = await findUserByEmail(email);
		if (exists) return json(res, 409, { error: '用户已存在' });

		// TODO: 使用 bcrypt/argon2 生成哈希
		const passwordHash = await hashPassword(password);
		const { userId } = await createUser({ email, passwordHash });

		return json(res, 201, { message: '注册成功（占位）', userId, todo: true });
	} catch (err) {
		return json(res, 500, { error: '服务器错误', message: err.message });
	}
}



