import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
 getHello() {
    return { message: 'API wasl en ligne' };
  }

  @Get('ping')
  ping() {
    return 'pong';
  }
}