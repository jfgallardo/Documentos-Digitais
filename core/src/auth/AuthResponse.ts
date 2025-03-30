import User from '../users/User';

export default interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}
