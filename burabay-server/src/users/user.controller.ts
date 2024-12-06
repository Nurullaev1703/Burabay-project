import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';

@ApiTags('Сотрудники')
@ApiBearerAuth()
@Controller('employees')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("filial/:filialId")
  findAll(@Request() req:AuthRequest,@Param("filialId") filialId:string) {
    return this.userService.findAll(req.user, filialId);
  }

  @Get(":employeeId")
  findOne(@Param("employeeId") employeeId: string) {
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
}
