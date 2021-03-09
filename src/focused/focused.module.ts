import { Module } from '@nestjs/common';
import { FocusedController } from './focused.controller';
import { FocusedService } from './focused.service';

@Module({
  controllers: [FocusedController],
  providers: [FocusedService],
})
export class FocusedModule {}
