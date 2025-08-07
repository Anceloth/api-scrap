import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto, PaginationMetadataDto, PaginatedResponseDto } from '../../shared/dtos/pagination.dto';

// Example of how to create a new pagination DTO for any entity

// 1. Extender PaginationQueryDto para el input
export class GetExampleItemsDto extends PaginationQueryDto {
  // Add specific fields if needed
  // For example, filters, searches, etc.
  
  // Opcionalmente sobrescribir defaults
  limit?: number = 20; // Default diferente si es necesario
}

// 2. Crear el DTO de la entidad
export class ExampleItemDto {
  @ApiProperty({ description: 'ID del item' })
  id: string;
  
  @ApiProperty({ description: 'Nombre del item' })
  name: string;
  
  // ... otros campos
}

// 3. Option A: Use the generic PaginatedResponseDto class
export class PaginatedExampleItemsResponseDto extends PaginatedResponseDto<ExampleItemDto> {
  @ApiProperty({
    description: 'Lista de items',
    type: [ExampleItemDto]
  })
  items: ExampleItemDto[];
  
  // pagination is inherited automatically
}

// 4. Option B: Create a response with custom structure (like current urls/links)
export class CustomExampleResponseDto {
  @ApiProperty({
    description: 'Lista de items con nombre personalizado',
    type: [ExampleItemDto]
  })
  exampleItems: ExampleItemDto[]; // Nombre personalizado en lugar de 'items'

  @ApiProperty({
    description: 'Metadata de paginación',
    type: PaginationMetadataDto
  })
  pagination: PaginationMetadataDto;
}
