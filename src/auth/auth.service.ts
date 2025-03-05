import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginDto: LoginDto): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!existingUser) {
      throw new BadRequestException('usuario nao encontrado');
    }

    const passwordHash = existingUser.password;

    const validationPassword = await this.hashingService.compare(
      loginDto.password,
      passwordHash,
    );

    return validationPassword;
  }
}
