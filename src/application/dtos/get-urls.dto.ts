import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUrlsDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    required: false,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 5,
    required: false,
    default: 5,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot be more than 100' })
  limit?: number = 5;
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

export class PaginationMetadataDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Total number of pages', example: 3 })
  totalPages: number;

  @ApiProperty({ description: 'Total number of URLs', example: 15 })
  totalItems: number;

  @ApiProperty({ description: 'Number of items per page', example: 5 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page', example: false })
  hasPreviousPage: boolean;
}

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
