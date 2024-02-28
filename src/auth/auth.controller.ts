import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';


//import { CurrentUser } from './decorators/current-user.decorator';
//@CurrentUser() pour extraire l'utilisateur à partir du jeton JWT dans la demande.

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
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
}
  // @Post('/logout')
  // @UseGuards(AuthGuard('jwt'))
  // async logout(@Res() res: Response): Promise<void> {
  //   try {
  //     // Obtenez l'ID de l'utilisateur directement à partir de la demande
  //     const userId = res.locals.user.id; // Assurez-vous que le champ 'id' est correct

  //     await this.authService.logout(userId);
  //     res.clearCookie('token');
  //     res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  //   } catch (error) {
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  //   }
  // }
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


