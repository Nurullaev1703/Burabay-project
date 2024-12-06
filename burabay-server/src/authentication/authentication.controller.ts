import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { VerificationDto } from './dto/verification.dto';
import { PhoneService } from './phone.service';
import { Throttle } from '@nestjs/throttler';
import { VerifyCodeDto } from './dto/verify-code.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly phoneService: PhoneService,
  ) {}
  
  @Public()
  @Post()
  login(@Body() signInDto: SignInDto) {
    return this.authenticationService.login(signInDto);
  }
  // ограниченное количество запросов на 30 минут
  @Public()
  @Throttle({ default: { limit: 8, ttl: 1800000 } })
  @Post('verification')
  verification(@Body() verificationDto: VerificationDto) {
    return this.phoneService.sendVerification(verificationDto);
  }

  @Public()
  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.phoneService.verifyCode(verifyCodeDto);
  }
}
