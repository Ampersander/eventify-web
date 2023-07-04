import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from './services/config/mongo-config.service';

import { EventService } from './services/event.service';
import { ErrorService } from './services/error.service';
import { VisitorService } from './services/visitor.service';

import { EventSchema } from './schemas/event.schema';
import { ErrorSchema } from './schemas/error.schema';
import { VisitorSchema } from './schemas/visitor.schema';

import { EventController } from './controllers/event.controller';
import { ErrorController } from './controllers/error.controller';
import { VisitorController } from './controllers/visitor.controller';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Event',
        schema: EventSchema,
      },
      {
        name: 'Error',
        schema: ErrorSchema,
      },
      {
        name: 'Visitor',
        schema: VisitorSchema,
      }
    ]),
  ],
  controllers: [EventController, ErrorController, VisitorController],
  providers: [EventService, ErrorService, VisitorService],
})
export class AnalyticModule { }
