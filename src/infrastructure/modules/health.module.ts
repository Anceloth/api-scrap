import { Module } from '@nestjs/common';
import { HealthController } from '../adapters/controllers/health/health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
