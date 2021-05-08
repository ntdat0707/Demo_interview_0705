import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '../auth/jwtConfig.class';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, UserEntity]),
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  providers: [PostService, JwtStrategy, UserService, AuthService],
  controllers: [PostController],
})
export class PostModule {}
