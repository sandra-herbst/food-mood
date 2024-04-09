import { Controller, Get, Request } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  /**
   * Endpoint in root is used for the health check of the docker setup.
   */
  @Get()
  getHello(@Request() req: any): string {
    return 'Hello World!';
  }
}
