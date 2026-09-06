import { SchoolRole } from '@prisma/client';
import { AuthenticatedUser } from './authenticated-user.interface';

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}

    interface Request {
      schoolMembership?: {
        id: string;
        schoolId: string;
        role: SchoolRole;
      };
    }
  }
}

export {};
