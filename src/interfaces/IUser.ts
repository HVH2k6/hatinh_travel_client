import { IRole } from "./IRole";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    roleId: IRole;  // Hoặc có thể là một object chứa thông tin role, tùy thuộc vào cách bạn xử lý role trong ứng dụng
    avatar: string;
    phoneNumber: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  