import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
export const useCheckAuth = () =>
  useSelector((state: RootState) => state.auth.user);
