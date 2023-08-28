import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MeController } from './me.controller';
import { UserScheme } from '../models/User';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../models/User';
import { Location, LocationSchema } from '../models/Location';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
      {name: Location.name, schema: LocationSchema}
    ])
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [MeController],
})
export class UsersModule {}
