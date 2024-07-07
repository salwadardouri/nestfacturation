import { Controller, Post, Body, Res, HttpStatus,UnauthorizedException,Get,HttpException, Req,NotFoundException,BadRequestException} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';
import { ClientDto } from 'src/clients/dto/clients.dto';
import { ModifierPasswordDto } from './dto/ModifierPassword.dto';
import { User } from 'src/schemas/user.schema';
//import { CurrentUser } from './decorators/current-user.decorator';
//@CurrentUser() pour extraire l'utilisateur à partir du jeton JWT dans la demande.

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('signupadmin ')
  // async signUpAdmin(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<void> {
  //   try {
  //     const { ton, user } = await this.authService.signUp(signUpDto);

  //     // Setting HttpOnly cookie
  //     res.cookie('token', token, { httpOnly: true, secure: true }); // Adjust 'secure' based on your deployment environment

  //     res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user, token });
  //   } catch (error) {
  //     if (error.status === HttpStatus.CONFLICT) {
  //       res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
  //     } else {
  //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  //     }
  //   }
  // }

  @Post('signupclient')
  async signUp(@Body() signUpDto:  ClientDto, @Res() res: Response): Promise<void> {
    try {
      const { accessToken, refreshToken, user } = await this.authService.signUp(signUpDto);

      res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
      try {
          const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
  
          res.status(HttpStatus.OK).json({
              message: 'Login successful',
              user,
              accessToken,
              refreshToken,
          });
      } catch (error) {
          if (error instanceof HttpException) {
              res.status(error.getStatus()).json({ message: error.message });
          } else {
              res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
          }
      }
  }
  
  // @Post('/logout')
  // async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
  //   // Effacer le cookie contenant le token
  //   res.clearCookie('token');
  //   res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  // }
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

@Get('me')
async getLoggedInUser(@Req() req) {
  return req.user; // Cela renverra les détails de l'utilisateur actuellement connecté
}

@Get('profile')
async getUserProfile(@Req() req) {
  return this.authService.getUserByToken(req.headers.authorization.split(' ')[1]);
}
@Get('profile/Client')
async getClientProfile(@Req() req) {
  return this.authService.getClientByToken(req.headers.authorization.split(' ')[1]);
}
@Post('ModifierPassword')
async ModifierPassword(
  @Body() modifierPasswordDto: ModifierPasswordDto,
): Promise<{ message: string }> {
  try {
    // Appelez la méthode de service pour modifier le mot de passe
    await this.authService.ModifierPassword(
      modifierPasswordDto.email,
      modifierPasswordDto.Password,
      modifierPasswordDto.newPassword,
    );

    return { message: 'Password successfully changed.' };
  } catch (error) {
    let errorMessage =
      "An error occurred while changing the password. Please ensure that your old password is correct and that your new password is different from the old one.";

    if (error instanceof NotFoundException) {
      errorMessage = 'User not found';
    } else if (error instanceof UnauthorizedException) {
      errorMessage = 'Incorrect old password';
    } else if (error instanceof BadRequestException) {
      errorMessage =
        "The new password cannot be the same as the old one.";
    }

    // Gérer les erreurs de manière appropriée
    throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
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


