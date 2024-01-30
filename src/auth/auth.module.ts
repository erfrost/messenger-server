import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { Tokens } from 'src/entities/tokens.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Tokens]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
})
export class AuthModule {}
