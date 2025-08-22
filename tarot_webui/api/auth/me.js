// 获取当前用户（骨架版）
import { getUserById } from '../_utils/feishu.js';
import { verifyToken, extractTokenFromHeader, extractTokenFromCookie } from '../_utils/jwt.js';
import { getCookies } from '../_utils/cookies.js';

function json(res, status, data) {
	res.status(status).setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
	if (req.method === 'OPTIONS') return json(res, 200, {});
	if (req.method !== 'GET') return json(res, 405, { error: 'Method Not Allowed' });

	try {
		// 从请求头或Cookie中获取令牌
		let token = extractTokenFromHeader(req);

		if (!token) {
			const cookies = getCookies(req);
			token = cookies.authToken;
		}

		if (!token) {
			return json(res, 401, { error: '未提供认证令牌' });
		}

		// 验证令牌
		const payload = verifyToken(token);
		if (!payload) {
			return json(res, 401, { error: '无效的认证令牌' });
		}

		// 获取用户信息
		const user = await getUserById(payload.userId);
		if (!user) {
			return json(res, 404, { error: '用户不存在' });
		}

		return json(res, 200, {
			user: {
				userId: user.userId,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			}
		});
	} catch (err) {
		console.error('获取用户信息错误:', err);
		return json(res, 500, { error: '服务器错误', message: err.message });
	}
}



