import { Injectable, Inject } from '@nestjs/common';
import { UrlRepository } from '../ports/url-repository.port';
import { GetUrlsDto, PaginatedUrlsResponseDto } from '../dtos/get-urls.dto';
import { URL_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection.tokens';

@Injectable()
export class GetUrlsUseCase {
  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private readonly urlRepository: UrlRepository,
  ) {}

  async execute(getUrlsDto: GetUrlsDto): Promise<PaginatedUrlsResponseDto> {
    const { page = 1, limit = 5 } = getUrlsDto;

    // Get URLs with pagination and links count
    const result = await this.urlRepository.findAllWithLinksCount({
      page,
      limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      urls: result.urls,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
