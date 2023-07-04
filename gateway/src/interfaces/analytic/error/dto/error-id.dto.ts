import { ApiProperty } from '@nestjs/swagger';

export class ErrorIdDto {
  @ApiProperty()
  id: string;
}
