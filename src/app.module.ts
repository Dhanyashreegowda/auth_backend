import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UserService } from './users/services/user.service';
import { UsersModule } from './users/users.module'; // Import UsersModule
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Invent@123',
      database: 'nest_auth',
      entities: [User],
      synchronize: true,
    }),
    UsersModule, // Ensure UsersModule is imported here
    AuthModule,
  ],
})
export class AppModule {}
