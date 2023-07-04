import { ApiProperty } from '@nestjs/swagger';
import { IVisitor } from '../visitor.interface';

export class GetVisitorsResponseDto {
  @ApiProperty({ example: 'visitor_search_success' })
  message: string;
  @ApiProperty({
    example: {
      visitors: [
        {
          "visitorId": "12345",
          "ipAddress": "192.168.1.100",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
          "browserInfo": {
            "name": "Chrome",
            "version": "93.0.4577.82",
            "major": "93"
          },
          "deviceInfo": {
            "vendor": "Google",
            "model": "Chrome",
            "type": "desktop"
          },
          "performanceInfo": {
            "loadTime": 2300,
            "redirectTime": 100,
            "dnsTime": 30,
            "tcpTime": 50,
            "requestTime": 400,
            "responseTime": 700,
            "domLoadingTime": 1500,
            "domInteractiveTime": 1700,
            "domContentLoadedTime": 2000,
            "domCompleteTime": 2300
          },
          "locationInfo": {
            "country": "United States",
            "region": "California",
            "city": "Los Angeles",
            "latitude": 34.0522,
            "longitude": -118.2437
          }
        },
      ],
    },
    nullable: true,
  })
  data: {
    visitors: IVisitor[];
  };
  @ApiProperty({ example: 'null' })
  errors: { [key: string]: any };
}
