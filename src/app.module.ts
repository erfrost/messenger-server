import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Images } from './entities/images.entity';
import { SearchModule } from './search/search.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FriendsModule } from './friends/friends.module';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'root',
      database: 'messenger',
      synchronize: true,
      entities: ['dist/**/*/*.entity{.ts,.js}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: 'images',
      serveRoot: '/images',
    }),
    TypeOrmModule.forFeature([Images]),
    AuthModule,
    UserModule,
    SearchModule,
    FriendsModule,
    MessengerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
