import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { hash } from 'bcrypt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    })
    if (existingUser) {
      throw new BadRequestException('Email já cadastrado')
    };

    const usuario = {
      ...createUserDto,
    };

    const passwordHash = await hash(usuario.password, 8)
    console.log(passwordHash)

    const usuarioSaved = this.userRepository.create({
      name: usuario.name,
      email: usuario.email,
      username: usuario.email,
      password: passwordHash
    });

    await this.userRepository.save(usuarioSaved);
    console.log(await bcrypt.compare('MariaDaPenha.', passwordHash))
    
    return usuarioSaved;
  }

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { limit = 2, setOff = 0 } = paginationDto;
    const usuarios = await this.userRepository.find({
      skip: +setOff,
      take: +limit,
      order: {
        id: 'ASC'
      }
    });

    if (!usuarios.length) {
      throw new BadRequestException('Nenhum usuário cadastrado ainda.');
    }

    const usuarioFinal = {
      items: usuarios.length,
      pagination: Math.floor(usuarios.length / limit),
      data: {
        ...usuarios
      }
    }

    return usuarioFinal;
  }

  async findOne(id: number) {
    const usuario = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return usuario;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    if (updateUserDto.email) {
      const emailValidation = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      })

      if (emailValidation) {
        throw new BadRequestException('Email já cadastrado')
      }
    }

    const usuario = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    usuario.name = updateUserDto.name ? updateUserDto.name : usuario.name;
    usuario.username = updateUserDto.username
      ? updateUserDto.username
      : usuario.username;
    usuario.email = updateUserDto.email ? updateUserDto.email : usuario.email
    usuario.password = updateUserDto.password
      ? updateUserDto.password
      : usuario.password;

    await this.userRepository.save(usuario)
    return usuario;
  }

  async remove(id: number) {
    const usuario = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado');
    }

    await this.userRepository.delete(usuario)
    return usuario

  }
}
