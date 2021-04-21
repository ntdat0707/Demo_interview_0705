import { Body, Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { LoginPipe } from '../lib/validatePipe/customer/loginPipe.class';
import { LoginCustomerInput, RefreshTokenInput, RegisterAccountInput } from './auth.dto';
import { RegisterPipe } from '../lib/validatePipe/customer/registerPipe.class';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';

@Controller('auth')
@ApiTags('Auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(new LoginPipe()) loginUserInput: LoginCustomerInput) {
    return await this.authService.login(loginUserInput);
  }

  @Post('register')
  @ApiBody({
    type: RegisterAccountInput,
  })
  async createUser(@Body(new RegisterPipe()) registerAccountInput: RegisterAccountInput) {
    return await this.authService.register(registerAccountInput);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenInput: RefreshTokenInput) {
    return await this.authService.refreshToken(refreshTokenInput);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser('customerId') customerId: string) {
    return await this.authService.getProfile(customerId);
  }
}
