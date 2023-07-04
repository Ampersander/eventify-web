import { ApiProperty } from '@nestjs/swagger';

export class VisitorIdDto {
  @ApiProperty()
  id: string;
}
