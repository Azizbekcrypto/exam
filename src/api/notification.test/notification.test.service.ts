import { Injectable } from '@nestjs/common';
import { Borrow, User } from 'src/core';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // TLS ishlatiladi
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendDueSoon(user: any, borrow: Borrow) {
    console.log(`Ogohlantirish yuborildi ${user.email} ga ✅`);
    await this.transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Kitobni topshirish vaqti yaqinlashmoqda!',
      text: `Hurmatli ${user.full_name}, sizning kitobingiz "${borrow.book.title}" ${borrow.due_date} da topshirilishi kerak. Iltimos, vaqtida qaytaring!`,
    });
    return { message: 'Email yuborildi ✅', borrowId: borrow.id };
  }


  async sendLateBorrow(user: User, borrow: Borrow, penalty: number) {
    console.log(`Jarima yuborildi ${user.email} ga ✅`);
    await this.transporter.sendMail({
      from: `"Library App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Kitobni qaytarish muddati tugadi',
      text: `Hurmatli ${user.full_name}, sizning kitob "${borrow.book.title}" muddati o'tgan. Hozirgi jarima: ${penalty} so'm`,
    });
  }

}
