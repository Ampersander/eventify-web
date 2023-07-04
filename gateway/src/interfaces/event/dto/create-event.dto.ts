import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'test event' })
  name: string;
  @ApiProperty({ example: 'test event description' })
  description: string;
  @ApiProperty({ example: +new Date() })
  start_time: number;
  @ApiProperty({ example: 90000 })
  duration: number;
}
