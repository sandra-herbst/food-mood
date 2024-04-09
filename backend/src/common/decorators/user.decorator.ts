import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom Decorator that extracts the user of the request.
 * The endpoint needs to be secured with the JwtAuthGuard in order
 * for this to work.
 */
export const UserData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
