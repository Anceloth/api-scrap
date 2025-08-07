import { PaginationMetadataDto, PaginationOptions, PaginatedResult } from '../dtos/pagination.dto';

export class PaginationHelper {
  /**
   * Calcula los metadatos de paginación basado en el resultado y opciones
   */
  static calculateMetadata(
    options: PaginationOptions,
    total: number
  ): PaginationMetadataDto {
    const { page, limit } = options;
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    };
  }

  /**
   * Convierte opciones de paginación asegurando valores por defecto
   */
  static normalizePaginationOptions(
    page?: number,
    limit?: number,
    defaultLimit: number = 10
  ): PaginationOptions {
    return {
      page: page || 1,
      limit: limit || defaultLimit,
    };
  }

  /**
   * Calcula offset para queries de base de datos
   */
  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Crea una respuesta paginada completa
   */
  static createPaginatedResponse<T>(
    items: T[],
    options: PaginationOptions,
    total: number
  ): PaginatedResult<T> & { pagination: PaginationMetadataDto } {
    const pagination = this.calculateMetadata(options, total);
    
    return {
      items,
      total,
      pagination,
    };
  }
}

// Utility for validating pagination parameters
export class PaginationValidator {
  static readonly MAX_LIMIT = 100;
  static readonly MIN_PAGE = 1;
  static readonly MIN_LIMIT = 1;

  static validatePage(page: number): void {
    if (page < this.MIN_PAGE) {
      throw new Error(`Page must be at least ${this.MIN_PAGE}`);
    }
  }

  static validateLimit(limit: number): void {
    if (limit < this.MIN_LIMIT) {
      throw new Error(`Limit must be at least ${this.MIN_LIMIT}`);
    }
    if (limit > this.MAX_LIMIT) {
      throw new Error(`Limit cannot be more than ${this.MAX_LIMIT}`);
    }
  }

  static validatePagination(page: number, limit: number): void {
    this.validatePage(page);
    this.validateLimit(limit);
  }
}
