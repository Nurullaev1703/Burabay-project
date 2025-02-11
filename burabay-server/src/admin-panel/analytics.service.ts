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

  async getUserStatistics(startDate: string, endDate: string) {
    const propertyId = '473411842';
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

      if (!response.data.rows) {
        return { message: 'No data available for the given date range.' };
      }

      const groupedData = {
        operatingSystems: {},
        countries: {},
        regions: {},
        cities: {},
        languages: {},
      };

      response.data.rows.forEach((row) => {
        const dimensions = row.dimensionValues.map((dimension) => dimension.value);
        const metrics = row.metricValues.map((metric) => Number(metric.value));

        const [os, country, region, city, language] = dimensions;

        groupedData.operatingSystems[os] = (groupedData.operatingSystems[os] || 0) + metrics[0];
        groupedData.countries[country] = (groupedData.countries[country] || 0) + metrics[0];
        groupedData.regions[region] = (groupedData.regions[region] || 0) + metrics[0];
        if (country === 'Kazakhstan') {
          groupedData.cities[city] = (groupedData.cities[city] || 0) + metrics[0];
        }
        groupedData.languages[language] = (groupedData.languages[language] || 0) + metrics[0];
      });

      return {
        operatingSystems: this.cleanUpData(groupedData.operatingSystems),
        countries: this.cleanUpData(groupedData.countries),
        regions: this.cleanUpData(groupedData.regions),
        cities: this.cleanUpData(groupedData.cities),
        languages: this.cleanUpData(groupedData.languages),
      };
    } catch (error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }

  async getPageViews(startDate: string, endDate: string) {
    const propertyId = '473411842';
    const requestBody = {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
    };

    try {
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody,
      });

      if (!response.data.rows) {
        return { message: 'No data available for the given date range.' };
      }

      const pageViews = {};

      response.data.rows.forEach((row) => {
        const pagePath = row.dimensionValues[0].value;
        const views = Number(row.metricValues[0].value);

        pageViews[pagePath] = (pageViews[pagePath] || 0) + views;
      });

      return this.cleanUpData(pageViews);
    } catch (error) {
      throw new Error(`Failed to fetch page views: ${error.message}`);
    }
  }

  private cleanUpData(data: Record<string, number>) {
    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (value > 0) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
