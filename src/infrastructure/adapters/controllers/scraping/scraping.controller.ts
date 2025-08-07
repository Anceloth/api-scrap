import { 
  Controller, 
  Post, 
  Get,
  Body, 
  Query,
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
  ApiQuery,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse 
} from '@nestjs/swagger';
import { ScrapeUrlUseCase } from '../../../../application/use-cases/scrape-url.use-case';
import { GetUrlsUseCase } from '../../../../application/use-cases/get-urls.use-case';
import { ScrapeUrlDto, ScrapeResultDto } from '../../../../application/dtos/scraping.dto';
import { GetUrlsDto, PaginatedUrlsResponseDto } from '../../../../application/dtos/get-urls.dto';

@ApiTags('scraping')
@Controller('scraping')
export class ScrapingController {
  constructor(
    private readonly scrapeUrlUseCase: ScrapeUrlUseCase,
    private readonly getUrlsUseCase: GetUrlsUseCase,
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

  @Get('urls')
  @ApiOperation({ 
    summary: 'Get paginated list of URLs',
    description: 'Returns a paginated list of all scraped URLs with their link counts'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
    example: 5,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'URLs retrieved successfully',
    type: PaginatedUrlsResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'array',
          items: { type: 'string' },
          example: ['Page must be at least 1', 'Limit cannot be more than 100']
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Failed to retrieve URLs' },
        error: { type: 'string', example: 'Internal Server Error' }
      }
    }
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getUrls(@Query() getUrlsDto: GetUrlsDto): Promise<{
    message: string;
    data: PaginatedUrlsResponseDto;
  }> {
    try {
      const result = await this.getUrlsUseCase.execute(getUrlsDto);
      
      return {
        message: 'URLs retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve URLs',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
