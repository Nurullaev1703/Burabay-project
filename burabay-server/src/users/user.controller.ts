import { Controller, Get, Body, Patch, Param, Delete, Request, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/test-create-user.dto';
import { Public } from 'src/constants';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
@Public()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({
    schema: {
      example: UserController.testJson,
    },
  })
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get('filial/:filialId')
  findAll(@Request() req: AuthRequest, @Param('filialId') filialId: string) {
    return this.userService.findAll(req.user, filialId);
  }

  @Get(':employeeId')
  findOne(@Param('employeeId') employeeId: string) {
    return this.userService.findOne(employeeId);
  }

  @Patch(':employeeId')
  update(@Param('employeeId') id: string, @Body() updateEmployeeDto: any) {
    return this.userService.update(id, updateEmployeeDto);
  }

  @Delete(':employeeId')
  remove(@Param('employeeId') id: string) {
    return this.userService.remove(id);
  }

  private static testJson = {
    'full_name': 'Rayan Gosling',
    'phone_number': '+77077046669',
    'role': 'турист',
    'email': 'sigma@gmail.com',
    'password': 'qwerty',
  };
}
