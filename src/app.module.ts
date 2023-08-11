import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import yamlConfiguration from "./config/yamlConfiguration";
import {AuthModule} from './auth/auth.module';
import {UsersModule} from "./users/users.module";
import { MongooseModule } from './mongoose/mongoose.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [yamlConfiguration],
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    UsersModule,
    MongooseModule
  ],
})
export class AppModule {}
