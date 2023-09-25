import { ROLES } from 'src/config/constants';

export interface IPayload {
  sub: string;
  role: ROLES;
}
