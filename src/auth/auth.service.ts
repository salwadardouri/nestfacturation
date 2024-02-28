import { Injectable,HttpException, HttpStatus,  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';



@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private  userModel: Model<UserDocument>,
        private jwtService: JwtService,
     
       
      ) {}
      async signUp(signUpDto: SignUpDto): Promise<{ token: string, user: User }> {
        const { fullname, email, password, country, num_phone, address, code_postal, roles } = signUpDto;
    
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const user = await this.userModel.create({
            fullname, email, password: hashedPassword, country, num_phone, address, code_postal, roles,
          });
    
          const token = this.jwtService.sign({ id: user._id });
    
          return { token, user };
        } catch (error) {
          if (error.code === 11000) {
            // MongoDB duplicate key error (e.g., duplicate email)
            throw new HttpException('Email already exists', HttpStatus.CONFLICT);
          } else {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }
      async login(loginDto: LoginDto): Promise<{ token: string, user: User }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = this.jwtService.sign({ id: user._id });
          return { token, user };
        } else {
          throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
      }
      // async logout(userId: string): Promise<void> {
      //   await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
      // }
      
        
    // async signUp(body: SignUpDto):Promise<{ message: string, user?: User }> {
    //     const { fullname, email, password, country, num_phone, address, code_postal, roles } = body;
    //     try {
    //       const hashedPassword = await bcrypt.hash(password, 10);
    
    //       const user = await this.userModel.create({fullname,email,password: hashedPassword,country,num_phone,address,code_postal,roles, });
    //       return { message: 'User created successfully', user };
    //         } catch (error) {
    //       if (error.code === 11000) {
    //         // MongoDB duplicate key error (e.g., duplicate email)
    //         throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    //       }
      // }
     // }
}
