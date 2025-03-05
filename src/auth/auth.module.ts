import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: HashingService, 
      useClass: BcryptService, //SE USARMOS OUTRO SISTEMA DE HASH, SÓ ALTERAR O NOME AQUI DEPOIS
    },
    AuthService,
  ],
  controllers: [AuthController],
  exports: [HashingService]
})
export class AuthModule {}
