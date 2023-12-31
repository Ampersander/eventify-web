import {
  Controller,
  Inject,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Authorization } from '../decorators/authorization.decorator';
import { Permission } from '../decorators/permission.decorator';

import { IAuthorizedRequest } from '../interfaces/common/authorized-request.interface';
import { IServiceEventCreateResponse } from '../interfaces/event/service-event-create-response.interface';
import { IServiceEventDeleteResponse } from '../interfaces/event/service-event-delete-response.interface';
import { IServiceEventSearchByUserIdResponse } from '../interfaces/event/service-event-search-by-user-id-response.interface';
import { IServiceEventUpdateByIdResponse } from '../interfaces/event/service-event-update-by-id-response.interface';
import { GetEventsResponseDto } from '../interfaces/event/dto/get-events-response.dto';
import { CreateEventResponseDto } from '../interfaces/event/dto/create-event-response.dto';
import { DeleteEventResponseDto } from '../interfaces/event/dto/delete-event-response.dto';
import { UpdateEventResponseDto } from '../interfaces/event/dto/update-event-response.dto';
import { CreateEventDto } from '../interfaces/event/dto/create-event.dto';
import { UpdateEventDto } from '../interfaces/event/dto/update-event.dto';
import { EventIdDto } from '../interfaces/event/dto/event-id.dto';

@ApiBearerAuth()
@Controller('events2')
@ApiTags('events2')
export class EventsController {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventServiceClient: ClientProxy,
  ) {}

  @Get()
  @Authorization(true)
  @Permission('event_search_by_user_id')
  @ApiOkResponse({
    type: GetEventsResponseDto,
    description: 'List of events for signed in user',
  })
  public async getEvents(
    @Req() request: IAuthorizedRequest,
  ): Promise<GetEventsResponseDto> {
    const userInfo = request.user;

    const eventsResponse: IServiceEventSearchByUserIdResponse =
      await firstValueFrom(
        this.eventServiceClient.send('event_search_by_user_id', userInfo.id),
      );

    return {
      message: eventsResponse.message,
      data: {
        events: eventsResponse.events,
      },
      errors: null,
    };
  }

  @Post()
  @Authorization(true)
  @Permission('event_create')
  @ApiCreatedResponse({
    type: CreateEventResponseDto,
  })
  public async createEvent(
    @Req() request: IAuthorizedRequest,
    @Body() eventRequest: CreateEventDto,
  ): Promise<CreateEventResponseDto> {
    const userInfo = request.user;
    const createEventResponse: IServiceEventCreateResponse = await firstValueFrom(
      this.eventServiceClient.send(
        'event_create',
        Object.assign(eventRequest, { user_id: userInfo.id }),
      ),
    );

    if (createEventResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createEventResponse.message,
          data: null,
          errors: createEventResponse.errors,
        },
        createEventResponse.status,
      );
    }

    return {
      message: createEventResponse.message,
      data: {
        event: createEventResponse.event,
      },
      errors: null,
    };
  }

  @Delete(':id')
  @Authorization(true)
  @Permission('event_delete_by_id')
  @ApiOkResponse({
    type: DeleteEventResponseDto,
  })
  public async deleteEvent(
    @Req() request: IAuthorizedRequest,
    @Param() params: EventIdDto,
  ): Promise<DeleteEventResponseDto> {
    const userInfo = request.user;

    const deleteEventResponse: IServiceEventDeleteResponse = await firstValueFrom(
      this.eventServiceClient.send('event_delete_by_id', {
        id: params.id,
        userId: userInfo.id,
      }),
    );

    if (deleteEventResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteEventResponse.message,
          errors: deleteEventResponse.errors,
          data: null,
        },
        deleteEventResponse.status,
      );
    }

    return {
      message: deleteEventResponse.message,
      data: null,
      errors: null,
    };
  }

  @Put(':id')
  @Authorization(true)
  @Permission('event_update_by_id')
  @ApiOkResponse({
    type: UpdateEventResponseDto,
  })
  public async updateEvent(
    @Req() request: IAuthorizedRequest,
    @Param() params: EventIdDto,
    @Body() eventRequest: UpdateEventDto,
  ): Promise<UpdateEventResponseDto> {
    const userInfo = request.user;
    const updateEventResponse: IServiceEventUpdateByIdResponse =
      await firstValueFrom(
        this.eventServiceClient.send('event_update_by_id', {
          id: params.id,
          userId: userInfo.id,
          event: eventRequest,
        }),
      );

    if (updateEventResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateEventResponse.message,
          errors: updateEventResponse.errors,
          data: null,
        },
        updateEventResponse.status,
      );
    }

    return {
      message: updateEventResponse.message,
      data: {
        event: updateEventResponse.event,
      },
      errors: null,
    };
  }
}
