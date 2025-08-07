import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Url } from '../database/models/url.model';
import { Link } from '../database/models/link.model';
import { ScrapingController } from '../adapters/controllers/scraping/scraping.controller';
import { ScrapeUrlUseCase } from '../../application/use-cases/scrape-url.use-case';
import { GetUrlsUseCase } from '../../application/use-cases/get-urls.use-case';
import { GetLinksUseCase } from '../../application/use-cases/get-links.use-case';
import { SequelizeUrlRepository } from '../adapters/repositories/sequelize-url.repository';
import { SequelizeLinkRepository } from '../adapters/repositories/sequelize-link.repository';
import { CheerioWebScrapingAdapter } from '../adapters/cheerio-web-scraping.adapter';
import { 
  URL_REPOSITORY_TOKEN, 
  LINK_REPOSITORY_TOKEN, 
  WEB_SCRAPING_TOKEN 
} from '../tokens/injection.tokens';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Url, Link])
  ],
  controllers: [ScrapingController],
  providers: [
    ScrapeUrlUseCase,
    GetUrlsUseCase,
    GetLinksUseCase,
    {
      provide: URL_REPOSITORY_TOKEN,
      useClass: SequelizeUrlRepository,
    },
    {
      provide: LINK_REPOSITORY_TOKEN,
      useClass: SequelizeLinkRepository,
    },
    {
      provide: WEB_SCRAPING_TOKEN,
      useClass: CheerioWebScrapingAdapter,
    },
  ],
  exports: [ScrapeUrlUseCase, GetUrlsUseCase, GetLinksUseCase],
})
export class ScrapingModule {}
