import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CreateUserPipe } from '../lib/validatePipe/user/createUserPipe.class';
import { UpdateUserPipe } from '../lib/validatePipe/user/updateUserPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'filterValue', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  async getAllUser(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('filterValue') filterValue: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return await this.userService.getAllUser(page, limit, filterValue, from, to);
  }

  @Get('/:id')
  async getUserById(@Param('id', new CheckUUID()) id: string) {
    return await this.userService.getUserById(id);
  }

  @Post()
  @ApiBody({ type: CreateUserInput })
  async createUser(@Body(new CreateUserPipe()) userInput: CreateUserInput) {
    return await this.userService.createUser(userInput);
  }

  @Put('/:id')
  @ApiBody({ type: UpdateUserInput })
  async updateUser(@Param('id', new CheckUUID()) id: string, @Body(new UpdateUserPipe()) userInput: UpdateUserInput) {
    return await this.userService.updateUser(id, userInput);
  }

  @Delete('/:id')
  async deleteUser(@Param('id', new CheckUUID()) id: string) {
    return await this.userService.deleteUser(id);
  }
}
