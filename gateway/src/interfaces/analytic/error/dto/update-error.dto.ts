import { ApiProperty } from '@nestjs/swagger';

export class UpdateErrorDto {
  @ApiProperty({ example: 'Uncaught ReferenceError: a is not defined' })
  message: string;
  @ApiProperty({ example: 'http://localhost:3000/' })
  source: string;
  @ApiProperty({ example: 1 })
  lineno: number;
  @ApiProperty({ example: 1 })
  colno: number;
  @ApiProperty({ example: null })
  error: string | null;
  @ApiProperty({ example: '2021-08-02T08:00:00.000Z' })
  timestamp: string;
  @ApiProperty({ example: '1' })
  visitorId: string;
}
