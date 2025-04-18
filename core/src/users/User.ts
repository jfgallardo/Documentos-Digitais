export default interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  provider: string;
  image: string | null;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
