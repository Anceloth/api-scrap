import { Injectable, Inject } from '@nestjs/common';
import { UrlRepository } from '../ports/url-repository.port';
import { LinkRepository } from '../ports/link-repository.port';
import { WebScrapingPort } from '../ports/web-scraping.port';
import { ScrapeUrlDto, ScrapeResultDto } from '../dtos/scraping.dto';
import { 
  URL_REPOSITORY_TOKEN, 
  LINK_REPOSITORY_TOKEN, 
  WEB_SCRAPING_TOKEN 
} from '../../infrastructure/tokens/injection.tokens';

@Injectable()
export class ScrapeUrlUseCase {
  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private readonly urlRepository: UrlRepository,
    @Inject(LINK_REPOSITORY_TOKEN)
    private readonly linkRepository: LinkRepository,
    @Inject(WEB_SCRAPING_TOKEN)
    private readonly webScraping: WebScrapingPort,
  ) {}

  async execute(scrapeUrlDto: ScrapeUrlDto): Promise<ScrapeResultDto> {
    const { url } = scrapeUrlDto;

    // Check if URL already exists
    let urlRecord = await this.urlRepository.findByUrl(url);
    
    // Scrape the URL to get title and links
    const scrapingResult = await this.webScraping.scrapeUrl(url);

    if (urlRecord) {
      // If URL exists, delete old links and update with new ones
      await this.linkRepository.deleteByUrlId(urlRecord.id);
    } else {
      // Create new URL record
      urlRecord = await this.urlRepository.create({
        name: scrapingResult.title,
        url: url,
      });
    }

    // Prepare links data for bulk insert
    const linksData = scrapingResult.links.map(link => ({
      urlId: urlRecord.id,
      link: link.link,
      name: link.name,
    }));

    // Save all links to database
    const savedLinks = await this.linkRepository.createMany(linksData);

    // Return the result
    return {
      url: {
        id: urlRecord.id,
        name: urlRecord.name,
        url: urlRecord.url,
        createdAt: urlRecord.createdAt,
        updatedAt: urlRecord.updatedAt,
      },
      links: savedLinks.map(link => ({
        link: link.link,
        name: link.name,
      })),
      totalLinks: savedLinks.length,
    };
  }
}
