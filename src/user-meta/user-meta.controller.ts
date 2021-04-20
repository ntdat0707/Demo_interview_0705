import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserMetaPipe } from '../lib/validatePipe/user-meta/createUserMetaPipe.class';
import { UserMetaInput } from './user-meta.dto';
import { UserMetaService } from './user-meta.service';

@Controller('user-meta')
@ApiTags('User-meta')
export class UserMetaController {
  constructor(private userMetaService: UserMetaService) {}
  @Post()
  @ApiBody({ type: UserMetaInput })
  async createUser(@Body(new CreateUserMetaPipe()) userMetaInput: UserMetaInput) {
    return await this.userMetaService.creatUserMeta(userMetaInput);
  }
}
