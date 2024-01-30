import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from 'src/entities/tokens.entity';
import { Repository } from 'typeorm';
import { PayloadDto } from './dto/payload.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Tokens)
    private readonly tokenRepository: Repository<Tokens>,
    private readonly jwtService: JwtService,
  ) {}

  async generate(payload: PayloadDto) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
    });
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET,
    });

    return {
      access_token,
      refresh_token,
      expires_in: 3600,
    };
  }

  async save(access_token: string, refresh_token: string, user_id: string) {
    const existToken = await this.tokenRepository.findOne({
      where: {
        user_id,
      },
    });
    if (existToken) {
      existToken.refresh_token = refresh_token;
      return this.tokenRepository.save(existToken);
    }

    const model = this.tokenRepository.create({
      user_id,
      refresh_token,
      access_token,
    });
    const newToken = await this.tokenRepository.save(model);
    return newToken;
  }

  refreshTokenValidate(refresh_token: string) {
    const verify = this.jwtService.verify(refresh_token, {
      secret: process.env.REFRESH_SECRET,
    });
    return verify;
  }

  accessTokenValidate(access_token: string) {
    const verify = this.jwtService.verify(access_token, {
      secret: process.env.ACCESS_SECRET,
    });
    return verify;
  }

  async findToken(refresh_token: string) {
    return await this.tokenRepository.findOne({
      where: {
        refresh_token,
      },
    });
  }
}
