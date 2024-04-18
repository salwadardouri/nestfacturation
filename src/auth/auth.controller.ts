import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';

import { ClientDto } from 'src/clients/dto/clients.dto';

//import { CurrentUser } from './decorators/current-user.decorator';
//@CurrentUser() pour extraire l'utilisateur à partir du jeton JWT dans la demande.

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signupadmin ')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<void> {
    try {
      const { token, user } = await this.authService.signUp(signUpDto);

      // Setting HttpOnly cookie
      res.cookie('token', token, { httpOnly: true, secure: true }); // Adjust 'secure' based on your deployment environment

      res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user, token });
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }
  @Post('signupclient')
  async signUpClient(@Body() clientDto: ClientDto, @Res() res: Response): Promise<void> {
    try {
      const { token, user } = await this.authService.signUpClient(clientDto);

      // Setting HttpOnly cookie
      res.cookie('token', token, { httpOnly: true, secure: true }); // Adjust 'secure' based on your deployment environment

      res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user, token });
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    try {
      const { token, user } = await this.authService.login(loginDto);
// Setting HttpOnly cookie
res.cookie('token', token, { httpOnly: true, secure: true }); // Adjust 'secure' based on your deployment environment

      res.status(HttpStatus.OK).json({ message: 'Login successful', user, token });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
  }
  
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    // Effacer le cookie contenant le token
    res.clearCookie('token');
    res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }
  @Post('reset-password-request')
  async requestPasswordReset(@Body('email') email: string) {
    const { resetCode, resetCodeExpiration } = await this.authService.requestPasswordReset(email);
    return { message: 'Email sent for password reset', resetCode, resetCodeExpiration };
  }
@Post('reset-password')
async resetPassword(
  @Body('email') email: string,

  @Body('newPassword') newPassword: string,
) {
  await this.authService.resetPassword(email,  newPassword);
  return { message: 'Password reset successfully' };
}
@Post('compare-code')
async comparecode(
  @Body('email') email: string,
  @Body('code') code: string,

) {
  await this.authService.comparecode(email, code);
  return { message: 'code correct' };
}
}
  // @UseGuards(AuthGuard('jwt'))
  // @Get('/refresh-token')
  // async refreshToken(@Res() res: Response): Promise<void> {
  //   try {
  //     const newToken = await this.authService.refreshToken(res.locals.user); // Utilisez l'utilisateur actuel pour le rafraîchissement
  //     this.setTokenCookie(res, newToken);

  //     res.status(HttpStatus.OK).json({ message: 'Token refreshed successfully', token: newToken });
  //   } catch (error) {
  //     res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  //   }
  // }
  //  private setTokenCookie(res: Response, token: string): void {
  //   res.cookie('token', token, { httpOnly: true, secure: true }); // Adjust 'secure' based on your deployment environment
  // }


