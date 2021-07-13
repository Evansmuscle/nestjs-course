import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() response: Response,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto, response);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authService.signIn(authCredentialsDto);
  }
}
