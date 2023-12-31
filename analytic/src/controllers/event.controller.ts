import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { EventService } from '../services/event.service';
import { IEvent } from '../interfaces/event/event.interface';
import { IEventUpdateParams } from '../interfaces/event/event-update-params.interface';
import { IEventSearchByUserResponse } from '../interfaces/event/event-search-by-user-response.interface';
import { IEventDeleteResponse } from '../interfaces/event/event-delete-response.interface';
import { IEventCreateResponse } from '../interfaces/event/event-create-response.interface';
import { IEventUpdateByIdResponse } from '../interfaces/event/event-update-by-id-response.interface';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @MessagePattern('event_search_by_visitor_id')
  public async eventSearchByUserId(
    userId: string,
  ): Promise<IEventSearchByUserResponse> {
    let result: IEventSearchByUserResponse;

    if (userId) {
      const events = await this.eventService.getEventsByVisitorId(userId);
      result = {
        status: HttpStatus.OK,
        message: 'event_search_by_visitor_id_success',
        events,
      };
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'event_search_by_visitor_id_bad_request',
        events: null,
      };
    }

    return result;
  }

  @MessagePattern('event_update_by_id')
  public async eventUpdateById(params: {
    event: IEventUpdateParams;
    id: string;
    userId: string;
  }): Promise<IEventUpdateByIdResponse> {
    let result: IEventUpdateByIdResponse;
    if (params.id) {
      try {
        const event = await this.eventService.findEventById(params.id);
        if (event) {

          const updatedEvent = Object.assign(event, params.event);
          await updatedEvent.save();
          result = {
            status: HttpStatus.OK,
            message: 'event_update_by_id_success',
            event: updatedEvent,
            errors: null,
          };

        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'event_update_by_id_not_found',
            event: null,
            errors: null,
          };
        }
      } catch (e: any) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'event_update_by_id_precondition_failed',
          event: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'event_update_by_id_bad_request',
        event: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('event_create')
  public async eventCreate(eventBody: IEvent): Promise<IEventCreateResponse> {
    let result: IEventCreateResponse;

    if (eventBody) {
      try {
        const event = await this.eventService.createEvent(eventBody);
        result = {
          status: HttpStatus.CREATED,
          message: 'event_create_success',
          event,
          errors: null,
        };
      } catch (e: any) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'event_create_precondition_failed',
          event: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'event_create_bad_request',
        event: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('event_delete_by_id')
  public async eventDeleteForUser(params: {
    userId: string;
    id: string;
  }): Promise<IEventDeleteResponse> {
    let result: IEventDeleteResponse;

    if (params && params.userId && params.id) {
      try {
        const event = await this.eventService.findEventById(params.id);

        if (event) {

          await this.eventService.removeEventById(params.id);
          result = {
            status: HttpStatus.OK,
            message: 'event_delete_by_id_success',
            errors: null,
          };

        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'event_delete_by_id_not_found',
            errors: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.FORBIDDEN,
          message: 'event_delete_by_id_forbidden',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'event_delete_by_id_bad_request',
        errors: null,
      };
    }

    return result;
  }
}
