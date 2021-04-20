import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { AuthPayload } from './payload';
import { CustomerEntity } from '../entities/customer.entity';
import { LoginCustomerInput, RefreshTokenInput, RegisterAccountInput } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';
@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerEntity) private customerRepository: Repository<CustomerEntity>,
    private jwtService: JwtService,
    private connection: Connection,
  ) {}

  async verifyTokenClaims(payload: AuthPayload) {
    const customer = await this.customerRepository.findOne({
      where: { id: payload.id, email: payload.email, code: payload.code },
    });
    if (!customer) {
      return false;
    }
    return true;
  }

  async login(loginUserInput: LoginCustomerInput) {
    const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
    const customer = await this.customerRepository.findOne({ where: { email: loginUserInput.email } });
    if (!customer) {
      throw new NotFoundException('CUSTOMER_NOT_EXIST');
    }
    if (!customer.password) {
      throw new NotFoundException('CUSTOMER_NOT_EXIST');
    }
    const passwordIsValid = bcrypt.compareSync(loginUserInput.password, customer.password);
    if (!passwordIsValid) {
      throw new BadRequestException('INVALID_PASSWORD');
    }
    const payloadToken = { id: customer.id, email: customer.email, code: customer.code };
    const token = this.jwtService.sign(payloadToken);
    const payloadRefreshToken = {
      id: customer.id,
      email: customer.email,
      code: customer.code,
      token: token,
    };

    const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
      expiresIn: refreshTokenExpireIn,
    });
    return { customerId: customer.id, token: token, refreshToken: refreshToken };
  }

  async register(registerAccountInput: RegisterAccountInput) {
    const existCustomer = await this.customerRepository.findOne({
      where: {
        email: registerAccountInput.email,
      },
    });
    if (existCustomer) {
      throw new ConflictException('EMAIL_EXISTED');
    }
    let newCustomer = new CustomerEntity();
    newCustomer.setAttributes(registerAccountInput);
    let customerCode = '';
    while (true) {
      const random =
        Math.random()
          .toString(36)
          .substring(2, 4) +
        Math.random()
          .toString(36)
          .substring(2, 8);
      const randomCode = random.toUpperCase();
      customerCode = randomCode;
      const existCode = await this.customerRepository.findOne({
        where: {
          code: customerCode,
        },
      });
      if (!existCode) {
        break;
      }
    }
    newCustomer.code = customerCode;
    //clear cache
    await this.connection.queryResultCache.clear();
    newCustomer = await this.customerRepository.save(newCustomer);
    return {
      data: newCustomer,
    };
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
    try {
      const refreshTokenPayload: any = jwt.verify(refreshTokenInput.refreshToken, jwtConstants.secret);
      if (refreshTokenInput.token !== refreshTokenPayload.token) {
        throw new BadRequestException('INVALID_TOKEN');
      }
      const existCustomer = await this.customerRepository.findOne({
        where: {
          id: refreshTokenPayload.id,
        },
      });
      if (!existCustomer) {
        throw new NotFoundException('Customer not found');
      }
      const payloadToken = { id: existCustomer.id, email: existCustomer.email, code: existCustomer.code };
      const token = this.jwtService.sign(payloadToken);
      const payloadRefreshToken = {
        id: existCustomer.id,
        email: existCustomer.email,
        code: existCustomer.code,
        token: token,
      };
      const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
        expiresIn: refreshTokenExpireIn,
      });
      return { customerId: existCustomer.id, token: token, refreshToken: refreshToken };
    } catch (error) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
  }

  async getProfile(customerId: string) {
    const existCustomer = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (!existCustomer) {
      throw new NotFoundException('CUSTOMER_NOT_EXIST');
    }
    return {
      data: existCustomer,
    };
  }
}
