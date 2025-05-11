import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!existingUser) {
      throw new BadRequestException('usuario nao encontrado');
    }

    const validate = await this.validationPassword(
      loginDto.password,
      existingUser,
    );

    if (!validate) {
      throw new BadRequestException('erro');
    }

    const acessToken = await this.jwtService.signAsync(
      {
        sub: existingUser.id,
        email: existingUser.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );
    console.log(acessToken)
    return acessToken;
  }

  async validationPassword(password: string, user: User) {
    const passwordHash = user.password;
    const validationPassword = await this.hashingService.compare(
      password,
      passwordHash,
    );
    return validationPassword;
  }
}
