import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { VerificationDto } from './dto/verification.dto';
import { PhoneService } from './phone.service';
import { Throttle } from '@nestjs/throttler';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from './email.service';
import { GoogleAccessToken } from './model/GoogleAuth';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly phoneService: PhoneService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post()
  login(@Body() signInDto: SignInDto) {
    return this.authenticationService.login(signInDto);
  }
  @Public()
  @Post('google-login')
  googleLogin(@Body() token: GoogleAccessToken) {
    return this.authenticationService.googleLogin(token);
  }
  // ограниченное количество запросов на 30 минут
  @Public()
  @Throttle({ default: { limit: 8, ttl: 1800000 } })
  @Post('verification')
  verification(@Body() verificationDto: VerificationDto) {
    return this.emailService.sendAcceptMessage(verificationDto.email);
  }
  @Public()
  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.emailService.verifyCode(verifyCodeDto);
  }
}
