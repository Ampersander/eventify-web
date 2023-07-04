import { ApiProperty } from '@nestjs/swagger';
import { IEvent } from '../event.interface';

export class GetEventsResponseDto {
  @ApiProperty({ example: 'event_search_success' })
  message: string;
  @ApiProperty({
    example: {
      events: [
        {
          eventType: 'click',
          actionId: '1',
          visitorId: '1',
          eventTime: '2021-08-02T08:00:00.000Z',
        },
      ],
    },
    nullable: true,
  })
  data: {
    events: IEvent[];
  };
  @ApiProperty({ example: 'null' })
  errors: { [key: string]: any };
}
