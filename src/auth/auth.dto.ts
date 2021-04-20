import { ApiProperty } from '@nestjs/swagger';

export class LoginCustomerInput {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;
}

export class RefreshTokenInput {
  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class PasswordRecoveryInput {
  @ApiProperty()
  readonly email: string;
}

export class ChangePasswordWithCodeInput {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly newPassword: string;
  @ApiProperty()
  readonly code: string;
}
export class RegisterAccountInput {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly fullName: string;
}
