// lib/authService.ts
import api from '@/lib/axios';
import { getAccessToken } from './token';
import { AppDispatch } from '@/redux/store';
import { setCredentials } from '@/redux/store/authSlice';

export const fetchUser = async (dispatch: AppDispatch) => {
  const token = getAccessToken();
  

  try {
    const res = await api.get('/user/me');
    dispatch(setCredentials({ user: res.data.user, accessToken: token||'' }));
  } catch (err) {
    console.error(err);
  }
};
