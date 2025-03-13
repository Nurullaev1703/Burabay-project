import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    if (!admin.apps.length) { // Проверяем, инициализировано ли приложение
      const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  async sendNotification(token: string, payload: admin.messaging.MessagingPayload) {
    try {
      await admin.messaging().send({
        token,
        ...payload,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}