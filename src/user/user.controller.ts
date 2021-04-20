import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateUserPipe } from '../lib/validatePipe/user/createUserPipe.class';
import { UpdateUserPipe } from '../lib/validatePipe/user/updateUserPipe.class';
import { AvatarInput, CreateUserInput, UpdateUserInput } from './user.dto';
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

  @Get()
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Post()
  @ApiBody({ type: CreateUserInput })
  async createUser(@Body(new CreateUserPipe()) userInput: CreateUserInput) {
    return await this.userService.createUser(userInput);
  }

  @Put('/:id')
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateUserInput })
  async updateUser(@Param('id') id: string, @Body(new UpdateUserPipe()) userInput: UpdateUserInput) {
    return await this.userService.updateUser(id, userInput);
  }
}
