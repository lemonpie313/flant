export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface CreateUserDto {
    name: string;
    email: string;
  }
  
  export interface UpdateUserDto {
    password: string;
    name?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
    profile_image?: string;
  }
  