import { Injectable, Inject } from '@nestjs/common';
import { UrlRepository } from '../ports/url-repository.port';
import { GetUrlsDto, PaginatedUrlsResponseDto } from '../dtos/get-urls.dto';
import { URL_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection.tokens';
import { PaginationHelper } from '../../shared/utils/pagination.helper';

@Injectable()
export class GetUrlsUseCase {
  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private readonly urlRepository: UrlRepository,
  ) {}

  async execute(getUrlsDto: GetUrlsDto): Promise<PaginatedUrlsResponseDto> {
    const options = PaginationHelper.normalizePaginationOptions(
      getUrlsDto.page,
      getUrlsDto.limit,
      5 // Default limit for URLs
    );

    // Get URLs with pagination and links count
    const result = await this.urlRepository.findAllWithLinksCount(options);

    // Calculate pagination metadata using helper
    const pagination = PaginationHelper.calculateMetadata(options, result.total);

    return {
      urls: result.urls,
      pagination,
    };
  }
}
