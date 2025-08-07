import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpException,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse 
} from '@nestjs/swagger';
import { ScrapeUrlUseCase } from '../../../../application/use-cases/scrape-url.use-case';
import { ScrapeUrlDto, ScrapeResultDto } from '../../../../application/dtos/scraping.dto';

@ApiTags('scraping')
@Controller('scraping')
export class ScrapingController {
  constructor(
    private readonly scrapeUrlUseCase: ScrapeUrlUseCase,
  ) {}

  @Post('scrape-url')
  @ApiOperation({ 
    summary: 'Scrape URL for links',
    description: 'Scrapes a given URL to extract the page title and all links, then saves them to the database'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'URL scraped successfully',
    type: ScrapeResultDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid URL provided',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'array',
          items: { type: 'string' },
          example: ['url must be a valid URL']
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Scraping failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Failed to scrape URL' },
        error: { type: 'string', example: 'Internal Server Error' }
      }
    }
  })
  @ApiBody({ type: ScrapeUrlDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async scrapeUrl(@Body() scrapeUrlDto: ScrapeUrlDto): Promise<{
    message: string;
    data: ScrapeResultDto;
  }> {
    try {
      const result = await this.scrapeUrlUseCase.execute(scrapeUrlDto);
      
      return {
        message: 'URL scraped successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to scrape URL',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
