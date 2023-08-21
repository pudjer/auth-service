import {ConfigService} from "@nestjs/config";
import {ymlParamsToObject} from "../utils/ymlParamsToObject";
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

export const getMongoConfig = async (configServise: ConfigService): Promise<MongooseModuleFactoryOptions> => {
    console.log(getMongoURI(configServise))
    return {
        uri: getMongoURI(configServise),
        ...getMongoOptions(),
    }
}
const getMongoURI = (configService: ConfigService) => {
    return 'mongodb://' +
        ymlParamsToObject(configService.get('services.mongo.environment'))['MONGO_INITDB_ROOT_USERNAME'] +
        ':' +
        ymlParamsToObject(configService.get('services.mongo.environment'))['MONGO_INITDB_ROOT_PASSWORD'] +
        '@' +
        (configService.get('MONGO_HOST') || 'localhost') +
        ':' +
        configService.get('services.mongo.ports')[0].split(':')[0] +
        '/' +
        configService.get('MONGO_AUTHDATABASE')


}
const getMongoOptions = (): Omit<MongooseModuleFactoryOptions, 'uri'> => ({
})