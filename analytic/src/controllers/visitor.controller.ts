import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { VisitorService } from '../services/visitor.service';
import { IVisitor } from '../interfaces/visitor/visitor.interface';
import { IVisitorUpdateParams } from '../interfaces/visitor/visitor-update-params.interface';
import { IVisitorSearchByUserResponse } from '../interfaces/visitor/visitor-search-by-user-response.interface';
import { IVisitorDeleteResponse } from '../interfaces/visitor/visitor-delete-response.interface';
import { IVisitorCreateResponse } from '../interfaces/visitor/visitor-create-response.interface';
import { IVisitorUpdateByIdResponse } from '../interfaces/visitor/visitor-update-by-id-response.interface';

@Controller()
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) { }

  @MessagePattern('visitor_search_by_visitor_id')
  public async visitorSearchByUserId(
    userId: string,
  ): Promise<IVisitorSearchByUserResponse> {
    let result: IVisitorSearchByUserResponse;

    if (userId) {
      const visitors = await this.visitorService.getVisitorById(userId);
      result = {
        status: HttpStatus.OK,
        message: 'visitor_search_by_visitor_id_success',
        visitors,
      };
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'visitor_search_by_visitor_id_bad_request',
        visitors: null,
      };
    }

    return result;
  }

  @MessagePattern('visitor_update_by_id')
  public async visitorUpdateById(params: {
    visitor: IVisitorUpdateParams;
    id: string;
    userId: string;
  }): Promise<IVisitorUpdateByIdResponse> {
    let result: IVisitorUpdateByIdResponse;
    if (params.id) {
      try {
        const visitor = await this.visitorService.findVisitorById(params.id);
        if (visitor) {

          const updatedVisitor = Object.assign(visitor, params.visitor);
          await updatedVisitor.save();
          result = {
            status: HttpStatus.OK,
            message: 'visitor_update_by_id_success',
            visitor: updatedVisitor,
            errors: null,
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'visitor_update_by_id_not_found',
            visitor: null,
            errors: null,
          };
        }
      } catch (e: any) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'visitor_update_by_id_precondition_failed',
          visitor: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'visitor_update_by_id_bad_request',
        visitor: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('visitor_create')
  public async visitorCreate(visitorBody: IVisitor): Promise<IVisitorCreateResponse> {
    let result: IVisitorCreateResponse;

    if (visitorBody) {
      try {

        const visitor = await this.visitorService.createVisitor(visitorBody);
        result = {
          status: HttpStatus.CREATED,
          message: 'visitor_create_success',
          visitor,
          errors: null,
        };
      } catch (e: any) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'visitor_create_precondition_failed',
          visitor: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'visitor_create_bad_request',
        visitor: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('visitor_delete_by_id')
  public async visitorDeleteForUser(params: {
    userId: string;
    id: string;
  }): Promise<IVisitorDeleteResponse> {
    let result: IVisitorDeleteResponse;

    if (params && params.userId && params.id) {
      try {
        const visitor = await this.visitorService.findVisitorById(params.id);

        if (visitor) {

          result = {
            status: HttpStatus.FORBIDDEN,
            message: 'visitor_delete_by_id_forbidden',
            errors: null,
          };
        }

      } catch (e) {
        result = {
          status: HttpStatus.FORBIDDEN,
          message: 'visitor_delete_by_id_forbidden',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'visitor_delete_by_id_bad_request',
        errors: null,
      };
    }

    return result;
  }
}
