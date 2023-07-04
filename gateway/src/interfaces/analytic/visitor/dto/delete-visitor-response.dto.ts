import { ApiProperty } from '@nestjs/swagger';

export class DeleteVisitorResponseDto {
  @ApiProperty({ example: 'visitor_delete_by_id_success' })
  message: string;
  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null;
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
