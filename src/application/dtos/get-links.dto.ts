import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto, PaginationMetadataDto } from '../../shared/dtos/pagination.dto';

export class GetLinksQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'The URL to get links for',
    example: 'https://www.w3schools.com'
  })
  @IsNotEmpty()
  @IsUrl({}, { message: 'url must be a valid URL address' })
  url: string;

  // page y limit se heredan de PaginationQueryDto
}

export class GetLinksDto {
  @IsNotEmpty()
  url: string;

  page?: number = 1;
  limit?: number = 10;
}

export class LinkResponseDto {
  @ApiProperty({ description: 'Unique identifier of the link' })
  id: string;

  @ApiProperty({ description: 'ID of the URL this link belongs to' })
  urlId: string;

  @ApiProperty({ description: 'The actual link URL' })
  link: string;

  @ApiProperty({ description: 'Display name/text of the link' })
  name: string;

  @ApiProperty({ description: 'Date when the link was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the link was last updated' })
  updatedAt: Date;
}

// Mantiene la estructura actual para compatibilidad
export class GetLinksResponseDto {
  @ApiProperty({
    description: 'List of links for the URL',
    type: [LinkResponseDto]
  })
  links: LinkResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetadataDto
  })
  pagination: PaginationMetadataDto;
}
