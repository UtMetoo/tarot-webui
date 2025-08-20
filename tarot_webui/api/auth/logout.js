// 登出接口（骨架版）
import { clearSessionCookie } from '../_utils/cookies.js';

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

	clearSessionCookie(res);
	return json(res, 200, { message: '已登出（占位）', todo: true });
}



