import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect('mongodb://localhost/nest'),
    },
];

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class MongooseModule {}
