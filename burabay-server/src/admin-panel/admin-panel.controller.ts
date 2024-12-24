import { Controller } from '@nestjs/common';
import { Public } from 'src/constants';

@Controller('admin')
@Public()
export class AdminPanelController {}
