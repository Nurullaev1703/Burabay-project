import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VerificationDto } from './dto/verification.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyCodeDto } from './dto/verify-code.dto';

interface VerificationData {
  campaignId: string;
  messageId: string;
  status: number;
}

interface ResponseType {
  code: number;
  data: VerificationData;
  message: string;
}

@Injectable()
export class PhoneService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async sendVerification(verificationDto: VerificationDto) {
    // const accessMessage = await this._sendCode(verificationDto.phone) as ResponseType;
    // if (accessMessage.data.status === 1) {
    //   throw new HttpException("Некорректный номер", HttpStatus.BAD_REQUEST);
    // }
    // return JSON.stringify(accessMessage.data.status);
    return JSON.stringify("Код отправлен");
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    // const storedCode = await this.cacheManager.get(verifyCodeDto.phone);
    const storedCode = "7777";
    if (storedCode != verifyCodeDto.code) {
      throw new HttpException('Неверный код', HttpStatus.CONFLICT);
    }
    return JSON.stringify('Номер подтвержден');
  }

  private async _sendCode(phone: string) {
    const code = this._generateCode();
    // Устанавливаем время жизни кода - 60 минут (время в миллисекундах)
    await this.cacheManager.set(phone, code, 3600000);

    const response = await fetch('https://api.mobizon.kz/service/Message/SendSmsMessage?apiKey=kzb38c4dfa1192b85b143d8e4e291e252837e79041ae8d48b72d0cbb94c07f2a961208', {
      method: 'POST',
      body: JSON.stringify({
        recipient: phone,
        text: `Код для входа: ${code}`,
        params: [{
          name: "One Click"
        }]
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(async (response) => {
      const data = await response.json();
      return data;
    });

    return response;
  }

  private _generateCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += String(Math.floor(Math.random() * 9));
    }
    return code;
  }
}
