import Cookies from 'js-cookie';

export const saveTokens = (access: string, refresh: string) => {
  Cookies.set('access_token', access, {
    secure: true,
    sameSite: 'Strict',
    expires: 1, // 1 day
    path: '/',
  });

  Cookies.set('refresh_token', refresh, {
    secure: true,
    sameSite: 'Strict',
    expires: 365, // 365 days
    path: '/',
  });
};

export const clearTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

export const getAccessToken = () => Cookies.get('access_token');
export const getRefreshToken = () => Cookies.get('refresh_token');
