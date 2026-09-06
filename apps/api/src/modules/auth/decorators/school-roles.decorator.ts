import { SetMetadata } from '@nestjs/common';
import { SchoolRole } from '@prisma/client';

export const SCHOOL_ROLES_KEY = 'schoolRoles';
export const SchoolRoles = (...roles: SchoolRole[]) =>
  SetMetadata(SCHOOL_ROLES_KEY, roles);
