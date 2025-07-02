export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    roleId: string;  // Hoặc có thể là một object chứa thông tin role, tùy thuộc vào cách bạn xử lý role trong ứng dụng
    avatar: string;
    phoneNumber: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  