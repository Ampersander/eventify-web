import { ApiProperty } from '@nestjs/swagger';
import { IError } from '../error.interface';

export class UpdateErrorResponseDto {
  @ApiProperty({ example: 'error_update_by_id_success' })
  message: string;
  @ApiProperty({
    example: {
      error: {
        message: 'Uncaught ReferenceError: a is not defined',
        source: 'http://localhost:3000/',
        lineno: 1,
        colno: 1,
        error: null,
        timestamp: '2021-08-02T08:00:00.000Z',
        visitorId: '1',
      },
    },
    nullable: true,
  })
  data: {
    error: IError;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
