import { Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string; // 수신자
  subject: string; // 메일 제목
  html: string; // html 형식의 메일 본문
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.NODE_MAILER_ID,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(emailAddress: string, signupVerifyToken: string) {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: 'Reptimate 회원가입 인증 메일',
      html: `
        아래 이메일 인증 코드를 앱에서 입력해주세요.<br/>
        <br/>
        인증코드:  <strong>${signupVerifyToken}</strong>
      `,
    };
    await this.transporter.sendMail(mailOptions);
    this.transporter.close();
  }
}
