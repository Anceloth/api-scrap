import { GetUrlsUseCase } from '../get-urls.use-case';
import { UrlRepository } from '../../ports/url-repository.port';

const MOCK_URLS = {
  google: {
    id: 'url-1',
    name: 'Google',
    url: 'https://google.com',
    linksCount: 5,
    createdAt: new Date('2025-08-07T10:00:00Z'),
    updatedAt: new Date('2025-08-07T10:00:00Z'),
  },
  github: {
    id: 'url-2',
    name: 'GitHub',
    url: 'https://github.com',
    linksCount: 12,
    createdAt: new Date('2025-08-07T09:00:00Z'),
    updatedAt: new Date('2025-08-07T09:00:00Z'),
  },
  stackoverflow: {
    id: 'url-3',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    linksCount: 8,
    createdAt: new Date('2025-08-07T08:00:00Z'),
    updatedAt: new Date('2025-08-07T08:00:00Z'),
  },
  example: {
    id: 'url-9',
    name: 'Example Site',
    url: 'https://example.com',
    linksCount: 3,
    createdAt: new Date('2025-08-07T07:00:00Z'),
    updatedAt: new Date('2025-08-07T07:00:00Z'),
  },
  test: {
    id: 'url-10',
    name: 'Test Site',
    url: 'https://test.com',
    linksCount: 1,
    createdAt: new Date('2025-08-07T06:00:00Z'),
    updatedAt: new Date('2025-08-07T06:00:00Z'),
  },
};

const MOCK_URL_ARRAYS = {
  firstPage: [MOCK_URLS.google, MOCK_URLS.github, MOCK_URLS.stackoverflow],
  lastPage: [MOCK_URLS.example, MOCK_URLS.test],
  empty: [],
};

describe('GetUrlsUseCase', () => {
  let getUrlsUseCase: GetUrlsUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(() => {
    // Create mocked dependencies
    urlRepository = {
      create: jest.fn(),
      findByUrl: jest.fn(),
      findAllWithLinksCount: jest.fn(),
    };

    getUrlsUseCase = new GetUrlsUseCase(urlRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated URLs with correct pagination metadata when URLs exist', async () => {
      // Arrange
      const input = { page: 1, limit: 3 };
      const mockRepositoryResponse = {
        urls: MOCK_URL_ARRAYS.firstPage,
        total: 10,
      };

      urlRepository.findAllWithLinksCount.mockResolvedValue(mockRepositoryResponse);

      const result = await getUrlsUseCase.execute(input);

      expect(urlRepository.findAllWithLinksCount).toHaveBeenCalledWith({
        page: 1,
        limit: 3,
      });

      expect(result).toEqual({
        urls: MOCK_URL_ARRAYS.firstPage,
        pagination: {
          currentPage: 1,
          totalPages: 4, // 10 total items / 3 per page = 3.33, rounded up to 4
          totalItems: 10,
          itemsPerPage: 3,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });

    it('should return empty URLs list with zero pagination when no URLs exist', async () => {
      // Arrange
      const input = { page: 1, limit: 5 };
      const mockRepositoryResponse = {
        urls: MOCK_URL_ARRAYS.empty,
        total: 0,
      };

      urlRepository.findAllWithLinksCount.mockResolvedValue(mockRepositoryResponse);

      const result = await getUrlsUseCase.execute(input);

      expect(urlRepository.findAllWithLinksCount).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
      });

      expect(result).toEqual({
        urls: MOCK_URL_ARRAYS.empty,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it('should handle pagination correctly for the last page with remaining items', async () => {
      // Arrange
      const input = { page: 3, limit: 4 }; // Last page with partial items
      const mockRepositoryResponse = {
        urls: MOCK_URL_ARRAYS.lastPage,
        total: 10, // Total 10 items, page 3 with limit 4 should have 2 remaining items
      };

      urlRepository.findAllWithLinksCount.mockResolvedValue(mockRepositoryResponse);

      const result = await getUrlsUseCase.execute(input);

      expect(urlRepository.findAllWithLinksCount).toHaveBeenCalledWith({
        page: 3,
        limit: 4,
      });

      expect(result).toEqual({
        urls: MOCK_URL_ARRAYS.lastPage,
        pagination: {
          currentPage: 3,
          totalPages: 3, // 10 total items / 4 per page = 2.5, rounded up to 3
          totalItems: 10,
          itemsPerPage: 4,
          hasNextPage: false, // This is the last page
          hasPreviousPage: true, // There are previous pages
        },
      });
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const input = { page: 1, limit: 5 };
      const mockError = new Error('Database connection failed');

      urlRepository.findAllWithLinksCount.mockRejectedValue(mockError);

      // Act & Assert
      await expect(getUrlsUseCase.execute(input)).rejects.toThrow('Database connection failed');
      
      expect(urlRepository.findAllWithLinksCount).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
      });
    });
  });
});
