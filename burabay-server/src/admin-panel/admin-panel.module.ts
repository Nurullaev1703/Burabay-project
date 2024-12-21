import { Module } from '@nestjs/common';
import { AdminPanelController } from './admin-panel.controller';

@Module({
  imports: [],
  controllers: [AdminPanelController],
  providers: [],
  exports: [],
})
export class AdminPanelModule {}
