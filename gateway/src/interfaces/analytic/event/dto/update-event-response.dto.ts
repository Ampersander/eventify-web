import { ApiProperty } from '@nestjs/swagger';
import { IEvent } from '../event.interface';

export class UpdateEventResponseDto {
  @ApiProperty({ example: 'event_update_by_id_success' })
  message: string;
  @ApiProperty({
    example: {
      event: {
        eventType: 'click',
        actionId: '1',
        visitorId: '1',
        eventTime: '2021-08-02T08:00:00.000Z',
      },
    },
    nullable: true,
  })
  data: {
    event: IEvent;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
