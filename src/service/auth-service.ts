const API_URL = "http://localhost:3001/api";

export const forgotPasswordApi = async (email: string) => {
  const res = await fetch(`${API_URL}/user/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gửi OTP thất bại');
  }
  return res.json();
};

export const resetPasswordApi = async (data: { email: string; code: string; newPassword: string }) => {
  const res = await fetch(`${API_URL}/user/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Đặt lại mật khẩu thất bại');
  }
  return res.json();
};