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

import { Authorization } from '../../decorators/authorization.decorator';

import { IAuthorizedRequest } from '../../interfaces/common/authorized-request.interface';
import { IServiceEventCreateResponse } from '../../interfaces/analytic/event/service-analytic-event-create-response.interface';
import { IServiceEventDeleteResponse } from '../../interfaces/analytic/event/service-analytic-event-delete-response.interface';
import { IServiceEventSearchByUserIdResponse } from '../../interfaces/analytic/event/service-analytic-event-search-by-user-id-response.interface';
import { IServiceEventUpdateByIdResponse } from '../../interfaces/analytic/event/service-analytic-event-update-by-id-response.interface';
import { GetEventsResponseDto } from '../../interfaces/analytic/event/dto/get-events-response.dto';
import { CreateEventResponseDto } from '../../interfaces/analytic/event/dto/create-event-response.dto';
import { DeleteEventResponseDto } from '../../interfaces/analytic/event/dto/delete-event-response.dto';
import { UpdateEventResponseDto } from '../../interfaces/analytic/event/dto/update-event-response.dto';
import { CreateEventDto } from '../../interfaces/analytic/event/dto/create-event.dto';
import { UpdateEventDto } from '../../interfaces/analytic/event/dto/update-event.dto';
import { EventIdDto } from '../../interfaces/analytic/event/dto/event-id.dto';
import { IIDVisitor } from '../../interfaces/analytic/visitor/visitor-id.interface';


@Controller('events')
@ApiTags('events')
export class AnalyticEventsController {
  constructor(
    @Inject('ANALYTIC_SERVICE') private readonly analyticServiceClient: ClientProxy,
  ) { }

  @Get()
  @Authorization(true)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: GetEventsResponseDto,
    description: 'List of events for a visitor',
  })
  public async getEvents(
    @Req() request: IAuthorizedRequest,
    @Body() visitorIDRequest: IIDVisitor,
  ): Promise<GetEventsResponseDto> {
    const userInfo = request.user;

    const eventsResponse: IServiceEventSearchByUserIdResponse =
      await firstValueFrom(
        this.analyticServiceClient.send('event_search_by_visitor_id', visitorIDRequest),
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
  @ApiCreatedResponse({
    type: CreateEventResponseDto,
  })
  public async createEvent(
    @Req() request: IAuthorizedRequest,
    @Body() eventRequest: CreateEventDto,
  ): Promise<CreateEventResponseDto> {
    const userInfo = request.user;
    const createEventResponse: IServiceEventCreateResponse = await firstValueFrom(
      this.analyticServiceClient.send(
        'event_create',
        eventRequest
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
  @ApiBearerAuth()
  @Authorization(true)
  @ApiOkResponse({
    type: DeleteEventResponseDto,
  })
  public async deleteEvent(
    @Req() request: IAuthorizedRequest,
    @Param() params: EventIdDto,
  ): Promise<DeleteEventResponseDto> {
    const userInfo = request.user;

    const deleteEventResponse: IServiceEventDeleteResponse = await firstValueFrom(
      this.analyticServiceClient.send('event_delete_by_id', {
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
  @ApiBearerAuth()
  @Authorization(true)
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
        this.analyticServiceClient.send('event_update_by_id', {
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
