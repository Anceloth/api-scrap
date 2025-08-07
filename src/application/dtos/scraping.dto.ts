import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapeUrlDto {
  @ApiProperty({
    description: 'URL to scrape for links',
    example: 'https://www.example.com',
    format: 'url'
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}

export class ScrapedLinkDto {
  @ApiProperty({
    description: 'The extracted link URL',
    example: 'https://www.w3schools.com'
  })
  link: string;

  @ApiProperty({
    description: 'The link text/name',
    example: 'Visit W3Schools.com!'
  })
  name: string;
}

export class ScrapeResultDto {
  @ApiProperty({
    description: 'The created URL record',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      name: { type: 'string', example: 'Example Website' },
      url: { type: 'string', example: 'https://www.example.com' },
      createdAt: { type: 'string', example: '2025-08-06T23:42:37.173Z' },
      updatedAt: { type: 'string', example: '2025-08-06T23:42:37.173Z' }
    }
  })
  url: {
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({
    description: 'List of scraped links',
    type: [ScrapedLinkDto]
  })
  links: ScrapedLinkDto[];

  @ApiProperty({
    description: 'Total number of links found',
    example: 15
  })
  totalLinks: number;
}
