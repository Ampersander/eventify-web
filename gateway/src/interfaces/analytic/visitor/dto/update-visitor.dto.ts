import { ApiProperty } from '@nestjs/swagger';

export class UpdateVisitorDto {
  @ApiProperty({ description: "Visitor's ID", example: '12345' })
  visitorId: string;

  @ApiProperty({ description: "Visitor's IP Address", example: '192.168.1.100' })
  ipAddress: string;

  @ApiProperty({ description: "Visitor's User Agent", example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36' })
  userAgent: string;

  @ApiProperty({ description: "Visitor's Browser Info", example: { name: 'Chrome', version: '93.0.4577.82', major: '93' } })
  browserInfo: any;

  @ApiProperty({ description: "Visitor's Device Info", example: { vendor: 'Google', model: 'Chrome', type: 'desktop' } })
  deviceInfo: any;

  @ApiProperty({ description: "Visitor's Performance Info", example: { loadTime: 2300, redirectTime: 100, dnsTime: 30, tcpTime: 50, requestTime: 400, responseTime: 700, domLoadingTime: 1500, domInteractiveTime: 1700, domContentLoadedTime: 2000, domCompleteTime: 2300 } })
  performanceInfo: any;

  @ApiProperty({ description: "Visitor's Location Info", example: { country: 'United States', region: 'California', city: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 } })
  locationInfo: any;
}
