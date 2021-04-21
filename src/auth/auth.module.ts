import { CustomerEntity } from './../entities/customer.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtConfig } from './jwtConfig.class';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  providers: [AuthService, JwtStrategy, CustomerService],
  controllers: [AuthController],
})
export class AuthModule {}
