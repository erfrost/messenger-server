import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signUp-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';

interface AuthInterface {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
  user_link: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() authUserDto: SignUpUserDto): Promise<AuthInterface> {
    return this.authService.createUser(authUserDto);
  }

  @Post('signIn')
  signIn(@Body() authUserDto: SignInUserDto): Promise<AuthInterface> {
    return this.authService.signIn(authUserDto);
  }
}
