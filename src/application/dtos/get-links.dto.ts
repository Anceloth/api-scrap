import { IsNotEmpty, IsString, IsOptional, IsInt, Min, Max, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetLinksQueryDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'url must be a valid URL address' })
  url: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class GetLinksDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class LinkResponseDto {
  id: string;
  urlId: string;
  link: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginationMetadataDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class GetLinksResponseDto {
  links: LinkResponseDto[];
  pagination: PaginationMetadataDto;
}
