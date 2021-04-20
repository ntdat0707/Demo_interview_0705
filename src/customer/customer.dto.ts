import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerInput {
  @ApiProperty({ required: false })
  readonly fullName?: string;
}

export class CreateCustomerInput {
  @ApiProperty({ required: false })
  readonly email: string;

  @ApiProperty()
  readonly fullName: string;
}

export class ChangePasswordInput {
  @ApiProperty()
  readonly currentPassword: string;

  @ApiProperty()
  readonly newPassword: string;
}
