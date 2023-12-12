import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  private generateToken(userId) {
    const payload = { userId };
    const token = sign(payload, '654987');
    return token;
  }

  async signUp(createAuthDto: CreateAuthDto) {
    const existUser = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: createAuthDto.username,
        },
      },
    });
    if (existUser) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with the given username already exists',
        },
        HttpStatus.CONFLICT,
      );
    } else {
      const hashedPassword = await hash(createAuthDto.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          name: createAuthDto.name,
          username: createAuthDto.username,
          password: hashedPassword,
        },
      });
      const token = this.generateToken(newUser.id);
      return {
        id: newUser.id,
        accessToken: token,
        username: newUser.username,
        name: newUser.name,
      };
    }
  }

  async signIn(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: createAuthDto.username,
        },
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPsswordValid = await compare(createAuthDto.password, user.password);

    if (!isPsswordValid) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Wrong password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = this.generateToken(user.id);
    return {
      id: user.id,

      accessToken: token,
      username: user.username,
      name: user.name,
    };
  }
}
