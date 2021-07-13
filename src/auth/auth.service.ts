import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Response } from 'express';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    response: Response,
  ): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto, response);
  }

  async signIn({ username, password }: AuthCredentialsDto): Promise<string> {
    let user;
    try {
      user = await this.usersRepository.findOne({ username });
    } catch (err) {
      throw new Error('User with that name does not exist');
    }

    if (user && (await argon2.verify(user.password, password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
