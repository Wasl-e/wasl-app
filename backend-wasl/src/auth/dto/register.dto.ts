import { UserRole } from '@prisma/client';

export class RegisterDto {
  email!: string;
  password!: string;
  role?: UserRole;
}