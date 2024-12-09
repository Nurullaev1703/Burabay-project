import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { VerificationDto } from './dto/verification.dto';
import { Throttle } from '@nestjs/throttler';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post()
  login(@Body() signInDto: SignInDto) {
    return this.authenticationService.login(signInDto);
  }

  @Public()
  @Post("check-user")
  checkUser(@Body() loginDto: LoginDto) {
    return this.authenticationService.checkUser(loginDto);
  }
  // ограниченное количество запросов на 30 минут
  @Public()
  @Throttle({ default: { limit: 15 } })
  @Post('verification')
  verification(@Body() verifyDto: VerificationDto) {
    return this.emailService.sendAcceptMessage(verifyDto.email);
  }

  @Public()
  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.emailService.verifyCode(verifyCodeDto);
  }
}
