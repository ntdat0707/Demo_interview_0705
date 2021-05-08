import { ApiProperty } from '@nestjs/swagger';
import { EUserStatus } from '../lib/constant';

export class AvatarInput {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly image: string;
}

export class CreateUserInput {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly userName: string;

  @ApiProperty({ required: false })
  readonly fullName: string;

  @ApiProperty({ required: false })
  readonly avatar: string;

  @ApiProperty({ enum: Object.values(EUserStatus), required: false })
  readonly status: string;
}

export class UpdateUserInput {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly userName: string;

  @ApiProperty({ required: false })
  readonly fullName: string;

  @ApiProperty({ required: false })
  readonly avatar: string;

  @ApiProperty({ required: false })
  readonly password: string;

  @ApiProperty({ enum: Object.values(EUserStatus), required: false })
  readonly status: string;
}

export class GetUserInput {
  @ApiProperty({ required: false })
  readonly from: string;

  @ApiProperty({ required: false })
  readonly to: string;
}
