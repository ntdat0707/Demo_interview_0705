import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { AuthPayload } from './payload';
import { LoginUserInput, RefreshTokenInput, RegisterAccountInput } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';
import { UserEntity } from '../entities/user.entity';
@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private connection: Connection,
  ) {}

  async verifyTokenClaims(payload: AuthPayload) {
    this.logger.debug('verify token auth');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository.findOne({
      where: { id: payload.id, email: payload.email, code: payload.code },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async login(loginUserInput: LoginUserInput) {
    this.logger.debug('login auth');
    await this.connection.queryResultCache.clear();
    const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
    const user = await this.userRepository.findOne({ where: { email: loginUserInput.email } });
    if (!user) {
      throw new NotFoundException('USER_NOT_EXIST');
    }
    if (!user.password) {
      throw new NotFoundException('USER_NOT_EXIST');
    }
    const passwordIsValid = bcrypt.compareSync(loginUserInput.password, user.password);
    if (!passwordIsValid) {
      throw new BadRequestException('INVALID_PASSWORD');
    }
    const payloadToken = { id: user.id, email: user.email, code: user.code };
    const token = this.jwtService.sign(payloadToken);
    const payloadRefreshToken = {
      id: user.id,
      email: user.email,
      code: user.code,
      token: token,
    };

    const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
      expiresIn: refreshTokenExpireIn,
    });
    return { userId: user.id, token: token, refreshToken: refreshToken };
  }

  async register(registerAccountInput: RegisterAccountInput) {
    this.logger.debug('register auth');
    await this.connection.queryResultCache.clear();
    const existUser = await this.userRepository.findOne({
      where: {
        email: registerAccountInput.email,
      },
    });
    if (existUser) {
      throw new ConflictException('EMAIL_EXISTED');
    }
    const newUser = new UserEntity();
    newUser.setAttributes(registerAccountInput);
    let userCode = '';
    while (true) {
      const random =
        Math.random()
          .toString(36)
          .substring(2, 4) +
        Math.random()
          .toString(36)
          .substring(2, 8);
      const randomCode = random.toUpperCase();
      userCode = randomCode;
      const existCode = await this.userRepository.findOne({
        where: {
          code: userCode,
        },
      });
      if (!existCode) {
        break;
      }
    }
    newUser.code = userCode;
    //clear cache
    await this.userRepository.save(newUser);
    return {
      data: newUser,
    };
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const refreshTokenExpireIn = process.env.REFRESH_TOKEN_EXPIRE_IN || '7d';
    await this.connection.queryResultCache.clear();
    try {
      const refreshTokenPayload: any = jwt.verify(refreshTokenInput.refreshToken, jwtConstants.secret);
      if (refreshTokenInput.token !== refreshTokenPayload.token) {
        throw new BadRequestException('INVALID_TOKEN');
      }
      const existUser = await this.userRepository.findOne({
        where: {
          id: refreshTokenPayload.id,
        },
      });
      if (!existUser) {
        throw new NotFoundException('User not found');
      }
      const payloadToken = { id: existUser.id, email: existUser.email, code: existUser.code };
      const token = this.jwtService.sign(payloadToken);
      const payloadRefreshToken = {
        id: existUser.id,
        email: existUser.email,
        code: existUser.code,
        token: token,
      };
      const refreshToken = jwt.sign(payloadRefreshToken, jwtConstants.secret, {
        expiresIn: refreshTokenExpireIn,
      });
      return { userId: existUser.id, token: token, refreshToken: refreshToken };
    } catch (error) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
  }

  async getProfile(userId: string) {
    this.logger.debug('get profile user login');
    await this.connection.queryResultCache.clear();
    const existUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!existUser) {
      throw new NotFoundException('USER_NOT_EXIST');
    }
    return {
      data: existUser,
    };
  }
}
