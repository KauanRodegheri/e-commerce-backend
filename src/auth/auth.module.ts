import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

@Global()
@Module({
  imports: [UsersModule, JwtModule, ConfigModule.forFeature(jwtConfig)],
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
