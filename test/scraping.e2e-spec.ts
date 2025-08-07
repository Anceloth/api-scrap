import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ScrapingController } from '../src/infrastructure/adapters/controllers/scraping/scraping.controller';
import { ScrapeUrlUseCase } from '../src/application/use-cases/scrape-url.use-case';
import { GetUrlsUseCase } from '../src/application/use-cases/get-urls.use-case';
import { URL_REPOSITORY_TOKEN, LINK_REPOSITORY_TOKEN, WEB_SCRAPING_TOKEN } from '../src/infrastructure/tokens/injection.tokens';

describe('Scraping Controller (e2e)', () => {
  let app: INestApplication;
  let scrapeUrlUseCase: jest.Mocked<ScrapeUrlUseCase>;

  beforeAll(async () => {
    // Create mocked use case
    const mockScrapeUrlUseCase = {
      execute: jest.fn(),
    };

    const mockGetUrlsUseCase = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ScrapingController],
      providers: [
        {
          provide: ScrapeUrlUseCase,
          useValue: mockScrapeUrlUseCase,
        },
        {
          provide: GetUrlsUseCase,
          useValue: mockGetUrlsUseCase,
        },
        {
          provide: URL_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: LINK_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: WEB_SCRAPING_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    scrapeUrlUseCase = moduleFixture.get(ScrapeUrlUseCase);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /scraping/scrape-url', () => {
    it('should successfully scrape a valid URL and return extracted links', async () => {
      // Arrange
      const testUrl = 'https://example.com';
      const mockResult = {
        url: {
          id: 'url-123',
          name: 'Example Domain',
          url: testUrl,
          createdAt: new Date('2025-08-07T11:39:29.361Z'),
          updatedAt: new Date('2025-08-07T11:39:29.361Z'),
        },
        links: [
          { link: 'https://example.com/page1', name: 'Page 1' },
          { link: 'https://example.com/page2', name: 'Page 2' },
        ],
        totalLinks: 2,
      };

      scrapeUrlUseCase.execute.mockResolvedValue(mockResult);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/scraping/scrape-url')
        .send({ url: testUrl })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'URL scraped successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.url.id).toBe(mockResult.url.id);
      expect(response.body.data.url.name).toBe(mockResult.url.name);
      expect(response.body.data.url.url).toBe(mockResult.url.url);
      expect(response.body.data.links).toEqual(mockResult.links);
      expect(response.body.data.totalLinks).toBe(mockResult.totalLinks);
      expect(scrapeUrlUseCase.execute).toHaveBeenCalledWith({ url: testUrl });
    });

    it('should handle invalid URL and return appropriate error', async () => {
      const invalidUrl = 'not-a-valid-url';
      const response = await request(app.getHttpServer())
        .post('/scraping/scrape-url')
        .send({ url: invalidUrl })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('statusCode', 400);
      
      // Ensure the validation error message is appropriate
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('url must be a URL address')
        ])
      );

      // Use case should not be called for invalid input
      expect(scrapeUrlUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
