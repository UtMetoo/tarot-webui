// 获取当前用户（骨架版）
import { parseSessionFromRequest } from '../_utils/cookies.js';
import { getUserById } from '../_utils/feishu.js';

function json(res, status, data) {
	res.status(status).setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
	if (req.method === 'OPTIONS') return json(res, 200, {});
	if (req.method !== 'GET') return json(res, 405, { error: 'Method Not Allowed' });

	const token = parseSessionFromRequest(req);
	if (!token) return json(res, 401, { error: '未登录' });

	// TODO: 从 token 解出 userId（若使用 JWT/会话ID）
	const userId = 'TODO_USER_ID_FROM_TOKEN';
	const user = await getUserById(userId);
	return json(res, 200, { user, todo: true });
}



