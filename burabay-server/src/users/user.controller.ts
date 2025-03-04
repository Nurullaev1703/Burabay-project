import { Controller, Delete, Request, Post, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Public } from 'src/constants';
import { UpdateDocsDto } from './dto/update-docs.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Delete('/delete-account')
  remove(@Request() authRequest: AuthRequest) {
    return this.userService.remove(authRequest.user);
  }

  @Public()
  @Post('delete-empty-password-users')
  deleteEmptyPasswordUsers() {
    return this.userService.deleteEmptyPasswordUsers();
  }

  @Public()
  @Post('delete-empty-name-orgs')
  deleteEmptyNameOrgs() {
    return this.userService.deleteOrganizationsAndUsers();
  }

  @ApiBearerAuth()
  @Patch('/docs-path')
  async updateOrgDocumentsPath(@Body() dto: UpdateDocsDto, @Request() auth: AuthRequest) {
    return await this.userService.updateOrgDocumentsPath(dto, auth.user);
  }

  private static testJson = {
    'full_name': 'Rayan Gosling',
    'phone_number': '+77077046669',
    'role': 'турист',
    'email': 'sigma@gmail.com',
    'password': 'qwerty',
  };
}
