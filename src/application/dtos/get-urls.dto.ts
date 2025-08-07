import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto, PaginationMetadataDto } from '../../shared/dtos/pagination.dto';

export class GetUrlsDto extends PaginationQueryDto {
  // Inherits page and limit from PaginationQueryDto
  // But we can override the default limit value if needed
  @ApiProperty({
    description: 'Number of items per page',
    example: 5,
    required: false,
    default: 5,
    minimum: 1,
    maximum: 100
  })
  limit?: number = 5; // Overrides the default for URLs
}

export class UrlWithLinksCountDto {
  @ApiProperty({
    description: 'Unique identifier of the URL',
    example: 'dc77e9b9-bd64-4841-81dd-f33cd8e50486'
  })
  id: string;

  @ApiProperty({
    description: 'Name/title of the webpage',
    example: 'W3Schools Online Web Tutorials'
  })
  name: string;

  @ApiProperty({
    description: 'The scraped URL',
    example: 'https://www.w3schools.com'
  })
  url: string;

  @ApiProperty({
    description: 'Number of links found in this URL',
    example: 268
  })
  linksCount: number;

  @ApiProperty({
    description: 'Date when the URL was created',
    example: '2025-08-07T11:12:59.428Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the URL was last updated',
    example: '2025-08-07T11:12:59.428Z'
  })
  updatedAt: Date;
}

// Maintains the current structure for compatibility
export class PaginatedUrlsResponseDto {
  @ApiProperty({
    description: 'List of URLs with their link counts',
    type: [UrlWithLinksCountDto]
  })
  urls: UrlWithLinksCountDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetadataDto
  })
  pagination: PaginationMetadataDto;
}
