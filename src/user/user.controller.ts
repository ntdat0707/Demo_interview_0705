import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { UpdateUserPipe } from '../lib/validatePipe/user/updateUserPipe.class';
import { AvatarInput, UpdateUserInput } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/upload-avatar')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: AvatarInput,
  })
  async uploadAvatar(@UploadedFile() image: AvatarInput) {
    return await this.userService.uploadAvatar(image);
  }

  @Put('/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserInput })
  async updateUser(@GetUser('userId') userId: string, @Body(new UpdateUserPipe()) userInput: UpdateUserInput) {
    return await this.userService.updateUser(userId, userInput);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@GetUser('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
