import { Controller, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';

@Controller('auth')
@ApiTags('Auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('login')
  // login(@Body(new LoginPipe()) loginUserInput: LoginCustomerInput) {
  //   return this.authService.login(loginUserInput);
  // }

  // @Post('register')
  // @UseInterceptors(FileInterceptor('avatar'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   type: RegisterAccountInput,
  // })
  // async createUser(@UploadedFile() avatar: any, @Body(new RegisterPipe()) registerAccountInput: RegisterAccountInput) {
  //   return this.authService.register(avatar, registerAccountInput);
  // }

  // @Post('refresh-token')
  // async refreshToken(@Body() refreshTokenInput: RefreshTokenInput) {
  //   return await this.authService.refreshToken(refreshTokenInput);
  // }

  // @Post('/admin/login')
  // loginManager(@Body(new LoginManagerPipe()) loginManagerInput: LoginManagerInput) {
  //   return this.authService.loginManager(loginManagerInput);
  // }

  // @Post('/admin/refresh-token')
  // async refreshTokenManager(@Body() refreshTokenInput: RefreshTokenInput) {
  //   return await this.authService.refreshTokenManager(refreshTokenInput);
  // }

  // @Get('/me')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // getProfile(@GetUser('userId') customerId: string) {
  //   return this.authService.getProfile(customerId);
  // }

  // @Get('admin/me')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // getProfileAdmin(@GetUser('employeeId') employeeId: string) {
  //   return this.authService.getProfileAdmin(employeeId);
  // }
}
