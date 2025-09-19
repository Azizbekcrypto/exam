import { UserRole } from '../enum/user-enum';
import { UserSRole } from '../enum/users.enum';

export interface IPayload {
  id: string;
  role: UserRole | UserSRole
  isActive?: boolean;
}
