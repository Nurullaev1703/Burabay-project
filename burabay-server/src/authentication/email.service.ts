import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getAcceptMessage } from './mail-visual/mail.example';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Injectable()
export class EmailService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private _generateCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += String(Math.floor(Math.random() * 9));
    }
    return code;
  }
  async sendAcceptMessage(email: string) {
    const code = this._generateCode();
    // Устанавливаем время жизни кода - 60 минут (время в миллисекундах)
    await this.cacheManager.set(email, code, 3600000);
    const data = {
      to: email,
      from: 'Burabay Travel',
      subject: 'Accept your email',
      text: `Accept Email`,
      html: getAcceptMessage(code),
    };
    try {
      await this.transporter.sendMail(data);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      return JSON.stringify(HttpStatus.FAILED_DEPENDENCY);
    }
  }
  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    try{
      const storedCode = await this.cacheManager.get(verifyCodeDto.email);
      if (storedCode !== verifyCodeDto.code) {
        return JSON.stringify(HttpStatus.CONFLICT);
      }
      return JSON.stringify(HttpStatus.OK);
    }
    catch{
      return JSON.stringify(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
