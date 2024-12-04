import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  constructor() {}
  async sendResetPasswordEmail(email: string, token: string) {
    const data = {
      to: email,
      from: 'One Tap',
      subject: 'Смена пароля',
      text: `Пожалуйста перейдите по ссылке ниже или вставьте ссылку в строку запроса браузера:\n\n
            http://localhost:5173/change-password/${token}\n\
            Если вы не отправляли это сообщение, то проигнорируйте его и смените пароль для вашей безопасности.\n`,
    };
    try {
      await this.transporter.sendMail(data);
      return JSON.stringify('Сообщение было отправлено');
    } catch (error) {
      return JSON.stringify('Произошла ошибка ' + String(error));
    }
  }
}
