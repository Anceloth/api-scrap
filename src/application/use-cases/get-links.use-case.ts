import { Injectable, Inject } from '@nestjs/common';
import { LinkRepository } from '../ports/link-repository.port';
import { GetLinksDto, GetLinksResponseDto } from '../dtos/get-links.dto';
import { LINK_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection.tokens';

@Injectable()
export class GetLinksUseCase {
  constructor(
    @Inject(LINK_REPOSITORY_TOKEN)
    private readonly linkRepository: LinkRepository
  ) {}

  async execute(input: GetLinksDto): Promise<GetLinksResponseDto> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const result = await this.linkRepository.findByUrl({
      url: input.url,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      links: result.links,
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
