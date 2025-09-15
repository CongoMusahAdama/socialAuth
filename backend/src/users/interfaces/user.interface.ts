export interface User {
  id: string;
  provider: 'linkedin' | 'tiktok';
  providerId: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
}

export interface CreateUserDto {
  provider: 'linkedin' | 'tiktok';
  providerId: string;
  name: string;
  email?: string;
  avatar?: string;
}
