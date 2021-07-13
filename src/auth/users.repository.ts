import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Response } from 'express';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(
    { username, password }: AuthCredentialsDto,
    response: Response,
  ): Promise<void> {
    let hashedPassword;
    try {
      hashedPassword = await argon2.hash(password);
    } catch (err) {
      console.log(err);
    }
    console.log(hashedPassword);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
      response.status(201).json({
        status: 'success',
        message: 'user has been created',
        user,
      });
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exits');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
