import { ApiProperty } from '@nestjs/swagger';
import { IEvent } from '../event.interface';

export class UpdateEventResponseDto {
  @ApiProperty({ example: 'event_update_by_id_success' })
  message: string;
  @ApiProperty({
    example: {
      event: {
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
    },
    nullable: true,
  })
  data: {
    event: IEvent;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
