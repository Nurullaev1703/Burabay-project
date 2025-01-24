import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class AnalyticsService {
  private readonly analyticsData;

  constructor() {
    const keyFile = './quickstart-1737623291026-90849019b702.json';

    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    this.analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  }

  async getReport(propertyId: string = '473411842', startDate: string, endDate: string) {
    const requestBody = {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [
        { name: 'operatingSystem' }, // Операционная система
        { name: 'country' }, // Страна
        { name: 'region' }, // Регион
        { name: 'city' }, // Город
        { name: 'language' }, // Язык
      ],
    };

    try {
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch analytics data: ${error.message}`);
    }
  }

  async getDetailedReport(propertyId: string = '473411842', startDate: string, endDate: string) {
    const requestBody = {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [
        { name: 'operatingSystem' },
        { name: 'country' },
        { name: 'region' },
        { name: 'city' },
        { name: 'language' },
      ],
    };
    try {
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody,
      });

      return response.data.rows;
    } catch (error) {
      throw new Error(`Failed to fetch analytics data: ${error.message}`);
    }
  }
}
