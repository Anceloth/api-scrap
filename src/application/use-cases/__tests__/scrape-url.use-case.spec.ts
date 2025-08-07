import { ScrapeUrlUseCase } from '../scrape-url.use-case';
import { UrlRepository } from '../../ports/url-repository.port';
import { LinkRepository } from '../../ports/link-repository.port';
import { WebScrapingPort } from '../../ports/web-scraping.port';
import { ScrapeUrlDto } from '../../dtos/scraping.dto';

describe('ScrapeUrlUseCase', () => {
  let useCase: ScrapeUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let linkRepository: jest.Mocked<LinkRepository>;
  let webScrapingAdapter: jest.Mocked<WebScrapingPort>;

  beforeEach(() => {
    // Create mocked dependencies
    urlRepository = {
      create: jest.fn(),
      findByUrl: jest.fn(),
      findAllWithLinksCount: jest.fn(),
    };

    linkRepository = {
      createMany: jest.fn(),
      deleteByUrlId: jest.fn(),
    };

    webScrapingAdapter = {
      scrapeUrl: jest.fn(),
    };

    useCase = new ScrapeUrlUseCase(
      urlRepository,
      linkRepository,
      webScrapingAdapter,
    );
  });

  describe('execute', () => {
    it('should successfully scrape a URL and save data to repositories', async () => {
      // Arrange
      const scrapeUrlDto: ScrapeUrlDto = {
        url: 'https://example.com',
      };

      const scrapedData = {
        title: 'Example Domain',
        links: [
          { link: 'https://example.com/page1', name: 'Page 1' },
          { link: 'https://example.com/page2', name: 'Page 2' },
        ],
      };

      const savedUrl = {
        id: 'url-123',
        url: 'https://example.com',
        name: 'Example Domain',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedLinks = [
        {
          id: 'link-1',
          link: 'https://example.com/page1',
          name: 'Page 1',
          urlId: 'url-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'link-2',
          link: 'https://example.com/page2',
          name: 'Page 2',
          urlId: 'url-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock implementations
      urlRepository.findByUrl.mockResolvedValue(null); // URL doesn't exist yet
      webScrapingAdapter.scrapeUrl.mockResolvedValue(scrapedData);
      urlRepository.create.mockResolvedValue(savedUrl);
      linkRepository.createMany.mockResolvedValue(savedLinks);

      // Act
      const result = await useCase.execute(scrapeUrlDto);

      // Assert
      expect(urlRepository.findByUrl).toHaveBeenCalledWith('https://example.com');
      expect(webScrapingAdapter.scrapeUrl).toHaveBeenCalledWith('https://example.com');
      expect(urlRepository.create).toHaveBeenCalledWith({
        url: 'https://example.com',
        name: 'Example Domain',
      });
      expect(linkRepository.createMany).toHaveBeenCalledWith(
        [
          { link: 'https://example.com/page1', name: 'Page 1', urlId: 'url-123' },
          { link: 'https://example.com/page2', name: 'Page 2', urlId: 'url-123' },
        ]
      );

      expect(result).toEqual({
        url: savedUrl,
        links: [
          { link: 'https://example.com/page1', name: 'Page 1' },
          { link: 'https://example.com/page2', name: 'Page 2' },
        ],
        totalLinks: 2,
      });
    });

    it('should handle scraping failure and throw error', async () => {
      // Arrange
      const scrapeUrlDto: ScrapeUrlDto = {
        url: 'https://invalid-url.com',
      };

      const scrapingError = new Error('Failed to fetch URL');
      urlRepository.findByUrl.mockResolvedValue(null);
      webScrapingAdapter.scrapeUrl.mockRejectedValue(scrapingError);

      // Act & Assert
      await expect(useCase.execute(scrapeUrlDto)).rejects.toThrow(
        'Failed to fetch URL'
      );

      expect(urlRepository.findByUrl).toHaveBeenCalledWith('https://invalid-url.com');
      expect(webScrapingAdapter.scrapeUrl).toHaveBeenCalledWith('https://invalid-url.com');
      expect(urlRepository.create).not.toHaveBeenCalled();
      expect(linkRepository.createMany).not.toHaveBeenCalled();
    });

    it('should handle empty links result gracefully', async () => {
      // Arrange
      const scrapeUrlDto: ScrapeUrlDto = {
        url: 'https://empty-page.com',
      };

      const scrapedData = {
        title: 'Empty Page',
        links: [], // No links found
      };

      const savedUrl = {
        id: 'url-456',
        url: 'https://empty-page.com',
        name: 'Empty Page',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock implementations
      urlRepository.findByUrl.mockResolvedValue(null);
      webScrapingAdapter.scrapeUrl.mockResolvedValue(scrapedData);
      urlRepository.create.mockResolvedValue(savedUrl);
      linkRepository.createMany.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(scrapeUrlDto);

      // Assert
      expect(urlRepository.findByUrl).toHaveBeenCalledWith('https://empty-page.com');
      expect(webScrapingAdapter.scrapeUrl).toHaveBeenCalledWith('https://empty-page.com');
      expect(urlRepository.create).toHaveBeenCalledWith({
        url: 'https://empty-page.com',
        name: 'Empty Page',
      });
      expect(linkRepository.createMany).toHaveBeenCalledWith([]);

      expect(result).toEqual({
        url: savedUrl,
        links: [],
        totalLinks: 0,
      });
    });
  });
});
