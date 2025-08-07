import { Injectable, Inject } from '@nestjs/common';
import { LinkRepository } from '../ports/link-repository.port';
import { GetLinksDto, GetLinksResponseDto } from '../dtos/get-links.dto';
import { LINK_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection.tokens';
import { PaginationHelper } from '../../shared/utils/pagination.helper';

@Injectable()
export class GetLinksUseCase {
  constructor(
    @Inject(LINK_REPOSITORY_TOKEN)
    private readonly linkRepository: LinkRepository
  ) {}

  async execute(input: GetLinksDto): Promise<GetLinksResponseDto> {
    const options = PaginationHelper.normalizePaginationOptions(
      input.page,
      input.limit,
      10 // Default limit for links
    );

    const result = await this.linkRepository.findByUrl({
      url: input.url,
      page: options.page,
      limit: options.limit,
    });

    // Calculate pagination metadata using helper
    const pagination = PaginationHelper.calculateMetadata(options, result.total);

    return {
      links: result.links,
      pagination,
    };
  }
}
