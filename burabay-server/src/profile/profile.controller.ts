import { Body, Controller, Get, Patch, Request} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Public } from 'src/constants';

@ApiTags('Профиль')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  getProfile(@Request() req:AuthRequest){
    return this.profileService.getProfile(req.user)
  }
  @Get('/users')
  @Public()
  getUsers(){
    return this.profileService.getUsers()
  }
  
  @Patch()
  updateProfle(@Request() req:AuthRequest, @Body() updateProfileDto:UpdateProfileDto){
    return this.profileService.updateProfile(req.user, updateProfileDto)
  }
}
