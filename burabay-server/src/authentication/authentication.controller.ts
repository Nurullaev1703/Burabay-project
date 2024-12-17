import { Controller, Post, Body, Request, Patch } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { VerificationDto } from './dto/verification.dto';
import { PhoneService } from './phone.service';
import { Throttle } from '@nestjs/throttler';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from './email.service';
import { GoogleAuthType } from './model/GoogleAuth';
import { FacebookAuthData } from './model/FacebookAuth';
import { LoginDto } from './dto/login.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

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
  googleLogin(@Body() userInfo: GoogleAuthType) {
    return this.authenticationService.googleLogin(userInfo);
  }

  @Public()
  @Post('facebook-login')
  facebookLogin(@Body() userInfo: FacebookAuthData) {
    return this.authenticationService.facebookLogin(userInfo);
  }

  @Public()
  @Post('check-password')
  checkPassword(@Body() loginDto: LoginDto) {
    return this.authenticationService.checkUser(loginDto);
  }

  @Public()
  @Post('register-business')
  registerBusiness(@Body() updateDto: UpdateOrganizationDto) {
    return this.authenticationService.updateOrganizationInfo(updateDto);
  }

  @ApiBearerAuth()
  @Patch('change-password')
  changePassword(@Request() req: AuthRequest, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authenticationService.changePassword(req.user, changePasswordDto);
  }

  @Public()
  @Patch('new-password')
  newPassword(@Body() loginDto: LoginDto) {
    return this.authenticationService.resetPassword(loginDto);
  }

  @ApiBearerAuth()
  @Patch('update-email')
  newEmail(@Request() req: AuthRequest, @Body() updateEmailDto: UpdateEmailDto) {
    return this.authenticationService.updateUserEmail(req.user, updateEmailDto);
  }

  // ограниченное количество запросов на 30 минут
  @Public()
  @Throttle({ default: { limit: 8, ttl: 1800000 } })
  @Post('verification')
  verification(@Body() verificationDto: VerificationDto) {
    return this.emailService.sendAcceptMessage(verificationDto.email);
  }

  // ограниченное количество запросов на 30 минут
  @Public()
  @Throttle({ default: { limit: 8, ttl: 1800000 } })
  @Post('reset-password')
  resetPasswordMessage(@Body() verificationDto: VerificationDto) {
    return this.emailService.resetPasswordMessage(verificationDto.email);
  }

  @Public()
  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.emailService.verifyCode(verifyCodeDto);
  }
}
