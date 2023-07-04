import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

import { UsersController } from './controllers/users.controller';
import { EventsController } from './controllers/events.controller';
import { AnalyticErrorsController } from './controllers/analytic/errors.controller';
import { AnalyticEventsController } from './controllers/analytic/events.controller';
import { AnalyticVisitorsController } from './controllers/analytic/visitors.controller';

import { AuthGuard } from './services/guards/authorization.guard';
import { PermissionGuard } from './services/guards/permission.guard';

import { ConfigService } from './services/config/config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UsersController, EventsController, AnalyticErrorsController, AnalyticEventsController, AnalyticVisitorsController],
  providers: [
    ConfigService,
    {
      provide: 'TOKEN_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('tokenService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'PERMISSION_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          configService.get('permissionService'),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: 'ANALYTIC_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          configService.get('analyticService'),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: 'EVENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          configService.get('eventService'),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule { }
