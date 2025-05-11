import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(){
    console.log(process.env.JWT_SECRET)
  }
  getHello(): string {
    return 'Hello World!';
  }
}
