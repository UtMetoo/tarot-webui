// 登录接口（骨架版）
import { findUserByEmail, verifyPassword } from '../_utils/feishu.js';
import { generateToken } from '../_utils/jwt.js';
import { setCookie } from '../_utils/cookies.js';

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

		// 查找用户
		const userRecord = await findUserByEmail(email);
		if (!userRecord) {
			return json(res, 401, { error: '邮箱或密码错误' });
		}

		// 验证密码
		const isValidPassword = await verifyPassword(password, userRecord.passwordHash);

		if (!isValidPassword) {
			return json(res, 401, { error: '邮箱或密码错误' });
		}

		// 生成JWT令牌
		const userId = userRecord.userId;
		const token = generateToken({ userId, email });

		// 设置Cookie
		setCookie(res, 'authToken', token, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		return json(res, 200, {
			message: '登录成功',
			user: { userId, email },
			token
		});
	} catch (err) {
		console.error('登录错误:', err);
		return json(res, 500, { error: '服务器错误', message: err.message });
	}
}



