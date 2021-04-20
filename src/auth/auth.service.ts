import { Injectable, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { Role } from '../entities/role.entity';
import { AuthPayload } from './payload';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private connection: Connection,
  ) {}

  async verifyTokenClaims(payload: AuthPayload) {
    // const customer = await this.customerRepository.findOne({
    //   where: { id: payload.id, email: payload.email, code: payload.code },
    // });
    // if (!customer) {
    //   const employee = await this.employeeRepository.findOne({
    //     where: { id: payload.id, email: payload.email, roleId: payload.roleId },
    //   });
    //   if (!employee) return false;
    // }
    // return true;
  }

  //async login(loginUserInput: LoginCustomerInput) {
  // const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
  // const customer = await this.customerRepository.findOne({ where: { email: loginUserInput.email } });
  // if (!customer) {
  //   throw new NotFoundException('CUSTOMER_NOT_EXIST');
  // }
  // if (!customer.password || !customer.isActive) {
  //   throw new NotFoundException('CUSTOMER_NOT_EXIST');
  // }
  // const passwordIsValid = bcrypt.compareSync(loginUserInput.password, customer.password);
  // if (!passwordIsValid) {
  //   throw new BadRequestException('INVALID_PASSWORD');
  // }
  // const payloadToken = { id: customer.id, email: customer.email, code: customer.code };
  // const token = this.jwtService.sign(payloadToken);
  // const payloadRefreshToken = {
  //   id: customer.id,
  //   email: customer.email,
  //   code: customer.code,
  //   token: token,
  // };
  // const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
  //   expiresIn: refreshTokenExpireIn,
  // });
  // return { customerId: customer.id, token: token, refreshToken: refreshToken };
  // }

  //  async register(avatar: any, registerAccountInput: RegisterAccountInput) {
  // let existCustomer: Customer = await this.customerRepository.findOne({
  //   where: {
  //     email: registerAccountInput.email,
  //   },
  // });
  // if (existCustomer) {
  //   throw new ConflictException('EMAIL_EXISTED');
  // }
  // existCustomer = await this.customerRepository.findOne({
  //   where: {
  //     phoneNumber: registerAccountInput.phoneNumber,
  //   },
  // });
  // if (existCustomer) {
  //   throw new ConflictException('PHONE_EXISTED');
  // }
  // let newCustomer = new Customer();
  // newCustomer.setAttributes(registerAccountInput);
  // if (avatar) {
  //   newCustomer.avatar = avatar.filename;
  // }
  // let customerCode = '';
  // while (true) {
  //   const random =
  //     Math.random()
  //       .toString(36)
  //       .substring(2, 4) +
  //     Math.random()
  //       .toString(36)
  //       .substring(2, 8);
  //   const randomCode = random.toUpperCase();
  //   customerCode = randomCode;
  //   const existCode = await this.customerRepository.findOne({
  //     where: {
  //       code: customerCode,
  //     },
  //   });
  //   if (!existCode) {
  //     break;
  //   }
  // }
  // newCustomer.code = customerCode;
  // //clear cache
  // await this.connection.queryResultCache.clear();
  // newCustomer = await this.customerRepository.save(newCustomer);
  // return {
  //   data: newCustomer,
  // };
  //  }

  // refreshToken(refreshTokenInput: RefreshTokenInput) {
  // const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
  // try {
  //   const refreshTokenPayload: any = jwt.verify(refreshTokenInput.refreshToken, jwtConstants.secret);
  //   if (refreshTokenInput.token !== refreshTokenPayload.token) {
  //     throw HttpException;
  //   }
  //   const existCustomer = await this.customerRepository.findOne({
  //     where: {
  //       id: refreshTokenPayload.id,
  //     },
  //   });
  //   if (!existCustomer) {
  //     throw HttpException;
  //   }
  //   const payloadToken = { id: existCustomer.id, email: existCustomer.email, code: existCustomer.code };
  //   const token = this.jwtService.sign(payloadToken);
  //   const payloadRefreshToken = {
  //     id: existCustomer.id,
  //     email: existCustomer.email,
  //     code: existCustomer.code,
  //     token: token,
  //   };
  //   const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
  //     expiresIn: refreshTokenExpireIn,
  //   });
  //   return { customerId: existCustomer.id, token: token, refreshToken: refreshToken };
  // } catch (error) {
  //   throw new UnauthorizedException('INVALID_TOKEN');
  // }
  //}

  // async loginManager(loginManagerInput: LoginManagerInput) {
  // const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
  // const employee = await this.employeeRepository.findOne({ where: { email: loginManagerInput.email } });
  // if (!employee) {
  //   throw new NotFoundException('EMPLOYEE_NOT_FOUND');
  // }
  // const passwordIsValid = bcrypt.compareSync(loginManagerInput.password, employee.password);
  // if (!passwordIsValid) {
  //   throw new BadRequestException('INVALID_PASSWORD');
  // }
  // const payloadToken = { id: employee.id, email: employee.email, roleId: employee.roleId };
  // const token = this.jwtService.sign(payloadToken);
  // const payloadRefreshToken = {
  //   id: employee.id,
  //   email: employee.email,
  //   roleId: employee.roleId,
  //   token: token,
  // };
  // const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
  //   expiresIn: refreshTokenExpireIn,
  // });
  // return { employeeId: employee.id, token: token, refreshToken: refreshToken };
  //  }

  // async refreshTokenManager(refreshTokenInput: RefreshTokenInput) {
  //   const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
  //   try {
  //   const refreshTokenPayload: any = jwt.verify(refreshTokenInput.refreshToken, jwtConstants.secret);
  //   if (refreshTokenInput.token !== refreshTokenPayload.token) {
  //     throw HttpException;
  //   }

  //   const existEmployee = await this.employeeRepository.findOne({
  //     where: {
  //       id: refreshTokenPayload.id,
  //     },
  //   });
  //   if (!existEmployee) {
  //     throw HttpException;
  //   }

  //   const payloadToken = { id: existEmployee.id, email: existEmployee.email, roleId: existEmployee.roleId };
  //   const token = this.jwtService.sign(payloadToken);

  //   const payloadRefreshToken = {
  //     id: existEmployee.id,
  //     email: existEmployee.email,
  //     roleId: existEmployee.roleId,
  //     token: token,
  //   };
  //   const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
  //     expiresIn: refreshTokenExpireIn,
  //   });

  //   return { employeeId: existEmployee.id, token: token, refreshToken: refreshToken };
  // } catch (error) {
  //   throw new UnauthorizedException('INVALID_TOKEN');
  // }
  // }

  // async getProfile(customerId: string) {
  //   const existCustomer = await this.customerRepository.findOne({
  //     where: {
  //       id: customerId,
  //     },
  //   });

  //   if (!existCustomer) {
  //     throw new NotFoundException('CUSTOMER_NOT_EXIST');
  //   }

  //   return {
  //     data: existCustomer,
  //   };
  // }

  // async getProfileAdmin(employeeId: string) {
  //   const existEmployee = await this.employeeRepository.findOne({
  //     where: {
  //       id: employeeId,
  //     },
  //   });

  //   if (!existEmployee) {
  //     throw new NotFoundException('EMPLOYEE_NOT_FOUND');
  //   }
  //   return {
  //     data: existEmployee,
  //   };
  // }
}
