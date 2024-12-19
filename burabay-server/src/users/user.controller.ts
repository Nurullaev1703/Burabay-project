import { Controller, Delete, Request, Post } from '@nestjs/common';
import { ApiBearerAuth,  ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Public } from 'src/constants';

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

  private static testJson = {
    'full_name': 'Rayan Gosling',
    'phone_number': '+77077046669',
    'role': 'турист',
    'email': 'sigma@gmail.com',
    'password': 'qwerty',
  };
}
