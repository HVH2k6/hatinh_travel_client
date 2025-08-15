import Cookies from 'js-cookie';

// Convert time string like '30s', '15m', '2h', '1d' to days (as js-cookie requires)
const parseExpireTime = (timeStr: string): number => {
  const time = parseInt(timeStr, 10);
  const unit = timeStr.replace(/[0-9]/g, '').toLowerCase();

  switch (unit) {
    case 's':
      return time / 86400; // 60 * 60 * 24
    case 'm':
      return time / 1440; // 60 * 24
    case 'h':
      return time / 24;
    case 'd':
      return time;
    default:
      throw new Error('Invalid time format. Use s, m, h, or d (e.g., 30s, 5m, 1h, 2d)');
  }
};

export const saveTokens = (access: string, refresh: string, accessExpire: string = '30m', refreshExpire: string = '100d') => {
  Cookies.set('access_token', access, {
    secure: true,
    sameSite: 'Strict',
    expires: parseExpireTime(accessExpire),
    path: '/',
  });

  Cookies.set('refresh_token', refresh, {
    secure: true,
    sameSite: 'Strict',
    expires: parseExpireTime(refreshExpire),
    path: '/',
  });
};

export const clearTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

export const getAccessToken = () => Cookies.get('access_token');
export const getRefreshToken = () => Cookies.get('refresh_token');
