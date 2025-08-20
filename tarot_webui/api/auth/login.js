// 登录接口（骨架版）
import { getTenantAccessToken, findUserByEmail, verifyPassword } from '../_utils/feishu.js';
import { setSessionCookie } from '../_utils/cookies.js';

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

		await getTenantAccessToken().catch(() => null);
		const user = await findUserByEmail(email);
		if (!user) return json(res, 401, { error: '账号或密码错误' });

		// TODO: 使用 bcrypt.compare 校验密码
		const ok = await verifyPassword(password, user.passwordHash || '');
		if (!ok) return json(res, 401, { error: '账号或密码错误' });

		// TODO: 生成真实会话 token（建议 JWT 或服务端会话 ID）
		setSessionCookie(res, 'TODO_SESSION_TOKEN');
		return json(res, 200, { message: '登录成功（占位）', userId: user.userId || 'TODO', todo: true });
	} catch (err) {
		return json(res, 500, { error: '服务器错误', message: err.message });
	}
}



