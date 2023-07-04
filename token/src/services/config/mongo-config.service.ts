import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      dbName: 'chat-with-me-token',
      uri: process.env.MONGO_DSN,
    };
  }
}
