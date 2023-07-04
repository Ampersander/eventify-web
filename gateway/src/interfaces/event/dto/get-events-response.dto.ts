import { ApiProperty } from '@nestjs/swagger';
import { IEvent } from '../event.interface';

export class GetEventsResponseDto {
  @ApiProperty({ example: 'event_search_success' })
  message: string;
  @ApiProperty({
    example: {
      events: [
        {
          notification_id: null,
          name: 'test event',
          description: 'test event description',
          start_time: +new Date(),
          duration: 90000,
          user_id: '5d987c3bfb881ec86b476bca',
          is_solved: false,
          created_at: +new Date(),
          updated_at: +new Date(),
          id: '5d987c3bfb881ec86b476bcc',
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
