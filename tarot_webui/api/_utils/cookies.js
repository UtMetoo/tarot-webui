// 会话 Cookie 工具（骨架版）
// 说明：使用 HttpOnly + Secure + SameSite=Lax 的 Cookie 存放会话令牌

const COOKIE_NAME = 't_session';

export function setSessionCookie(res, token) {
	// TODO: token 建议为 JWT 或服务端生成的随机会话 ID
	res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`);
}

export function clearSessionCookie(res) {
	res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

export function parseSessionFromRequest(req) {
	const cookie = req.headers.cookie || '';
	const map = Object.fromEntries(cookie.split(';').map(v => v.trim().split('=')));
	return map[COOKIE_NAME] || '';
}



