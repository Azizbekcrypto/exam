import { UserRole } from '../enum/user-enum';

export interface IPayload {
  id: string;
  role: UserRole;
  isActive: boolean;
}
