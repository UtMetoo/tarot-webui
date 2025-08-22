// 登出接口（骨架版）
import { clearCookie } from '../_utils/cookies.js';

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
		// 清除认证Cookie
		clearCookie(res, 'authToken', {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		return json(res, 200, { message: '登出成功' });
	} catch (err) {
		console.error('登出错误:', err);
		return json(res, 500, { error: '服务器错误', message: err.message });
	}
}



