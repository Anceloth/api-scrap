import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ScrapingController } from '../src/infrastructure/adapters/controllers/scraping/scraping.controller';
import { ScrapeUrlUseCase } from '../src/application/use-cases/scrape-url.use-case';
import { GetUrlsUseCase } from '../src/application/use-cases/get-urls.use-case';
import { GetLinksUseCase } from '../src/application/use-cases/get-links.use-case';
import { URL_REPOSITORY_TOKEN, LINK_REPOSITORY_TOKEN, WEB_SCRAPING_TOKEN } from '../src/infrastructure/tokens/injection.tokens';

describe('Scraping Controller (e2e)', () => {
  let app: INestApplication;
  let scrapeUrlUseCase: jest.Mocked<ScrapeUrlUseCase>;
  let getUrlsUseCase: jest.Mocked<GetUrlsUseCase>;

  beforeAll(async () => {
    // Create mocked use case
    const mockScrapeUrlUseCase = {
      execute: jest.fn(),
    };

    const mockGetUrlsUseCase = {
      execute: jest.fn(),
    };

    const mockGetLinksUseCase = {
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
          provide: GetLinksUseCase,
          useValue: mockGetLinksUseCase,
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
    
    // Get fresh reference to the mocked use case for each test
    getUrlsUseCase = app.get(GetUrlsUseCase);
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

  describe('GET /scraping/urls', () => {
    it('should return paginated URLs with default pagination when no query params provided', async () => {
      // Arrange
      const mockResult = {
        urls: [
          {
            id: 'url-1',
            name: 'Google',
            url: 'https://google.com',
            linksCount: 15,
            createdAt: new Date('2025-08-07T10:00:00Z'),
            updatedAt: new Date('2025-08-07T10:00:00Z'),
          },
          {
            id: 'url-2',
            name: 'GitHub',
            url: 'https://github.com',
            linksCount: 28,
            createdAt: new Date('2025-08-07T09:00:00Z'),
            updatedAt: new Date('2025-08-07T09:00:00Z'),
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 10,
          itemsPerPage: 5,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };

      getUrlsUseCase.execute.mockResolvedValue(mockResult);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/scraping/urls')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'URLs retrieved successfully');
      expect(response.body).toHaveProperty('data');
      
      // Compare URLs with string dates (as they are serialized in JSON)
      const expectedUrls = [
        {
          id: 'url-1',
          name: 'Google',
          url: 'https://google.com',
          linksCount: 15,
          createdAt: '2025-08-07T10:00:00.000Z',
          updatedAt: '2025-08-07T10:00:00.000Z',
        },
        {
          id: 'url-2',
          name: 'GitHub',
          url: 'https://github.com',
          linksCount: 28,
          createdAt: '2025-08-07T09:00:00.000Z',
          updatedAt: '2025-08-07T09:00:00.000Z',
        },
      ];
      
      expect(response.body.data.urls).toEqual(expectedUrls);
      expect(response.body.data.pagination).toEqual(mockResult.pagination);
      
      // Should be called with default values (page=1, limit=5)
      expect(getUrlsUseCase.execute).toHaveBeenCalledWith({ page: 1, limit: 5 });
    });

    it('should return paginated URLs with custom pagination parameters', async () => {
      // Arrange
      const mockResult = {
        urls: [
          {
            id: 'url-3',
            name: 'Stack Overflow',
            url: 'https://stackoverflow.com',
            linksCount: 42,
            createdAt: new Date('2025-08-07T08:00:00Z'),
            updatedAt: new Date('2025-08-07T08:00:00Z'),
          },
        ],
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      };

      getUrlsUseCase.execute.mockResolvedValue(mockResult);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/scraping/urls')
        .query({ page: 2, limit: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'URLs retrieved successfully');
      expect(response.body).toHaveProperty('data');
      
      // Compare URLs with string dates (as they are serialized in JSON)
      const expectedUrls = [
        {
          id: 'url-3',
          name: 'Stack Overflow',
          url: 'https://stackoverflow.com',
          linksCount: 42,
          createdAt: '2025-08-07T08:00:00.000Z',
          updatedAt: '2025-08-07T08:00:00.000Z',
        },
      ];
      
      expect(response.body.data.urls).toEqual(expectedUrls);
      expect(response.body.data.pagination).toEqual(mockResult.pagination);
      
      // Should be called with provided query parameters
      expect(getUrlsUseCase.execute).toHaveBeenCalledWith({ page: 2, limit: 10 });
    });

    it('should handle invalid pagination parameters and return validation errors', async () => {
      // Test with invalid page (negative number)
      let response = await request(app.getHttpServer())
        .get('/scraping/urls')
        .query({ page: -1, limit: 5 })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('statusCode', 400);

      // Test with invalid limit (too high)
      response = await request(app.getHttpServer())
        .get('/scraping/urls')
        .query({ page: 1, limit: 101 })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('statusCode', 400);

      // Use case should not be called for invalid input
      expect(getUrlsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return empty result when no URLs exist', async () => {
      // Arrange
      const mockResult = {
        urls: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      getUrlsUseCase.execute.mockResolvedValue(mockResult);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/scraping/urls')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'URLs retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.urls).toEqual([]);
      expect(response.body.data.pagination.totalItems).toBe(0);
      expect(response.body.data.pagination.totalPages).toBe(0);
      
      expect(getUrlsUseCase.execute).toHaveBeenCalledWith({ page: 1, limit: 5 });
    });
  });
});
