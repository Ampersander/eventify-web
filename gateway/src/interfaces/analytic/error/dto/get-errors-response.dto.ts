import { ApiProperty } from '@nestjs/swagger';
import { IError } from '../error.interface';

export class GetErrorsResponseDto {
  @ApiProperty({ example: 'error_search_success' })
  message: string;
  @ApiProperty({
    example: {
      errors: [
        {
          message: 'Uncaught ReferenceError: a is not defined',
          source: 'http://localhost:3000/',
          lineno: 1,
          colno: 1,
          error: null,
          timestamp: '2021-08-02T08:00:00.000Z',
          visitorId: '1',
        },
      ],
    },
    nullable: true,
  })
  data: {
    errors: IError[];
  };
  @ApiProperty({ example: 'null' })
  errors: { [key: string]: any };
}
