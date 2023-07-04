import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty({ example: 'click' })
  eventType: string;
  @ApiProperty({ example: '1' })
  actionId: string;
  @ApiProperty({ example: '1' })
  visitorId: string;
  @ApiProperty({ example: '2021-08-02T08:00:00.000Z' })
  eventTime: string;
}
