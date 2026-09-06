import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Express.User | undefined => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
