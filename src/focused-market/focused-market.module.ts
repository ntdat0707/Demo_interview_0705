import { Module } from '@nestjs/common';
import { FocusedMarketController } from './focused-market.controller';
import { FocusedMarketService } from './focused-market.service';

@Module({
  controllers: [FocusedMarketController],
  providers: [FocusedMarketService],
})
export class FocusedMarketModule {}
